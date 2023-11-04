exports.getCompletion = async (req, res) => {
    console.log("Get Completion called by Boulez START")
    let uniName = req.query.uni;
    let prompt = req.body.prompt;
    let subject = req.body.subject;
    if (!uniName || !prompt || !subject) {
        return res.status(400).send({message: "Wrong Input Data"})
    }
    await new Promise(resolve => setTimeout(resolve,  Math.floor(Math.random() * 7)*1000));

    console.log(req.query)
    console.log(req.body)
    let response = {
        id: req.body.id,
        completion: "Risposta data da: "+uniName+", Materia: "+subject,
        accuracy: Math.random(),
        timestamp: new Date()
    }
    console.log("Get Completion called by Boulez END")
    return res.send(response)
};