const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
var cors = require('cors');

app.use(cors())

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Dianalopes99.",
  database: "minesweeper",
});

app.get("/", (req, res) => {
  res.send("Hello Fucking World!");
});

app.get("/test", (req, res) => {
  const testeQuery = "SELECT * FROM times WHERE dificulty='Easy'";
  pool.query(testeQuery, function (err, result, fields) {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
