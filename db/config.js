const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Dianalopes99.",
  database: "minesweeper",
});

const feederDB = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "Dianalopes99.",
    database: "babyfeeder",
  });

  module.exports = { feederDB };