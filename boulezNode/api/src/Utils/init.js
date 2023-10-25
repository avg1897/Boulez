/**
 * Init File:
 * This file is executed only if project in development Mode (process.env.NODE_ENV = 'development'
 */

const crypto = require('crypto');
const db = require("../models");
const University = db.university;
const Subject = db.subject;
const { TOKEN_SECRET = "secret" } = process.env;

const accounts = [
    {
        "name": "Pegaso",
        "headquarter": "Napoli",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=pegaso",
        "username": "prova@unipegaso.it",
        "password": "Prova1234"
    },
    {
        "name": "Mercatorum",
        "headquarter": "Roma",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=mercatorum",
        "username": "prova@unimercatorum.it",
        "password": "Prova1234"
    },
    {
        "name": "Sapienza",
        "headquarter": "Roma",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=sapienza",
        "username": "prova@uniroma1.it",
        "password": "Prova1234"
    }
]

const subjects = [
    "Analisi Matematica 1",
    "Programmazione 1",
    "Basi di Dati",
    "Programmazione 2",
    "Matematica Discreta",
    "Linguaggi di Programmazione"
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

exports.createExampleSubjects = async () => {
    let SubjectNum = await Subject.count({})
    if (SubjectNum !== 0) {
        return;
    }

    subjects.forEach(materia => {
        try {
           let subject = new Subject({name: materia})
            subject.save()
            console.log("Created Materia "+materia)
        }catch (e) {
            console.log(e.message)
        }

    })
}