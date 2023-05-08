const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();

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
  const q = `SELECT mysql.results.*, filtered_apps_categories.category
  FROM results
  INNER JOIN (
      SELECT package, MAX(category) AS category
      FROM apps_categories
      WHERE category != 'not available'
      GROUP BY package
  ) AS filtered_apps_categories
  ON results.package = filtered_apps_categories.package;`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

module.exports = router;
