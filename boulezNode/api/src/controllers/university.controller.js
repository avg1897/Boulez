const db = require("../models");
const crypto = require('crypto');
const utils = require('../Utils/Utils')
const University = db.university;

//TODO: createTest, getById, edit(private), updatePassword

exports.getAll = async (req, res) => {
    try {
        let universities = await University.find({})
        return res.json(universities)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({message: "Server Error, contact server admin"});
    }
};

exports.deleteAll = async (req, res) => {
    //leggere header
    let user = req.headers['x-user'];
    let pass = req.headers['x-pass'];

    if (!user || !pass) {
        return res.status(400).send({
            message: "This is a private Call only for Admin Users"
        });
    }
    let envPassHash = crypto.createHash('md5').update(process.env.API_PRIVATE_PASS).digest('hex');
    if (user !== process.env.API_PRIVATE_USER || pass !==  envPassHash) {
        return res.status(400).send({
            message: "This is a private Call only for Admin Users"
        });
    }
    try {
        await University.deleteMany({});
    }catch (e) {
        console.log(e.message)
        res.status(500).send({
            message: e.message || "Some error occurred while saving on database."
        });
    }

    return res.status(200).send({message: 'All Universities Deleted'});

};

exports.create = async (req, res) => {
    let uni = req.body;

    if (typeof uni !== 'object') {
       return res.status(400).send({message: "Reqest Body must be of University object"});
    } else if (!uni.name || !uni.api_link || !uni.username || !uni.password) {
       return res.status(400).send({message: "Missing important data: name, api_link, username, password"});
    }
    try {
        utils.validatePassword(uni.password)
    } catch (e) {
        return res.status(400).send({message: e.message});
    }

    let password = crypto.createHash('md5').update(uni.password).digest('hex');
    //todo find if there is uni with same name or url
    let uniObj = {
        name: uni.name,
        api_link: uni.api_link,
        username: uni.username,
        password: password,
    }
    if (uni.headquarter) uniObj.headquarter = uni.headquarter;
    try {
        let university = new University(uniObj)
        university.save()

        res.status(200).send(university);
    }catch (e) {
        console.log(e.message)
        res.status(500).send({
           message: "Some error occurred while saving on database."
        });
    }
};