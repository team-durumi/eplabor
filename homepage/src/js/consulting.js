import $ from "cash-dom"
import DirectusService from "./modules/DirectusService"
import { Modal } from "bootstrap"

$(() => {
    // 컨설팅 상세 화면 -- 인증 모달창 처리
    let authModal = document.querySelector('#authModal')
    let authModalInstance = new Modal(authModal)
    authModal.addEventListener('show.bs.modal', (event) => {
        let button = event.relatedTarget
        let type = button.getAttribute('data-type')
        let typeString = (type == 'update') ? '수정' : '삭제'
        let modalTitle = authModal.querySelector('.modal-title')
        let modalAction = authModal.querySelector('#action')
        modalTitle.textContent = '상담 ' + typeString + ' - 비밀번호 확인'
        modalAction.value = type
        // console.log(type, typeString, modalTitle)
    })
    authModal.addEventListener('hide.bs.modal', (event) => {
        authModal.querySelector('form').reset()
    })

    // 컨설팅 상세 화면 -- 인증 성공 시 수정 모달창 처리
    let updateConsultingFormModal = document.querySelector('#updateConsultingFormModal')
    let updateConsultingFormModalInstance = new Modal(updateConsultingFormModal)
    updateConsultingFormModal.addEventListener('shown.bs.modal', (event) => {
        $('body').addClass('modal-open')
    })
    updateConsultingFormModal.addEventListener('hide.bs.modal', (event) => {
        $('.modal-backdrop').hide()
    })

    // 컨설팅 상세 화면 -- 수정 모달창에서 실제 수정 처리
    let authModalSubmit = $('#auth-modal-submit')
    if(authModalSubmit) {
        authModalSubmit.on('click', function (event) {
            let params = {
                "string": $('#passwd').val(),
                "collection": $('#collection').val(),
                "id": $('#item_id').val(),
                "type": $('#action').val(),
            };
            var errorMessage = '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.'
            $('#spinner-screen').show()
            postData('http://localhost:8080/eplabor/custom/auth', params)
                .then(res => {
                    // console.log(res)
                    $('#spinner-screen').hide()
                    if (res.hasOwnProperty('data') && res.data.valid) {
                        // alert('이제 수정할 수 있습니다.')
                        authModalInstance.hide()
                        updateConsultingFormModalInstance.show()
                        fillForm($('form', updateConsultingFormModal), res.data)
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
    }

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
        if (!form) throw Error('폼이 없습니다.')
        form = form[0]
        Object.keys(data).forEach(function (key) {
            var elm = form.querySelector('[name=' + key + ']')
            if (elm && data[key]) {
                if (elm.getAttribute('type') == 'text'
                    || elm.getAttribute('type') == 'email'
                    || elm.tagName == 'TEXTAREA') {
                    elm.value = data[key]
                }
                if (elm.getAttribute('type') == 'radio') {
                    var item = form.querySelector('[name=' + key + '][value="' + data[key] + '"]')
                    console.log(key, data[key])
                    item.checked = true
                }
            }
        })
    }

    // 폼 검증 시도
    var forms = $('.needs-validation')
    if (forms) {
        var validation = Array.prototype.filter.call(forms, function (form) {
            var button = form.querySelector('button[type=button]');
            button.addEventListener('click', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault(); event.stopPropagation();
                    console.log('error')
                } else {
                    event.preventDefault();
                    let params = {};
                    let formData = new FormData(form);
                    formData.forEach((value, key) => {params[key] = value});
                    // let params = JSON.stringify(object);
                    
                    if (params.action_type == 'create') {
                        console.log('create')
                        DirectusService.create(params)
                            .then(res => { console.log(res) })
                            .error(err => { console.log(error) })
                    }
                    if (params.action_type == 'update') {
                        console.log('update')
                        DirectusService.update(params)
                            .then(res => { console.log(res) })
                            .error(err => { console.log(error) })
                    }
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
})
