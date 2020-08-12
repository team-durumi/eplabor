import $ from "cash-dom"
import { Modal } from "bootstrap"

$(() => {
    // 상담 상세 화면 -- 인증 모달창 표시 시 데이터 전달
    let authModal = document.querySelector('#authModal')
    if (authModal) {
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
    }

    // 상담 상세 화면 -- 상담 수정폼 모달 표시할 때 오류 바로잡기
    let updateConsultingFormModal = document.querySelector('#updateConsultingFormModal')
    if (updateConsultingFormModal) {
        updateConsultingFormModal.addEventListener('shown.bs.modal', (event) => {
            $('body').addClass('modal-open')
        })
        updateConsultingFormModal.addEventListener('hide.bs.modal', (event) => {
            $('.modal-backdrop').hide()
        })
    }

    // 상담 상세 화면 -- 인증 성공 시 상담 수정폼에 아이템 데이터 채우기
    let authModalSubmit = $('#auth-modal-submit')
    if (authModal && authModalSubmit) {
        let authModalInstance = new Modal(authModal)
        let updateConsultingFormModalInstance = new Modal(updateConsultingFormModal)
        authModalSubmit.on('click', function (event) {
            let params = {
                "string": $('#passwd').val(),
                "collection": $('#collection').val(),
                "item_id": $('#item_id').val(),
                "type": $('#action').val(),
            };
            var errorMessage = '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.'
            $('#spinner-screen').show()
            postData('http://localhost:8080/eplabor/custom/auth', params)
                .then(res => {
                    console.log(res.data)
                    $('#spinner-screen').hide()
                    if (res.hasOwnProperty('data') && res.data.valid) {
                        alert('이제 수정할 수 있습니다.')
                        authModalInstance.hide()
                        updateConsultingFormModalInstance.show()
                        fillForm($('form', updateConsultingFormModal), res.data)
                    } else {
                        alert('비밀번호가 일치하지 않습니다.')
                    }
                    if (res.hasOwnProperty('error') && res.error.message) alert(errorMessage);
                })
                .catch(error => {
                    console.log(error)
                    alert(errorMessage)
                });
        });
    }

    // 상담 상세 화면 -- 상담 수정 처리
    let updateConsultingFormButton = $('#updateConsultingFormButton');
    if (updateConsultingFormButton && updateConsultingFormModal) {
        updateConsultingFormButton.on('click', (event) => {
            console.log('updateConsultingFormButton')
            let updateConsultingForm = $('#updateConsultingForm');
            if(updateConsultingForm.hasClass('has-errors')) {
                console.log(updateConsultingForm); return false;
            } 
            var errorMessage = '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.'
            $('#spinner-screen').show()
            let params = {}
            let formData = new FormData(updateConsultingForm.get(0))
            for (var pair of formData.entries()) {
                params[pair[0]] = pair[1]
            }
            if(!params['consultee_password']) delete params['consultee_password'];
            let updateConsultingFormModalInstance = new Modal(updateConsultingFormModal)
            updateConsultingFormModalInstance.hide()
            postData('http://localhost:8080/eplabor/custom/auth/process', params)
                .then(res => {
                    console.log(res)
                })
                .catch(error => {
                    console.log(error)
                })

        })
    }

    // 상담 신규 추가 /consulting/request
    let createConsultingFormButton = $('#createConsultingFormButton')
    if(createConsultingFormButton) {
        createConsultingFormButton.on('click', event => {
            let createConsultingForm = $('#createConsultingFormButton')
            if(createConsultingForm.hasClass('has-errors')) {
                console.log(createConsultingForm); return false;
            } 
            var errorMessage = '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.'
            $('#spinner-screen').show()
            let params = {}
            for (var pair of new FormData(document.querySelector('#createConsultingForm')).entries()) {
                params[pair[0]] = pair[1]
            }
            postData('http://localhost:8080/eplabor/custom/auth/process', params)
                .then(res => {
                    console.log(res)
                })
                .catch(error => {
                    console.log(error)
                })
        })
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
            let elm = form.querySelector('[name=' + key + ']')
            if (elm && data[key] && elm.getAttribute('type') != 'password') {
                console.log(elm.getAttribute('type'))
                if (elm.getAttribute('type') != 'radio') {
                    elm.value = data[key]
                } else {
                    let item = form.querySelector('[name=' + key + '][value="' + data[key] + '"]')
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
                    form.classList.add = 'has-errors'
                } else {
                    event.preventDefault();
                    console.log('good')
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
