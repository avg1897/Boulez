const chatbotClient = new ChatbotClient();
let chatId;
let feedback = false;
let currentAnswerSelected;
$(document).ready(function () {
    let queryParam = new URLSearchParams(window.location.search);
    let universty_id = queryParam.get('universty_id')

    if (!universty_id) {
        window.location.href = "/index.html"
    }

    let title = $('#uni_name');

    switch (universty_id) {
        default:
        case 1:
            title.text("Pegaso")
            break;
        case 2:
            title.text("Mercatorum")
            break;
        case 3:
            title.text("La Sapienza")
            break;
    }

    $('.subject').click(async (event) => {
        event.preventDefault();

        $('.step-1').addClass('hide')

        let chat = await chatbotClient.newChat(universty_id)
        if (chat) {
            console.log(chat)
            chatId = chat.id;

            $('.step-2').removeClass('hide')
            $('#subject').text(event.target.text)
        }
    })

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
        $('.answers').empty();
        answers.forEach((answer) => {
            let item = `<div class="answer">
                Risposta: ${answer.answer}
                <a class="goto-feedback" onclick="gotoFeedback('${answer.id}', '${answer.answer}')" href="#">Vota la risposta</a>
                </div>`
            $('.answers').append(item)
        })
    })

    $('.action-feedback').click(async (event) => {
        //TODO: dare feedback 1 volta per risposta
        event.preventDefault();
        let rating = $(event.target).attr('data-value');
        if (!feedback) {
            feedback = true;
            let response = await chatbotClient.feedback(chatId, currentAnswerSelected, rating);
            if (response.status === 'OK') {
                alert('Grazie per il tuo feedback!')
            } else {
                alert('Hai già inviato il feedback per questa risposta!')
            }
        }
    })


});

function gotoFeedback(question_id, prompt) {
    currentAnswerSelected = question_id
    $('.feedback').removeClass('hide')
    $('.feedback-title').text(`Ti è piaciuta la risposta ${prompt} ?`)
}