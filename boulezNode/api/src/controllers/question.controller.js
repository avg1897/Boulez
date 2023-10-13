const db = require("../models");
const Answer = db.answer;
const Question = db.question;

exports.getAll = async (req, res) => {
    try {
        let questions = await Question.find({})
        return res.json(questions)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({message: "Server Error, contact server admin"});
    }
};

exports.getAllAnswers = async (req, res) => {
    try {
        let answers = await Answer.find({})
        return res.json(answers)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({message: "Server Error, contact server admin"});
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Question.deleteMany({});
        await Answer.deleteMany({});
    }catch (e) {
        console.log(e.message)
        res.status(500).send({
            message: e.message || "Some error occurred while saving on database."
        });
    }

    return res.status(200).send({message: 'All Entities Deleted'});

};