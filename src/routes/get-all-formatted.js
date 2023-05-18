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

router.get("/", (req, res) => {
  // Rankings are the same if the warnings sum value is the same
  const q1 = `SELECT version, package, app_name, tests, sum, categories, ranking
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
            GROUP BY r.package, r.version, r.app_name
            ORDER BY sum
        ) ranked
        CROSS JOIN (SELECT @rank := 0) vars
        ORDER BY sum
    ) final;`;

  // Rankings are different if the warnings sum value is the same
  const q2 = `SELECT version, package, app_name, tests, sum, categories,
  IF(sum IS NOT NULL, @rank := IF(@prevSum = sum, @rank, @rank + 1), NULL) AS ranking
  FROM (
  SELECT r.version, r.package, r.app_name,
   JSON_ARRAYAGG(
   JSON_OBJECT('name', r.test_name, 'param', r.test_parameter, 'result', r.test_result, 'timestamp', r.timestamp)
   ) AS tests,
   SUM(r.test_result) AS sum,
   (SELECT JSON_ARRAYAGG(ac.category) FROM ${database}.apps_categories ac WHERE r.package = ac.package AND r.version = ac.version AND ac.category != 'not available') AS categories
  FROM ${database}.results r
  GROUP BY r.package, r.version, r.app_name
  ORDER BY sum
  ) ranked
  CROSS JOIN (SELECT @rank := 0, @prevSum := NULL) vars
  ORDER BY sum;`;

  db.query(q1, (err, data) => {
    if (err) return res.status(401).json({ err });
    return res.json({ data });
  });
});

module.exports = router;
