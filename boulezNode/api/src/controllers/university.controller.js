const db = require("../models");
const University = db.university;

//TODO: createTest, getById, edit

exports.getAll = async (req, res) => {
    try {
        let universities = await University.find({})
        return res.json(universities)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({message: "Server Error, contact server admin"});
    }
};

exports.create = async (req, res) => {
    let uni = req.body;

    if (typeof uni !== 'object') {
       return res.status(400).send({message: "Reqest Body must be of University object"});
    } else if (!uni.name || !uni.api_link) {
       return res.status(400).send({message: "Missing important data: name or api_link"});
    }
    //todo find if there is uni with same name or url
    let uniObj = {
        name: uni.name,
        api_link: uni.api_link,
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