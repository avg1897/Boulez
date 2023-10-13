const db = require("../models");
const axios = require('axios')
const University = db.university;

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
                try {
                    axios.post(
                        uni.api_link,
                        {
                            prompt: body.prompt,
                            id: body.id,
                            timestamp: Date.now(),
                        },
                        {timeout: process.env.CALL_TIMEOUT || 10000}
                    )
                        .then(function (response) {
                            console.log(response.data);
                            allResponses.push({
                                university_id: uni._id,
                                status: 'OK',
                                completion: response.data.completion,
                                accuracy: response.data.accuracy,
                                timestamp: response.data.timestamp
                            })
                            if (allResponses.length === universityCount) {
                                resolve(allResponses)
                            }
                        })
                        .catch(function (error) {
                            allResponses.push({
                                university_id: uni._id,
                                status: 'KO',
                                error: error.code
                            })
                            if (allResponses.length === universityCount) {
                                resolve(allResponses)
                            }
                        });
                }catch (e) {
                    console.log(e)
                    resolve(allResponses)
                }
            })
        })()
    }))

}