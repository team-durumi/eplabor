import $ from "cash-dom"
import DirectusService from "./modules/DirectusService"
import { Modal } from "bootstrap"

$(() => {
    // 교육 프로그램 참여 신청
    // form: #parcitipate-workshop
    // button: #parcitipate-workshop-submit
    
    // 교육 프로그램 참여 취소
    // 교육 프로그램 참여 신청 확인 -- 인증 모달창 처리
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
        console.log(type, typeString, modalTitle)
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
    var authModalSubmit = $('#auth-modal-submit')
    authModalSubmit.on('click', function (event) {
        var data = {
            "string": $('#passwd').val(),
            "id": $('#consulting-id').val(),
            "type": $('#action').val(),
        };
        var errorMessage = '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.'
        $('#spinner-screen').show()
        DirectusService.auth(data)
            .then( res => {
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

    var forms = $('.needs-validation');
    if (forms) {
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
})
