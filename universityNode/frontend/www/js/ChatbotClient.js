class ChatbotClient {

    constructor() {
        this.backend = "/backend.php"
        this.chatId = null
    }

    async getSubject(uniId) {
        let req = {
            method: 'subjects',
            body: {
                university_id: uniId
            }
        }
        try {
            let response = await $.post(this.backend, req);
            return JSON.parse(response)
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async newChat(universityId, subjectId) {
        let req = {
            method: 'new',
            body: {
                university_id: universityId,
                subject_id: subjectId
            }
        }
        try {
            let response = await $.post(this.backend, req);
            return JSON.parse(response)
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async question(chat_id, prompt) {
        let req = {
            method: 'question',
            body: {
                chat_id: chat_id,
                prompt: prompt
            }
        }
        try {
            let response = await $.post(this.backend, req);
            let data = JSON.parse(response)
            return data.answer
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async regenerateQuestion(chat_id) {
        let req = {
            method: 'regenerate_question',
            body: {
                chat_id: chat_id
            }
        }
        try {
            let response = await $.post(this.backend, req);
            let data = JSON.parse(response)
            console.log(data)
            return data.answers
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async feedback(chat_id, answer_id, rating) {
        let req = {
            method: 'feedback',
            body: {
                chat_id: chat_id,
                answer_id: answer_id,
                rating: rating,
            }
        }
        try {
            let response = await $.post(this.backend, req);
            return JSON.parse(response)
        } catch (e) {
            console.log(e)
            return false
        }
    }
}