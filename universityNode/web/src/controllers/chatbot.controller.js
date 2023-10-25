const db = require("../models");
const axios = require("axios");
const utils = require("../utils/Utils")
const { v4: uuidv4 } = require('uuid');
const Chat = db.chat;

exports.chatList = async (req, res) => {
    try {
        let chats = await Chat.find({})
        console.log(chats)
        return res.json(chats)
    } catch (e) {
        console.log(e.message)
        return res.status(400).send({message: "Invalid Request!"});
    }

};

/**
    Input: university_id
    Output: {status, chat_id}
    Description: Inizializza una nuova chat, restituisce Id della Chat creata.
 */
exports.newChat = async (req, res) => {
    let universityId = req.body.university_id;
    let subjectId = req.body.subject_id;
    if (!universityId || isNaN(universityId) || !subjectId) {
        res.status(400).send({message: "Invalid Request!"});
        return;
    }

    const chat = new Chat({
        university_id: universityId,
        subject_id: subjectId
    });
    try {
        console.log("New chat with university id "+universityId)
        await chat.save()
        //await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(chat.id)
        res.send(chat)
    } catch (e) {
        console.error(e.stackTrace)
        res.status(500).send({
            message: e.message || "Some error occurred while creating the chat."
        });
    }
};

/**
  * Input: chat_id, prompt
  * Output: [{response_id, response, accouracy}]
  * Description: Api che data una domanda restituisce una risposta
 */
exports.question = async (req, res) => {

    const chatId = req.body.chat_id;
    const prompt = req.body.prompt;

    if (!chatId || !prompt) {
        return res.status(400).send({message: "Invalid Request!"});
    }

    try {
        console.log("Post Question chat "+chatId+", "+prompt)
        let chat = await Chat.findById(chatId);
        chat.prompt = prompt
        chat.save()
        //await new Promise(resolve => setTimeout(resolve, 5000));
        res.send({
            answer: 'Risposta generata internamente'
        })
    } catch (e) {
        return res.status(404).send({answer: "Chat not found!"});
    }
};

/**
 * Input: chat_id
 * Output: [{response_id, response, accuracy}]
 * Description: Api che inoltra la domanda effettuata in precedenza al sistema Boulez e restituisce la/le risposte
 */
exports.regenerateQuestion = async (req, res) => {
    const chatId = req.body.chat_id;
    try {
        console.log("Chat id:"+chatId)
        //await new Promise(resolve => setTimeout(resolve, 5000));
        let chat = await Chat.findById(chatId);

        let token = await utils.getToken()
        if (token.error) {
            res.status(500).send({message: "server error"})
        }
        let config = {
            headers: {
                Authorization: 'Bearer '+token
            }
        }
        let request = {
            prompt: chat.prompt,
            id: uuidv4(7),
            subject: chat.subject_id,
            timestamp: new Date()
        }
        console.log(request)

        let boulezGetCompletion = await axios.post(
            process.env.BOULEZ_HOSTNAME+"/api/getcompletion",
            request,
            config)
        if (boulezGetCompletion.data.status === 'OK') {
            chat.boulezAnswer = boulezGetCompletion.data;
            chat.save()
            console.log(chat.boulezAnswer)
            res.send({
                status: "OK",
                answers: chat.boulezAnswer.completions
            })
        } else {
            res.status(500).send({status: "KO", message: "Server Error"})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
};

/**
 * Input: chat_id, rating
 * Output: {status}
 * Description: Api che inoltra il feedback al sistema Boulez
 */
exports.feedback = async (req, res) => {
    const ratings = ['negative', 'neutral', 'positive']
    const ratingMapping = {
        negative: -1,
        neutral: 0,
        positive: 1
    }
    const chat_id = req.body.chat_id
    const answer_id = req.body.answer_id
    const rating = req.body.rating;

    if (!chat_id || !rating || !answer_id || !ratings.includes(rating)) {
        return res.status(400).send({message: "Invalid Request!"});
    }
    try {
        let token = await utils.getToken()
        if (token.error) {
            res.status(500).send({message: "server error"})
        }

        let chat = await Chat.findById(chat_id);
        console.log(`Feedback, chatId ${chat_id} type ${rating}`)

        let answer = chat.boulezAnswer.completions.filter(completion => completion.id === answer_id)

        if (answer) {
            let config = {
                headers: {
                    Authorization: 'Bearer '+token
                }
            }
            let request = {
                completionId: answer_id,
                rating: ratingMapping[rating]
            }
            let boulezFeedback = await axios.post(process.env.BOULEZ_HOSTNAME+"/api/feedback", request, config)
            if (boulezFeedback.data.status === 'OK') {
                console.log("Feedback Response OK")
                return res.send({status: "OK"})
            } else {
                console.log("Bad response from Boulez: "+JSON.stringify(boulezFeedback.data))
                return res.status(500).send({status: "KO", message: "Server Error"})
            }
        }else {
            console.log("Cannot find answer "+answer_id)
            return res.status(400).send({status: "KO"})
        }
    }catch (e) {
        console.log("Error", e)
        res.status(500).send({status: "KO", message: "Server Error"})
    }
};

exports.getAll = async (req, res) => {
    try {
        let chats = await Chat.find({})
        return res.json(chats)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({message: "Server Error, contact server admin"});
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Chat.deleteMany({});
    }catch (e) {
        console.log(e.message)
        res.status(500).send({
            message: e.message || "Some error occurred while saving on database."
        });
    }
    return res.status(200).send({message: 'All Entities Deleted'});
};

exports.getSubjects = async (req, res) => {
    try {
        let subjects = await axios.get(process.env.BOULEZ_HOSTNAME+"/api/getSubjects")
        return res.send(subjects.data)
    }catch (e) {
        console.log(e.message)
        return res.status(500).send({
            message: e.message || "Some error occurred while saving on database."
        });
    }
};