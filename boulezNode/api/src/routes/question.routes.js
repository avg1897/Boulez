module.exports = app => {
    const question = require("../controllers/question.controller.js");
    const utils = require('../Utils/Utils')

    let router = require("express").Router();

    router.get("/", utils.authenticateAdmin, question.getAll)

    router.get("/answers", utils.authenticateAdmin, question.getAllAnswers);

    router.delete("/", utils.authenticateAdmin, question.deleteAll);

    app.use("/question", router);
};