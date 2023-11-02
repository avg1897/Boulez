const db = require("../models");
const University = db.university;

let universities = [
    {
        university_id: 1,
        username: "prova@unipegaso.it",
        password: "Prova1234",
    }, {
        university_id: 2,
        username: "prova@unimercatorum.it",
        password: "Prova1234",
    }, {
        university_id: 3,
        username: "prova@uniroma1.it",
        password: "Prova1234",
    }, {
        university_id: 4,
        username: "prova@unibari.it",
        password: "Prova1234",
    }, {
        university_id: 5,
        username: "prova@unibologna.it",
        password: "Prova1234",
    },
]

exports.crateUniDatabase = async () => {
    //await University.deleteMany({})
    let UniNum = await University.count({})
    if (UniNum !== 0) {
        return;
    }

    universities.forEach((uni) => {
        try {
            let newUni = new University(uni)
            newUni.save()
            console.log("created uni "+uni.university_id)
        }catch (e) {
            console.log(e)
        }
    })

}