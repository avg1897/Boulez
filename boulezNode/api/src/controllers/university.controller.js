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
   let model = req.body;

    console.log(model)
   if (typeof model !== 'object') {
       return res.status(400).send({message: "Reqest Body must be of type array of objects type University"});
   }
};