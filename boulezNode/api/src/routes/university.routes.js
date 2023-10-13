module.exports = app => {
    const university = require("../controllers/university.controller.js");
    const utils = require('../Utils/Utils')

    let router = require("express").Router();

    router.get("/", utils.authenticateAdmin, university.getAll);

    router.delete("/", utils.authenticateAdmin, university.deleteAll);

    router.post("/new", utils.authenticateAdmin, university.create);

    app.use("/university", router);
};