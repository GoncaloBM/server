const mysql = require("mysql");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { feederDB } = require("../db/config");
const passport = require("passport");
const passportLocal = require("passport-local");
const saltRounds = 10;
const session = require("express-session");
var cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    key: "goncalobm",
    secret: "claratodalinda",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 3600000 },
  })
);

const getFeeders = (req, res) => {
  const { year, month, day, username } = req.query;

  console.log(year, month, day);

  const getFeeders = `SELECT f.year,f.month,f.day,f.hour,f.minutes,f.mamadas,f.mamadas,f.breast,f.comments,f.id from feeder as f, users as u 
  WHERE f.user_id=u.id AND u.username='${username}' AND f.year=${year} AND f.month=${
    month - 1
  } AND f.day=${day}
  ORDER BY f.year, f.month,f.day,f.hour,f.minutes ASC;`;
  feederDB.query(getFeeders, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

const newFeeder = (req, res) => {
  const { year, month, day, hour, minutes, page, username } = req.body;
  const getId = `SELECT * from users WHERE  username = '${username}'`;

  feederDB.query(getId, (err, result) => {
    if (err) throw err;

    const pushCurrentMamada = `INSERT INTO feeder (year, month, day, hour, minutes, breast, mamadas, user_id) VALUES ('${year}','${month}','${day}', '${hour}','${minutes}',"",1,${result[0].id})`;
    feederDB.query(pushCurrentMamada, function (error, resp, fields) {
      if (error) throw error;
      res.send(resp);
    });
  });
};

const regUser = (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    const newUser = `INSERT INTO users (username,password,first_name,last_name, email) VALUES ('${username}','${hash}','${firstName}','${lastName}','${email}')`;

    feederDB.query(newUser, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
};

const loginCookie = (req, res) => {
  console.log(req.user)
  if (req.user) {
    res.send({ loggedIn: true, username: req.user.username });
  } else {
    console.log('No user');
  }
};

module.exports = { getFeeders, newFeeder, regUser, loginCookie };
