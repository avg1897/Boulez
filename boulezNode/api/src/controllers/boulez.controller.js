const db = require("../models");
const crypto = require('crypto');
const utils = require('../Utils/Utils')
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

    //todo user SECRET in login/register
    console.log(password)
    console.log(TOKEN_SECRET)
    let hashedPassword = crypto.createHash('md5').update(password+TOKEN_SECRET).digest('hex');
    console.log(hashedPassword)
    try {
        let university = await University.findOne({username: username});
        if (university && hashedPassword === university.password) {
            console.log(university.password)
            //todo inserire id università nel token
            const token = utils.generateAccessToken(username);
            console.log(token)
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
    console.log(req.user)

    return res.status(200).send({});
};