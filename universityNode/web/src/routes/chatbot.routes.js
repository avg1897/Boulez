module.exports = app => {
    const chatbot = require("../controllers/chatbot.controller.js");

    let router = require("express").Router();

    router.get("/", chatbot.chatList);

    router.post("/new", chatbot.newChat);

    router.post("/question", chatbot.question);

    router.post("/regenerate_question", chatbot.regenerateQuestion);

    router.post("/feedback", chatbot.feedback);

    router.get('/getAll', chatbot.getAll);

    router.delete('/delete', chatbot.deleteAll)

    router.post('/subjects', chatbot.getSubjects)

    app.use("/chatbot/chat", router);
};