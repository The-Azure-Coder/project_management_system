
const mysql = require('mysql');
module.exports = conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root",
    database: "amberapp2",
    dateStrings: true
});

