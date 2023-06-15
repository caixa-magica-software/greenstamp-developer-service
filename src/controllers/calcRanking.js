const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const host = process.env.DATABASE_URI;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASS;
const database = process.env.DATABASE_NAME;
const port = process.env.DATABASE_PORT;

const db = mysql.createConnection({
  host,
  user,
  password,
  database,
  port,
});

const q = `SELECT version, package, app_name, tests, sum, categories, ranking
FROM (
    SELECT version, package, app_name, tests, sum, categories,
    IF(sum IS NOT NULL, @rank := IF(@prevSum = sum, @rank, @rank + 1), NULL) AS ranking,
    @prevSum := sum
    FROM (
        SELECT r.version, r.package, r.app_name,
        JSON_ARRAYAGG(
            JSON_OBJECT('name', r.test_name, 'param', r.test_parameter, 'result', r.test_result, 'timestamp', r.timestamp)
        ) AS tests,
        SUM(r.test_result) AS sum,
        (
            SELECT JSON_ARRAYAGG(ac.category)
            FROM ${database}.apps_categories ac
            WHERE r.package = ac.package AND ac.category != 'not available'
        ) AS categories
        FROM ${database}.results r
        WHERE (r.package,r.version) IN (
            SELECT package, MAX(version)
            FROM ${database}.results
            GROUP BY package
        )
        GROUP BY r.package, r.version, r.app_name
        ORDER BY sum
    ) ranked
    CROSS JOIN (SELECT @rank := 0) vars
    ORDER BY sum
) final;`;

const query = (callback) => {
  db.query(q, (err, data) => {
    if (err) console.log("Error fetching from database");

    callback(data);
  });
};

// gets formatted results from the database, similarly to the get-all-formatted route
// and then calculates the app's ranking in its category
exports.calcRanking = (result, callback) => {
  query((response) => {
    //analyzed app's category
    let appCategory = result.data.categories[0];
    if (typeof result.data.categories === "string") {
      const appCategories = JSON.parse(result.data.categories);
      appCategory = appCategories[0];
    }
    if (appCategory === null) appCategory = "other";

    // finds all apps matching the analyzed app's categories
    let apps = [];
    response.forEach((app) => {
      if (typeof app.categories === "string") {
        app.categories = JSON.parse(app.categories);
      }
      if (app.categories === null) {
        app.categories = ["other"];
      }

      app.categories.forEach((category) => {
        if (app.wasPushed == true) return;

        if (category == appCategory) {
          app.wasPushed = true;
          apps.push(app);
        }
      });
    });

    apps.sort((a, b) => a.ranking - b.ranking);
    let prevRanking = -1;
    let rank = 1;
    let rankArray = [];
    apps.forEach((app) => {
      if (typeof app.tests === "string") app.tests = JSON.parse(app.tests);

      if (
        app.sum == null ||
        app.ranking == null ||
        app.sum === "X" ||
        app.ranking === "X"
      ) {
        app.ranking = "X";
        app.sum = "X";
        rankArray.push(app);
        return;
      }

      if (app.ranking !== prevRanking && prevRanking !== -1) {
        rank++;
      }

      prevRanking = app.ranking;
      app.ranking = rank;

      rankArray.push(app);
    });

    const myApp = rankArray.find(obj => obj.package === result.data.packageName);

    let data = result.data;
    data.ranking = myApp.ranking;

    console.log("Returned ranking in response: " + data.ranking)

    callback(data);
  });
};
