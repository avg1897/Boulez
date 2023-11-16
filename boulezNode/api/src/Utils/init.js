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

        let subjects_id = []
        for (const course of uni.courses) {
            let materie = subjects.filter( s => s.degree.includes(course))
            let subjectsName = materie.map( s => s.name)
            let subject = await Subject.find({name: {"$in": subjectsName}}, "id");
            let newSubjects = Object.values(subject).map( s => s._id.toHexString())
            //immetto i nuovi id in subjects id omettendo duplicati
            subjects_id = subjects_id.concat(newSubjects.filter( id => !subjects_id.includes(id)))
        }
        let uniObj = {
            name: uni.name,
            api_link: uni.api_link,
            username: uni.username,
            password: password,
            subjects: subjects_id
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

exports.createExampleSubjects = async () => {
    let SubjectNum = await Subject.count({})
    if (SubjectNum !== 0) {
        return;
    }

    for (const materia of subjects) {
        try {
            let subject = new Subject({
               name: materia.name
            })
            subject.save()
            console.log("Created Materia "+materia.name)
        }catch (e) {
            console.log(e.message)
        }

    }
}