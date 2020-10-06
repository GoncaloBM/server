const mysql = require("mysql");
const { feederDB } = require("../db/config");

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

module.exports = { getFeeders, newFeeder };
