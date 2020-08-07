const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Dianalopes99.",
  database: "teste",
});

app.get("/", (req, res) => {
  res.send("Hello Fucking World!");
});

app.get("/test", (req, res) => {
  const testeQuery = "SELECT * FROM teste";
  pool.query(testeQuery, function (err, result, fields) {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
