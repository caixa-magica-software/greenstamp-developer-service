const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();

const host = process.env.DATABASE_URI;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASS;
const database = process.env.DATABASE_NAME;

const db = mysql.createConnection({
  host,
  user,
  password,
  database,
});

router.get("/", (req, res) => {
  const q = "SELECT * FROM " + database + ".results";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

module.exports = router;
