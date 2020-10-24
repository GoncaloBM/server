const mysql = require("mysql");
const bcrypt = require('bcrypt');
const { feederDB } = require("../db/config");
const saltRounds = 10;

const getFeeders = (req, res) => {
  const { year, month, day } = req.query;

  console.log(year, month, day);
  const getFeeders = `SELECT * from feeder WHERE year=${year} AND month=${
    month - 1
  } AND day=${day} ORDER BY year, month,day,hour,minutes ASC`;

  feederDB.query(getFeeders, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

const newFeeder = (req, res) => {
  const { year, month, day, hour, minutes, page } = req.body;

  const pushCurrentMamada = `INSERT INTO feeder (year, month, day, hour, minutes, breast, mamadas) VALUES ('${year}','${month}','${day}', '${hour}','${minutes}',"",1)`;
  feederDB.query(pushCurrentMamada, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

const regUser = (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  bcrypt.hash(password,saltRounds,(err,hash)=> {
    if (err) {
      console.log(err)
    }
    const newUser = `INSERT INTO users (username,password,first_name,last_name) VALUES ('${username}','${hash}','${firstName}','${lastName}')`
  
  feederDB.query(newUser, function(err,result,fields) {
    if (err) throw err;
    res.send(result)
  })
  })

  const 
};

module.exports = { getFeeders, newFeeder ,regUser};
