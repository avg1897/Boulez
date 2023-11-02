const mongoose = require("mongoose");

const dbConfig = require("../config/db.config.js");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
console.log(db.url)
db.chat = require("./chat.model.js")(mongoose);
db.university = require("./university.model.js")(mongoose);

module.exports = db;