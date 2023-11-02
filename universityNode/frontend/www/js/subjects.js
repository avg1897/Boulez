const chatbotClient = new ChatbotClient();
let chatId;
let feedback = [];
let currentAnswerSelected;
let queryParam = new URLSearchParams(window.location.search);
let universty_id = queryParam.get('universty_id')
$(document).ready(async function () {

    if (!universty_id) {
        window.location.href = "/index.html"
    }

    let title = $('#uni_name');

    switch (universty_id) {
        default:
        case "1":
            title.append('<img src="img/pegaso.png" alt="Pegaso">')
            break;
        case "2":
            title.append('<img src="img/unimercatorum.png" alt="Uni Mercatorum">')
            break;
        case "3":
            title.append('<img src="img/sapienza.png" alt="Sapienza">')
            break;
    }

    let degrees = await chatbotClient.getDegrees(universty_id);
    if (!degrees.status) {
        degrees.forEach(degree => {
            $('.step-0').append(`<a class="degree" onclick="onDegreeClick(event)" data-id="${degree.id}" href="#">${degree.name}</a>`)
        })
    }

    //todo copiare stile da https://codepen.io/ramilulu/pen/mrNoXw
    $('.question').click(async (event) => {
        event.preventDefault();
        let domanda = event.target.text;

        $('.select-question').addClass('hide')
        $('.chatbot').removeClass('hide')

        $('.selected-question').text("Domanda: "+domanda)
        $('.answers').append(`<div class="answer">Risposta: ...</div>`)

        let answer = await chatbotClient.question(chatId, domanda);
        $('.answers').empty();
        let answers = [answer]
        answers.forEach((answer) => {
            let item = `<div class="answer">
                Risposta: ${answer}
                <a class="goto-feedback" onclick="gotoFeedback('0', '${answer}')" href="#">Vota la risposta</a>
                </div>`
            $('.answers').append(item)
        })
        $('.actions-1').removeClass('hide')
    })

    $('.regenerate-answer').click(async (event) => {
        event.preventDefault();
        $('.actions-1').addClass('hide')
        $('.answers').empty();
        $('.answers').append(`<div class="answer">Risposta: ...</div>`)
        let answers = await chatbotClient.regenerateQuestion(chatId);
        console.log("answers", answers)
        $('.answers').empty();
        answers.forEach((answer) => {
            let item = `<div class="answer">
                Risposta: ${answer.completion}
                <a class="goto-feedback" onclick="gotoFeedback('${answer.id}', '${answer.completion}')" href="#">Vota la risposta</a>
                </div>`
            $('.answers').append(item)
        })
    })

    $('.action-feedback').click(async (event) => {
        event.preventDefault();
        let rating = $(event.target).attr('data-value');
        if (!feedback.includes(currentAnswerSelected)) {
            feedback.push(currentAnswerSelected);
            if (chatId !== 0) {
                let response = await chatbotClient.feedback(chatId, currentAnswerSelected, rating);
                if (response.status === 'OK') {
                    alert('Grazie per il tuo feedback!')
                } else {
                    alert('Hai già inviato il feedback per questa risposta!')
                }
            }else {
                alert('Grazie per il tuo feedback!')
            }
        }else {
            alert('Hai già inviato il feedback per questa risposta!')
        }
    })

    $('.goto-feedback').click(async (event) => {
        event.preventDefault();
        $('.actions-1').hide()
        chatId = 0
        gotoFeedback(0, "Risposta generata internamente")
    })


});

function gotoFeedback(question_id, prompt) {
    currentAnswerSelected = question_id
    console.log("curr answer", currentAnswerSelected)
    $('.feedback').removeClass('hide')
    $('.feedback-title').text(`Ti è piaciuta la risposta ${prompt} ?`)
}

async function onDegreeClick(event) {
    event.preventDefault();

    $('.step-0').addClass('hide')
    $('.step-1').removeClass('hide')
    let degreeId = $(event.target).attr('data-id');

    let subjects = await chatbotClient.getSubject(degreeId)
    if (!subjects.status) {
        subjects.forEach(subject => {
            $('.step-1').append(`<a class="subject" onclick="onSubjectClick(event)" data-id="${subject.id}" href="#">${subject.name}</a>`)
        })
    }
}

async function onSubjectClick(event) {
    event.preventDefault();

    $('.step-1').addClass('hide')
    let subjectId = $(event.target).attr('data-id');

    let chat = await chatbotClient.newChat(universty_id, subjectId)
    if (chat) {
        console.log(chat)
        chatId = chat.id;

        $('.step-2').removeClass('hide')
        $('#subject').text(event.target.text)
    }
}