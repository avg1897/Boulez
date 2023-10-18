const db = require("../models");
const crypto = require('crypto');
const utils = require('../Utils/Utils')
const Boulez = require('../core/Boulez')
const University = db.university;
const Answer = db.answer;
const Question = db.question;

const { TOKEN_SECRET = "secret" } = process.env;

exports.login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).send({message: "User or Password missing"});
    }
    let hashedPassword = crypto.createHash('md5').update(password+TOKEN_SECRET).digest('hex');
    try {
        let university = await University.findOne({username: username});
        if (university && hashedPassword === university.password) {
            const token = utils.generateAccessToken(university.id);
            return res.status(200).json({status: "OK", token: token});
        }
    }catch (e) {
        console.log(e)
    }

    return res.status(400).send({message: "User or Password are wrong!"});
}

exports.getCompletion = async (req, res) => {
    try {
        //creo la domanda nel db
        let questionObj = {
            university_id: req.userId,
            request_id: req.body.id,
            request_timestamp: req.body.timestamp,
            prompt: req.body.prompt
        }
        let question = new Question(questionObj);
        question.save();

        let uniResponses = await Boulez.getCompletion(req.body, req.userId)
        console.log("getCompletion:", uniResponses)

        //SCELTA RISPOSTE
        //salvo le risposte a db
        //restituisco la risposta con l'accurancy piu alto
        let currentAccuracy = 0
        let completions = []
        let responseIds = []

        uniResponses.forEach(response => {
            try {
                let resObj = {
                    question_id: question.id,
                    status: response.status,
                }
                if (response.status === 'OK') {
                    resObj = {
                        ...resObj,
                        completion: response.completion,
                        accuracy: response.accuracy,
                        response_timestamp: response.timestamp
                    }
                } else {
                    resObj = {
                        ...resObj,
                        error: response.error
                    }
                }
                let answer = new Answer(resObj)
                answer.save()

                if (response.status === 'OK') {
                    if (response.accuracy > currentAccuracy) {
                        currentAccuracy = response.accuracy
                        completions = [{
                            id: answer.id,
                            completion: response.completion
                        }]
                        responseIds = [answer.id]
                    } else if (response.accuracy === currentAccuracy) {
                        //solo in caso di accuracy uguali restituisco un altra risposta
                        completions.push({
                            id: answer.id,
                            completion: response.completion
                        })
                        responseIds.push(answer.id)
                    }
                }
            }catch (e) {
                console.log(e)
            }
        })

        if (completions.length === 0) {
            console.log("No response from other nodes")
            res.status(500).send({
                error: "No response from other nodes"
            })
        }

        let response = {
            status: "OK",
            id: question.id,
            completions: completions,
            timestamp: new Date()
        }
        question.responseIds = responseIds;
        question.save()

        return res.send(response);
    } catch (e) {
        console.log(e);
        return res.status(500).send({status: "KO", message: "Server Error"});
    }
};

exports.feedback = async (req, res) => {
    let completionId = req.body.completionId
    let rating = req.body.rating
    console.log(req.body)

    if (typeof rating === 'string' && !isNaN(rating)) {
        rating = parseInt(rating)
    }

    if (!completionId || !rating) {
        return res.status(400).send({status: "KO", message: "Missing required parameter completionId, rating"})
    } else if (rating < -1 || rating > 1) {
        return res.status(400).send({status: "KO", message: "Rating parameter must be between -1 and +1"})
    }

    try {
        let answer = await Answer.findById(completionId)

        if (!answer.rating) {
            answer.rating = rating;
            answer.save()
            return res.send({status: "OK"})
        }else {
            return res.status(400).send({status: "KO", message: "Feedback already sent"})
        }
    }catch (e) {
        console.log("Feedback Error", e)
        return res.status(500).send({status: "KO", message: "Internal Server Error"})
    }

}