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
  const q = `SELECT DISTINCT t.*
  FROM (
      SELECT ${database}.results.*, filtered_apps_categories.category
      FROM results
      LEFT JOIN (
          SELECT package, category
          FROM apps_categories
          WHERE category != 'not available'
      ) AS filtered_apps_categories
      ON results.package = filtered_apps_categories.package
  ) AS t;`;
  db.query(q, (err, data) => {
    if (err) return res.status(401).json(err);
    return res.json(data);
  });
});

module.exports = router;
