const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { feederDB } = require("../db/config");
const saltRounds = 10;

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

const loginUser = (req, res) => {
  const { username, password } = req.body;

  const checkUser = `SELECT * from users WHERE username='${username}'`;

  feederDB.query(checkUser, (err, result) => {
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          res.send({ loggedIn: true, username: result[0].username });
        } else {
          res.send({ loggedIn: false, username: "" });
        }
      });
    } else {
      res.send("No user");
    }
  });
};

module.exports = { getFeeders, newFeeder, regUser, loginUser };
