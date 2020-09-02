const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");

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

app.get("/test/:dificulty", (req, res) => {
  console.log(req.params.dificulty);
  const testeQuery = `SELECT * FROM times WHERE dificulty='${req.params.dificulty}' ORDER BY time ASC `;
  pool.query(testeQuery, function (err, result, fields) {
    res.send(result);
  });
});

app.post("/minesweeper/scores", (req, res) => {
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

app.get("/baby", (req, res) => {
  const rawFile = fs.readFileSync("./apps/baby-feeder/baby-feeder.json");
  const feeders = JSON.parse(rawFile);
  res.json(feeders);
  console.log("fetch sent");
});

app.post("/baby", function (req, res) {
  const rawFile = fs.readFileSync("./apps/baby-feeder/baby-feeder.json");
  let feeders = JSON.parse(rawFile);
  feeders = req.body;

  console.log(feeders)

  fs.writeFileSync(
    "./apps/baby-feeder/baby-feeder.json",
    JSON.stringify(feeders)
  );
  const rawFile2 = fs.readFileSync("./apps/baby-feeder/baby-feeder.json");
  console.log(rawFile2);
  const file2 = JSON.parse(rawFile2);

  res.json(file2);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
