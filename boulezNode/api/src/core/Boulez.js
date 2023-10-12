const db = require("../models");
const utils = require('../Utils/Utils')
const axios = require('axios')
const University = db.university;
const Answer = db.answer;
const Question = db.question;

exports.getCompletion = (body, caller_id) => {
    return new Promise((resolve => {
        (async () => {
            if (!caller_id || caller_id === '') {
                throw new Error("Caller University Not Found, please login again")
            }else if (!body.prompt || !body.id ) {
                throw new Error("Wrong Input data")
            }
            //taking all universities except caller
            let universitiesQuery = await University.find({_id: {$ne: caller_id}})
            let universityCount = await University.count({_id: {$ne: caller_id}});
            let allResponses = [];
            let universities = universitiesQuery.map((uni) => uni.toObject());

            universities.forEach((uni, index) => {
                console.log(index)
                console.log(uni.name)
                console.log(uni.api_link)
                axios.post(
                    "http://"+uni.api_link,
                    {
                        prompt: body.prompt,
                        id: body.id
                    }
                )
                    .then(function (response) {
                        console.log(response.data);
                        allResponses.push({
                            university_id: uni._id,
                            response: response.data
                        })
                        if (allResponses.length === universityCount) {
                            resolve(allResponses)
                        }
                    })
                    .catch(function (error) {
                        allResponses.push({})
                        console.log(error);
                    });
            })
        })()
    }))

}