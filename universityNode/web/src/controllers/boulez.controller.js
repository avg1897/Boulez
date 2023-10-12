const db = require("../models");

exports.getCompletion = async (req, res) => {
    let uniName = req.query.uni;
    let prompt = req.body.prompt;
    if (!uniName || !prompt) {
        return res.status(400).send({message: "Wrong Input Data"})
    }
    //todo da fare test dove 1 non risponde, timer di risposta random, tutte non rispondono?
    await new Promise(resolve => setTimeout(resolve,  Math.floor(Math.random() * 7)*1000));

    console.log(req.query)
    console.log(req.body)
    return res.send({message: req.query.uni})
};