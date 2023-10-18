module.exports = app => {
    const boulez = require("../controllers/boulez.controller.js");
    const utils = require('../Utils/Utils')
    let router = require("express").Router();



    /* middleware from here needs auth */
    router.post("/login", boulez.login);

    router.post("/getcompletion", utils.authenticateToken, boulez.getCompletion);

    router.post("/feedback", utils.authenticateToken, boulez.feedback);

    app.use("/api", router);
};