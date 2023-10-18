const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const axios = require('axios')

const tokenFilePath = './TOKEN'
/**
 * function read / write file TOKEN in root dir.
 * if file doens't exist -> make call to boulez login and write
 * new file with token + creation date
 * if file exist check creation date, if is expired, call boulez login and
 * recreate TOKEN file
 */
exports.getToken = async () => {
    try {
        await fsPromises.access(tokenFilePath, fs.constants.F_OK);
        let tokenFile = await fsPromises.readFile(tokenFilePath, "binary");
        let tokenData = JSON.parse(tokenFile)
        let now = new Date()
        let tokenCreatedAt = new Date(tokenData.created_at)
        let diff = Math.abs(tokenCreatedAt - now) / 1000;
        if (diff < 3600) {
            return tokenData.token
        } else {
            let tokenData = await this.createNewToken()
            if (!tokenData.error) {
                await fsPromises.writeFile(tokenFilePath, JSON.stringify(tokenData))
                return tokenData.token
            }
        }
    } catch (e) {
        let tokenData = await this.createNewToken()
        if (!tokenData.error) {
            await fsPromises.writeFile(tokenFilePath, JSON.stringify(tokenData))
            return tokenData.token
        }
    }
    return {error: true}
}

exports.createNewToken = async () => {
    try {
        let login = await axios.post(process.env.BOULEZ_HOSTNAME+"/api/login", {
            username: process.env.BOULEZ_USERNAME,
            password: process.env.BOULEZ_PASSWORD
        })
        if (login.data.status === 'OK') {
            return {
                error: false,
                token: login.data.token,
                created_at: new Date()
            }
        }
    }catch (e) {
        console.log("exception", e)
    }
    return {
        error: true
    }
}

