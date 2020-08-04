
import * as bootstrap from 'bootstrap';
import "./misc.js"
import "../scss/style.scss"

window.addEventListener('DOMContentLoaded', function () {
    if(window.jQuery) jQuery.noConflict()
    let $ = document.querySelector.bind(document);
    let $$ = document.querySelectorAll.bind(document);
    let header = $('#header');
    window.onscroll = () => {
        if (window.pageYOffset > header.offsetHeight) {
            header.classList.add('sticky-top');
            $('#header img').setAttribute('height', '40px');
        } else {
            header.classList.remove('sticky-top');
            $('#header img').setAttribute('height', '80px');
        }
    }

    // console.log('test!!!!');
    // fetch('http://localhost:8080/eplabor/custom/onlines')
    //     .then(function (response) {
    //         return response.json()
    //     }).then(function (json) {
    //         console.log('parsed json', json)
    //     }).catch(function (ex) {
    //         console.log('parsing failed', ex)
    //     })

    var forms = $$('.needs-validation');
    if(forms) {
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault()
                    event.stopPropagation()
                    console.log('error')
                } else {
                    console.log('good')
                }
                form.classList.add('was-validated');
            }, false);
        });
    }

    if ($("#consulting-request-submit")) {
        var httpRequest;
        $("#consulting-request-submit").addEventListener('click', function (e) {
            e.preventDefault();
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = alertContents;
            httpRequest.open('POST', 'http://localhost:8080/eplabor/items/eplabor_consultings');
            httpRequest.send(new FormData(document.forms[0]));
        });

        function alertContents() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    alert('정상적으로 접수됐습니다. 담당자가 연락드리겠습니다.');
                } else {
                    alert('상담을 처리할 수 없습니다. 센터로 전화주세요.');
                }
            }
        }
    }

});

