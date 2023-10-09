module.exports = app => {
    const university = require("../controllers/university.controller.js");

    let router = require("express").Router();

    router.get("/", university.getAll);

    router.post("/new", university.create);

    app.use("/university", router);
};