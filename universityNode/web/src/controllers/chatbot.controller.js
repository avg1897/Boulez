const db = require("../models");
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
    console.log(req.body)
    if (!universityId || isNaN(universityId)) {
        res.status(400).send({message: "Invalid Request!"});
        return;
    }

    const chat = new Chat({
        university_id: universityId
    });
    try {
        console.log("New chat with university id "+universityId)
        await chat.save()
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

    const chatId = req.query.chat_id;
    const prompt = req.query.prompt;

    if (!chatId || !prompt) {
        return res.status(400).send({message: "Invalid Request!"});
    }

    try {
        let chat = await Chat.findOneAndUpdate({_id: chatId}, {prompt: prompt});
        res.send(chat)
    } catch (e) {
        return res.status(404).send({message: "Chat not found!"});
    }
};

/**
 * Input: chat_id
 * Output: [{response_id, response, accuracy}]
 * Description: Api che inoltra la domanda effettuata in precedenza al sistema Boulez e restituisce la/le risposte
 */
exports.regenerateQuestion = (req, res) => {
    const chatId = req.query.chat_id;
    console.log(chatId)
    res.send({status: "OK"})
};

/**
 * Input: question_id, rating
 * Output: {status}
 * Description: Api che inoltra il feedback al sistema Boulez
 */
exports.feedback = (req, res) => {
    const boulezQuestionId = req.query.question_id;
    const rating = req.query.rating;

    if (!boulezQuestionId || !rating) {
        return res.status(400).send({message: "Invalid Request!"});
    }
    console.log(boulezQuestionId)
    console.log(rating)
    res.send({status: "OK"})
};