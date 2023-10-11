const db = require("../models");
const utils = require('../Utils/Utils')
const University = db.university;
const Answer = db.answer;
const Question = db.question;

exports.getCompletion = async caller_id => {
    if (!caller_id || caller_id === '') {
        throw new Error("Caller University Not Found, please login again")
    }
    //taking all universities except caller
    let universitiesQuery = await University.find({_id: {$ne: caller_id}})
    let universities = universitiesQuery.map((uni) => uni.toObject());

    universities.forEach((uni, index) => {
        console.log(index)
        console.log(uni.name)
        console.log(uni.api_link)
    })

}