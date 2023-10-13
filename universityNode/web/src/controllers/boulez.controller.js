const db = require("../models");

exports.getCompletion = async (req, res) => {
    let uniName = req.query.uni;
    let prompt = req.body.prompt;
    if (!uniName || !prompt) {
        return res.status(400).send({message: "Wrong Input Data"})
    }
    await new Promise(resolve => setTimeout(resolve,  Math.floor(Math.random() * 7)*1000));

    console.log(req.query)
    console.log(req.body)
    let response = {
        id: req.body.id,
        completion: "Risposta data da: "+req.query.uni,
        accuracy: Math.random(),
        timestamp: Date.now()
    }
    return res.send(response)
};