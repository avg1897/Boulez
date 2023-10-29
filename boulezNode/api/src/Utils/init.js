/**
 * Init File:
 * This file is executed only if project in development Mode (process.env.NODE_ENV = 'development'
 */

const crypto = require('crypto');
const db = require("../models");
const University = db.university;
const Subject = db.subject;
const Degree = db.degree;
const { TOKEN_SECRET = "secret" } = process.env;

const degrees = [
    "Informatica",
    "Fisica",
    "Chimica",
    "Matematica"
]

const accounts = [
    {
        "name": "Pegaso",
        "headquarter": "Napoli",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=pegaso",
        "username": "prova@unipegaso.it",
        "password": "Prova1234",
        "courses": ["Matematica", "Informatica", "Fisica", "Chimica"]
    },
    {
        "name": "Mercatorum",
        "headquarter": "Roma",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=mercatorum",
        "username": "prova@unimercatorum.it",
        "password": "Prova1234",
        "courses": ["Informatica", "Fisica", "Chimica"]
    },
    {
        "name": "Sapienza",
        "headquarter": "Roma",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=sapienza",
        "username": "prova@uniroma1.it",
        "password": "Prova1234",
        "courses": ["Matematica", "Informatica", "Chimica"]
    },
    {
        "name": "Bari",
        "headquarter": "Bari",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=bari",
        "username": "prova@unibari.it",
        "password": "Prova1234",
        "courses": ["Matematica", "Informatica", "Fisica"]
    },
    {
        "name": "Bologna",
        "headquarter": "Bologna",
        "api_link": "http://university_node_web:3000/boulez/GetCompletion?uni=bolonga",
        "username": "prova@unibologna.it",
        "password": "Prova1234",
        "courses": ["Matematica", "Fisica", "Chimica"]
    }
]

const subjects = [
    {
        name: "Analisi Matematica 1",
        degree: ["Informatica", "Matematica"]
    },
    {
        name: "Programmazione 1",
        degree: ["Informatica"]
    },
    {
        name: "Basi di Dati",
        degree: ["Informatica"]
    },
    {
        name: "Programmazione 2",
        degree: ["Informatica"]
    },
    {
        name: "Matematica Discreta",
        degree: ["Informatica"]
    },
    {
        name: "Linguaggi di Programmazione",
        degree: ["Informatica"]
    },
    {
        name: "Fisica 1",
        degree: ["Fisica"]
    },
    {
        name: "Chimica 1",
        degree: ["Chimica"]
    },
]

exports.createExampleAccounts = async () => {
    let UniNumer = await University.count({})
    if (UniNumer !== 0) {
        return;
    }

    for (const uni of accounts) {
        let password = crypto.createHash('md5').update(uni.password+TOKEN_SECRET).digest('hex');
        let degrees = await Degree.find({name: {"$in": uni.courses}}, 'id')
        let degreesId = Object.values(degrees).map( degree => degree._id)
        let uniObj = {
            name: uni.name,
            api_link: uni.api_link,
            username: uni.username,
            password: password,
            courses: degreesId
        }
        if (uni.headquarter) uniObj.headquarter = uni.headquarter;
        try {
            let university = new University(uniObj)
            university.save()
            console.log("Created University "+uniObj.name)
        }catch (e) {
            console.log(e.message)
        }
    }

}

exports.createExampleDegrees = async () => {
    let DegreesNum = await Degree.count({})
    if (DegreesNum !== 0) {
        return;
    }

    degrees.forEach( laurea => {
        try {
            let degree = new Degree({name: laurea})
            degree.save()
            console.log("Created Laurea "+laurea+" "+degree._id)
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

    for (const materia of subjects) {
        try {
            let degrees = await Degree.find({name: {"$in": materia.degree}}, 'id')
            let degreesId = Object.values(degrees).map( degree => degree._id)
            let subject = new Subject({
               name: materia.name,
               degree: degreesId
            })
            subject.save()
            console.log("Created Materia "+materia.name)
        }catch (e) {
            console.log(e.message)
        }

    }
}