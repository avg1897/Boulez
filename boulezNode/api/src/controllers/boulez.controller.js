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
    //todo check user token
    console.log(req.body)
    //let callerUniversity = await University.getById(req.userId);
    try {
        let asd = await Boulez.getCompletion(req.body, req.userId)
        console.log("getCompletion:", asd)
        return res.send(asd);
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Server Error"});
    }

    return res.status(200).send({});
};