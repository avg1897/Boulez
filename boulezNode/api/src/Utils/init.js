/**
 * Init File:
 * This file is executed only if project in development Mode (process.env.NODE_ENV = 'development'
 */

const crypto = require('crypto');
const db = require("../models");
const University = db.university;
const { TOKEN_SECRET = "secret" } = process.env;

const accounts = [
    {
        "name": "Pegaso",
        "headquarter": "Napoli",
        "api_link": "localhost:3000/pegaso/boulez/GetCompletion",
        "username": "prova@unipegaso.it",
        "password": "Prova1234"
    },
    {
        "name": "Mercatorum",
        "headquarter": "Roma",
        "api_link": "localhost:3000/mercatorum/boulez/GetCompletion",
        "username": "prova@unimercatorum.it",
        "password": "Prova1234"
    },
    {
        "name": "Sapienza",
        "headquarter": "Roma",
        "api_link": "localhost:3000/sapienza/boulez/GetCompletion",
        "username": "prova@uniroma1.it",
        "password": "Prova1234"
    }
]

exports.createExampleAccounts = async () => {
    let UniNumer = await University.count({})
    if (UniNumer !== 0) {
        return;
    }

    accounts.forEach(uni => {
        let password = crypto.createHash('md5').update(uni.password+TOKEN_SECRET).digest('hex');
        let uniObj = {
            name: uni.name,
            api_link: uni.api_link,
            username: uni.username,
            password: password,
        }
        if (uni.headquarter) uniObj.headquarter = uni.headquarter;
        try {
            let university = new University(uniObj)
            university.save()
            console.log("Created University "+uniObj.name)
        }catch (e) {
            console.log(e.message)
        }
    })

}