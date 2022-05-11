const mysql = require("mysql2");

const pool = mysql.createConnection({
    //connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "schooldb",
    password: "IndiAndDigo159",
    dateStrings: true
  }).promise();

module.exports = pool;