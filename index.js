const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
var cors = require("cors");
var bodyParser = require("body-parser");

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
console.log('doing something');
});

app.get("/teste", (req, res) => {
  res.send("Hello Fucking World!");
});

app.get("/test/:dificulty", (req, res) => {
  console.log(req.params.dificulty);
  const testeQuery = `SELECT * FROM times WHERE dificulty='${req.params.dificulty}' ORDER BY time ASC `;
  pool.query(testeQuery, function (err, result, fields) {
    res.send(result);
  });
});

app.post("/minesweeper/scores",
  (req, res) => {
    const { user, time, dificulty } = req.body;
    console.log(req.body);

   const pushScoreQuery = `INSERT INTO times (user, dificulty, time) VALUES ('${user}','${dificulty}',${time})`;
    const getTimesQuery = `SELECT * FROM times WHERE dificulty='${dificulty}' ORDER BY time ASC`;

    pool.query(pushScoreQuery, function (err, result, fields) {
      if (err) throw err;
      console.log("Time send to DB");
      pool.query(getTimesQuery, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    });
  });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
