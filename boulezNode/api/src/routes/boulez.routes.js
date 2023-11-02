module.exports = app => {
    const boulez = require("../controllers/boulez.controller.js");
    const utils = require('../Utils/Utils')
    let router = require("express").Router();

    router.post("/login", boulez.login);

    router.post("/getcompletion", utils.authenticateToken, boulez.getCompletion);

    router.post("/feedback", utils.authenticateToken, boulez.feedback);

    router.post('/getDegrees', utils.authenticateToken, boulez.getDegrees)

    router.get('/getDegrees', boulez.getDegrees)

    router.post('/getSubjects', utils.authenticateToken, boulez.getSubjects)

    router.get('/getSubjects', boulez.getSubjects)

    /**
     * Questa rotta è stata create per simulare il funzionamento di un cron
     * che ogni settimana esegue l'aggiornamento dei rating delle unviersità
     */
    router.get('/cron/updateTrust', utils.authenticateAdmin, boulez.updateTrust)

    app.use("/api", router);
};