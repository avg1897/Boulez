const axios = require('axios')
const db = require("../models");
const University = db.university;
/**
 * function read / write file TOKEN in root dir.
 * if file doens't exist -> make call to boulez login and write
 * new file with token + creation date
 * if file exist check creation date, if is expired, call boulez login and
 * recreate TOKEN file
 */
exports.getToken = async (uniId) => {
    try {
        let university = await University.findOne({university_id: uniId})
        let tokenCreatedAt = new Date(university.createdAt)
        let now = new Date()
        let diff = Math.abs(tokenCreatedAt - now) / 1000;
        console.log(diff)
        if (diff < 3600) {
            return university.token;
        }else {
            return await this.createNewToken(uniId);
        }
    } catch (e) {
        return await this.createNewToken(uniId);
    }
}

exports.createNewToken = async (uniId) => {
    try {
        let university = await University.findOne({university_id: uniId})
        let login = await axios.post(process.env.BOULEZ_HOSTNAME+"/api/login", {
            username: university.username,
            password: university.password
        })
        if (login.data.status === 'OK') {
            university.token = login.data.token
            university.createdAt = new Date()
            await university.save()
            return login.data.token
        }
    }catch (e) {
        console.log("exception", e)
    }
    return {
        error: true
    }
}

