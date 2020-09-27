const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");
const { feederDB } = require("./db/config");

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
  console.log("doing something");
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

  console.log(feeders);

  fs.writeFileSync(
    "./apps/baby-feeder/baby-feeder.json",
    JSON.stringify(feeders)
  );
  const rawFile2 = fs.readFileSync("./apps/baby-feeder/baby-feeder.json");
  console.log(rawFile2);
  const file2 = JSON.parse(rawFile2);

  res.json(file2);
});

app.get("/babyfeeder/feeders", (req, res) => {
  const getFeeders = `SELECT * from feeder ORDER BY year, month,day,hour,minutes ASC`;

  feederDB.query(getFeeders, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/babyfeeder/feeders", (req, res) => {
  console.log(req.body);
  const { year, month, day, hour, minutes, page } = req.body;

  const pushCurrentMamada = `INSERT INTO feeder (year, month, day, hour, minutes, breast, mamadas) VALUES ('${year}','${month}','${day}', '${hour}','${minutes}',"",1)`;
  feederDB.query(pushCurrentMamada, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/babyfeeder/feeders/:id", (req, res) => {
  console.log(req.params);

  const deleteQuery = `DELETE from feeder WHERE id = ${req.params.id}`;

  feederDB.query(deleteQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.put("/babyfeeder/feeders/:id/mamada", (req, res) => {
  const { numero } = req.body;
  console.log(numero);
  const updateMamadaQuery = `UPDATE feeder SET mamadas = mamadas + ${numero} WHERE id = ${req.params.id};`;

  feederDB.query(updateMamadaQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.put("/babyfeeder/feeders/:id/breast", (req, res) => {
  const { breast } = req.body;

  console.log(breast);
  const updateBreastQuery = `UPDATE feeder SET breast = '${breast}' WHERE id = ${req.params.id};`;

  feederDB.query(updateBreastQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.put("/babyfeeder/feeders/:id/comments", (req, res) => {
  const { comments } = req.body;

  console.log(comments);
  const updateCommentQuery = `UPDATE feeder SET comments = '${comments}' WHERE id = ${req.params.id};`;

  feederDB.query(updateCommentQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
