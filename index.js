const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
var cors = require("cors");
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

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

app.post("/test", (req, res) => {
  console.log(req.body)
  const { dificulty } = req.body;
  const testeQuery = `SELECT * FROM times WHERE dificulty='${dificulty}'`;
  pool.query(testeQuery, function (err, result, fields) {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
