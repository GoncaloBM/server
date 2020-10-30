const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
var cors = require("cors");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");
var fs = require("fs");
const { feederDB } = require("./db/config");
const {
  getFeeders,
  newFeeder,
  regUser,
  loginUser,
  loginCookie,
} = require("./controllers/babyFeeder_controller");
const initPassportLocal = require("./db/passportConfig");

app.use(cookieParser("secret"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 86400000 1 day
    },
  })
);

app.use(cookieParser("secret"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Dianalopes99.",
  database: "minesweeper",
});

initPassportLocal();

app.get("/", (req, res) => {
  res.send("Hello Fucking World!");
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

app.get("/babyfeeder/feeders", getFeeders);

app.post("/babyfeeder/feeders", newFeeder);

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

app.post("/babyfeeder/register", regUser);

app.post("/babyfeeder/login", (req, res) => {
  passport.authenticate(
    "local",
    function (error, user, info) {
      if (error) throw error;
      if (!user) {
        res.send("No user");
      } else {
        req.logIn(user, (err) => {
          const { username, first_name, last_name } = user;
          if (err) throw err;
          res.send({
            username: username,
            loggedIn: true,
          });
          console.log(req.user);
        });
      }
    },
    { session: true }
  )(req, res);
});

app.get("/babyfeeder/login", loginCookie);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
