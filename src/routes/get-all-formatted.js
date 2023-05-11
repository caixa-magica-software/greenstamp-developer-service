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
  // const q = `SELECT version, package, app_name,
  // JSON_ARRAYAGG(
  //     JSON_OBJECT('name', test_name, 'param', test_parameter, 'result', test_result)
  // ) AS tests
  // FROM ${database}.results
  // GROUP BY version, package, app_name;`;
  const q = `SELECT version, package, app_name,
  JSON_ARRAYAGG(
  JSON_OBJECT('name', test_name, 'param', test_parameter, 'result', test_result)
  ) AS tests,
  SUM(test_result) AS sum
  FROM ${database}.results
  GROUP BY package, version, app_name;`;

  db.query(q, (err, data) => {
    if (err) return res.status(401).json({ err });
    return res.json({ data });
  });
});

module.exports = router;
