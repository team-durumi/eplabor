
import * as bootstrap from 'bootstrap';
import "../scss/style.scss"

window.bootstrap = bootstrap
if(window.jQuery) jQuery.noConflict()
let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)

// common.js
// index.js
// consulting.js
// workshop.js

window.addEventListener('DOMContentLoaded', () => {
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

    var authModal = $('#authModal')
    var authModalInstance = new bootstrap.Modal(authModal)
    authModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget
        var type = button.getAttribute('data-type')
        var typeString = (type == 'update') ? '수정' : '삭제'
        var modalTitle = authModal.querySelector('.modal-title')
        var modalAction = authModal.querySelector('#action')
        modalTitle.textContent = '상담 ' + typeString + ' - 비밀번호 확인'
        modalAction.value = type
    })
    authModal.addEventListener('hide.bs.modal', function (event) {
        $("#auth-modal-form").reset();
    })

    var updateConsultingFormModal = $('#updateConsultingFormModal')
    var updateConsultingFormModalInstance = new bootstrap.Modal(updateConsultingFormModal)

    updateConsultingFormModal.addEventListener('shown.bs.modal', function (event) {
        document.querySelector('body').classList.add('modal-open');
    })

    var authModalSubmit = $('#auth-modal-submit')
    authModalSubmit.addEventListener('click', function (event) {
        var data = {
            "string": $('#passwd').value,
            "id": $('#consulting-id').value,
            "type": $('#action').value,
        };
        var errorMessage = '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.'
        $('#spinner-screen').style.display = 'block';
        postData('http://localhost:8080/eplabor/custom/auth', data)
            .then(function (res) {
                // console.log(res)
                $('#spinner-screen').style.display = 'none';
                if (res.hasOwnProperty('data') && res.data.valid) {
                    // alert('이제 수정할 수 있습니다.')
                    authModalInstance.hide()
                    updateConsultingFormModalInstance.show()
                    fillForm(updateConsultingFormModal.querySelector('form'), res.data)
                } else {
                    alert('비밀번호가 일치하지 않습니다.')
                }
                if (res.hasOwnProperty('error') && res.error.message) alert(errorMessage);
            })
            .catch(function (error) {
                console.log(error)
                alert(errorMessage)
            });
    });

    function postData(url = '', data = {}) {
        // Default options are marked with *
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects
    }

    function fillForm(form, data) {
        if(!form) throw Error('폼이 없습니다.')
        Object.keys(data).forEach(function(key) {
            var elm = form.querySelector('[name=' + key + ']')
            if(elm && data[key]) {
                if(elm.getAttribute('type') == 'text'
                    || elm.getAttribute('type') == 'email'
                    || elm.tagName == 'TEXTAREA') {
                    elm.value = data[key]
                }
                if(elm.getAttribute('type') == 'radio') {
                    var item = form.querySelector('[name=' + key + '][value="' + data[key] + '"]')
                    item.checked = true
                }
            }
        })
    }

    var forms = $$('.needs-validation');
    if(forms) {
        var validation = Array.prototype.filter.call(forms, function (form) {
            var button = form.querySelector('button[type=button]');
            button.addEventListener('click', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault()
                    event.stopPropagation()
                    console.log('error')
                } else {
                    event.preventDefault();
                    console.log('good', form, new FormData(form));
                    return false;
                    httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = alertContents;
                    httpRequest.open('POST', 'http://localhost:8080/eplabor/items/eplabor_consultings');
                    httpRequest.send(new FormData(form));
                }
                form.classList.add('was-validated');
            }, false);
        });
    }

    function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                alert('정상적으로 접수됐습니다. 담당자가 연락드리겠습니다.');
            } else {
                alert('상담을 처리할 수 없습니다. 센터로 전화주세요.');
            }
        }
    }

});

