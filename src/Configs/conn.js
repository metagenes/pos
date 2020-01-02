'use-strict';

const mysql = require('mysql');

const dbConfig = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    // multipleStatements: true,
});

dbConfig.connect(err => {
    if (err) throw err
});

module.exports = dbConfig;