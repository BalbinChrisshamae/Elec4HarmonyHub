const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "forumdb",
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.message);
        return;
    }

    console.log("db connected");
});

module.exports = connection;
