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

    $('.subject').click((event) => {
        event.preventDefault();

        $('.step-1').addClass('hide')
        $('.step-2').removeClass('hide')

        $('#subject').text(event.target.text)
    })

    //todo copiare stile da https://codepen.io/ramilulu/pen/mrNoXw
    $('.question').click((event) => {
        event.preventDefault();

        $('.select-question').addClass('hide')
        $('.chatbot').removeClass('hide')

        $('.selected-question').text("Domanda: "+event.target.text)
        $('.answer').text("Risposta: ...")

        $('.actions-1').removeClass('hide')
    })

    $('.goto-feedback').click((event) => {
        event.preventDefault();
        $('.actions-1').addClass('hide')
        $('.actions-2').removeClass('hide')
    })

    $('.regenerate-answer').click((event) => {
        event.preventDefault();

        alert('Chiamare API per generare la risposta')
    })

    $('.action-feedback').click((event) => {
        event.preventDefault();

        alert('Grazie per il tuo feedback')
    })


});