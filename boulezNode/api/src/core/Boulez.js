const db = require("../models");
const axios = require('axios')
const University = db.university;
const Answer = db.answer;
const Subject = db.subject;

exports.getCompletion = (body, caller_id) => {
    return new Promise((resolve => {
        (async () => {
            if (!caller_id || caller_id === '') {
                throw new Error("Caller University Not Found, please login again")
            }else if (!body.prompt || !body.id || !body.subject ) {
                throw new Error("Wrong Input data")
            }
            let subject = await Subject.findById(body.subject)
            console.log("Materia Selezionata: "+subject.name)

            //taking all universities except caller
            let query = {
                _id: {$ne: caller_id},
                courses: {$in: subject.degree}
            };
            let universitiesQuery = await University.find(query)
            let universityCount = await University.count(query)
            let allResponses = [];
            let universities = universitiesQuery.map((uni) => uni.toObject());

            universities.forEach((uni, index) => {
                try {
                    axios.post(
                        uni.api_link,
                        {
                            prompt: body.prompt,
                            id: body.id,
                            subject: subject.name,
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

exports.saveAnswers = async (uniResponses, questionId) => {
    for (const response of uniResponses) {
        let resObj = {
            question_id: questionId,
            status: response.status,
            university_id: response.university_id
        }
        if (response.status === 'OK') {
            resObj = {
                ...resObj,
                completion: response.completion,
                accuracy: response.accuracy,
                response_timestamp: response.timestamp
            }
        } else {
            resObj = {
                ...resObj,
                error: response.error
            }
        }
        let answer = new Answer(resObj)
        await answer.save()
    }
}

/**
 * TODO Implementare Logica
 * Al momento prendo le risposte con l'accuracy piu alta
 */
exports.chooseAnswer = async questionId => {
    //Da impostare i valori
    let c1 = 1
    let c2 = 1

    let currentAccuracy = 0
    let completions = []
    let responseIds = []

    try {
        let answers = await Answer.find({question_id: questionId})
        for (const answer of answers) {
            if (answer.status === 'OK') {
                let university = await University.findById(answer.university_id)

                //TODO Cambiare Formula
                let answerAccuracy = university.trustPercentage * answer.accuracy;

                if (answerAccuracy > currentAccuracy) {
                    currentAccuracy = answerAccuracy
                    completions = [{
                        id: answer.id,
                        completion: answer.completion
                    }]
                    responseIds = [answer.id]
                } else if (answerAccuracy === currentAccuracy) {
                    //solo in caso di accuracy uguali restituisco un altra risposta
                    completions.push({
                        id: answer.id,
                        completion: answer.completion
                    })
                    responseIds.push(answer.id)
                }
            }
        }
    } catch (e) {
        console.log(e)
        return {
            status: "KO",
            error: e
        }
    }
    return {
        status: "OK",
        responseIds: responseIds,
        completions: completions
    }
}

