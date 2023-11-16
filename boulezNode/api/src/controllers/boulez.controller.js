const mongoose = require("mongoose");
const db = require("../models");
const crypto = require('crypto');
const utils = require('../Utils/Utils')
const Boulez = require('../core/Boulez')
const University = db.university;
const Answer = db.answer;
const Question = db.question;
const Subject = db.subject;

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
            subject_id: req.body.subject,
            prompt: req.body.prompt
        }
        let question = new Question(questionObj);
        question.save();

        let uniResponses = await Boulez.getCompletion(req.body, req.userId)
        console.log("getCompletion:", uniResponses)

        //SCELTA RISPOSTE
        await Boulez.saveAnswers(uniResponses, question.id)
        let answers = await Boulez.chooseAnswer(question.id)

        if (answers.status === "KO" || answers.completions.length === 0) {
            console.log("No response from other nodes")
            res.status(500).send({
                error: "Server Error"
            })
        }

        let response = {
            status: "OK",
            id: question.id,
            completions: answers.completions,
            timestamp: new Date()
        }
        question.responseIds = answers.responseIds
        question.save()

        // impost attr selected = true per risposte scelte
        // -> serve per il cercare le risposte non elaborate dal modulo trust
        for (const answerId of answers.responseIds) {
            let answer = await Answer.findById(answerId)
            answer.selected = true
            answer.save()
        }

        return res.send(response);
    } catch (e) {
        console.log(e)
        return res.status(500).send({status: "KO", message: "Server Error"})
    }
};

exports.feedback = async (req, res) => {
    let completionId = req.body.completionId
    let rating = req.body.rating
    console.log(req.body)

    if (typeof rating === 'string' && !isNaN(rating)) {
        rating = parseInt(rating)
    }

    if (!completionId || isNaN(rating)) {
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


/**
 * Modulo Update Trust
 * Prende tutte le risposte non elaborate e assegna
 * per ogni università, il rating generale e la % di trust
 */
exports.updateTrust = async (req, res) => {
    //x ogni università prendo tutte le domande non elaborate (trustProcessed=false)
    //e processo il rating generale (somma di tutti i feedback +1,-1) e lo aggiungo al rating già esistente sul db
    //aggiorno la percentuale di trust = 1 + (ratingGenerale/100)
    let universities = await University.find({})

    for (const uni of universities) {
        let generalRating = 0

        let answerNotElaborated = await Answer.find({
            university_id: uni._id,
            selected: true
        })
        for (const answer of answerNotElaborated) {
            try {
                answer.processed = true
                answer.save()
                generalRating += answer.rating
            }catch (e) {
                console.log(e)
                res.status(500).send({error: e})
            }
        }

        try {
            uni.generalRating += generalRating
            uni.trustPercentage = 1 + (uni.generalRating/100)
            uni.save()
            console.log(uni.name)
            console.log(uni.generalRating)
            console.log(uni.trustPercentage)
        }catch (e) {
            console.log(e)
            console.log("error saving uni "+uni.id)
            console.log("general rating to add: "+generalRating)
            res.status(500).send({error: e})
            break;
        }
    }
    res.send({status: "OK"})
}

exports.getSubjects = async (req, res) => {
    let subjects = await Subject.find({})
    console.log("test")
    if (req.userId) {
        try {
            let uni = await University.findById(req.userId)
            subjects = await Subject.find({_id: {$in: uni.subjects}})
        } catch (e) {
            console.log("Exception: ", e)
            return res.json({status: "KO"})
        }
    }
    return res.json(subjects)
}