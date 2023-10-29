const mongoose = require("mongoose");

const dbConfig = require("../config/db.config.js");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.question = require("./question.model.js")(mongoose);
db.university = require("./university.model.js")(mongoose);
db.answer = require("./answer.model.js")(mongoose);
db.subject = require("./subject.model.js")(mongoose);
db.degree = require("./degree.model.js")(mongoose);

module.exports = db;