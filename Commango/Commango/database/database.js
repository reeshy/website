const sqlite = require("sqlite3");
const db = new sqlite.Database("myDataBase.db");

const databaseError = "Internal Server Error";
module.exports = db;
