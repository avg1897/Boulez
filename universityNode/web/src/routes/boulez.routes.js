module.exports = app => {
    const boulez = require("../controllers/boulez.controller.js");

    let router = require("express").Router();

    router.post("/GetCompletion", boulez.getCompletion);

    app.use("/boulez", router);
};