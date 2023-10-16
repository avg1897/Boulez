const db = require("../models");
const axios = require("axios");
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
        //TODO inviare chat.promt a BOULEZ, salvare gli id delle risposte in boulezAsnwers
        console.log("TODO regenerateQuestion", chat.prompt)

        res.send({
            status: "OK",
            answers: [
                {
                    id: 'aaa',
                    answer: "Riposta Boulez 1"
                },
                {
                    id: 'aab',
                    answer: "Riposta Boulez 2"
                },
            ]})
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
    const chat_id = req.body.chat_id
    const answer_id = req.body.answer_id
    const rating = req.body.rating;

    //await new Promise(resolve => setTimeout(resolve, 5000));

    if (!chat_id || !rating || !answer_id || !ratings.includes(rating)) {
        return res.status(400).send({message: "Invalid Request!"});
    }

    let chat = Chat.findById(chat_id);
    //TODO controllare se l'answer_id fa parte della chat
    console.log(answer_id, rating)
    res.send({status: "OK"})
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