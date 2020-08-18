
import "bootstrap"
import util from "./modules/UtilService"
import validation from "./modules/ValidationService"
import api from "./modules/DirectusService"

$(() => {
    // 폼 검증 시작
    validation.init()
    $('.dropdown-toggle').dropdown()

    let authModal = $('#authModal')
    let updateConsultingFormModal = $('#updateConsultingFormModal')

    // 상담 상세 화면 -- 인증 모달창 표시 시 데이터 전달
    if (authModal.length > 0) {
        authModal.on('show.bs.modal', event => {
            let actions = { 
                'update': '수정',
                'delete': '삭제'
            }
            let actionType = $(event.relatedTarget).data('type')
            let message = (actionType) ? actions[actionType] : ''
            $('[name=action_type]', authModal).val($(event.relatedTarget).data('type'))
            $('.modal-title', authModal).text('상담 ' + message + ' - 비밀번호 확인');
        })
        authModal.on('hidden.bs.modal', function (event) {
            $('form', authModal).trigger("reset")
        })
    }

    // 상담 상세 화면 -- 인증 성공 시 상담 수정폼에 아이템 데이터 채우기
    if ($('#authModalFormButton').length > 0) {
        $('#authModalFormButton').on('click', function (event) {
            event.preventDefault(); event.stopPropagation();
            let payloads = util.getPayloads($('form', '#authModal'))
            let type = payloads['action_type']

            if ($('form', '#authModal').hasClass('has-errors')) return false
            $('#spinner-screen').show()
            // console.log(payloads)
            api.auth(payloads)
                .then(res => {
                    console.log(res)
                    if (res.data && res.data.valid) {
                        if(type == 'update') {
                            $('#updateConsultingFormModal').modal('show')
                            util.fillForm($('form', '#updateConsultingFormModal'), res.data)
                        }
                        if(type == 'delete' && res.data.status == 'deleted') {
                            alert(api.messages['cancel-consulting'])
                            window.location.href='/consulting/online/'
                        }
                    } else {
                        alert(api.messages['password-not-match'])
                    }
                })
                .catch(error => { 
                    // alert(api.messages['error'])
                    console.log(error)
                });
            $('#spinner-screen').hide()
            util.hideModal(authModal)
            return false;
            
        });
    }

    // 상담 상세 화면 -- 상담 수정, 삭제 처리
    if ($('#updateConsultingFormButton').length > 0) {
        $('#updateConsultingFormButton').on('click', (event) => {
            event.preventDefault(); event.stopPropagation();
            if ($('#updateConsultingForm').hasClass('has-errors')) return false;
            $('#spinner-screen').show()
            let payloads = util.getPayloads($('#updateConsultingForm'))
            if (!payloads['consultee_password']) delete payloads['consultee_password'];
            let action = $(event.target).data('action')
            api[action](payloads)
                .then(res => { console.log(res) })
                .catch(error => { console.log(error) })
            $('#spinner-screen').hide()
            util.hideModal(updateConsultingFormModal)
        })
    }

    // 상담 신규 추가 -- /consulting/request
    let createConsultingFormButton = $('#createConsultingFormButton')
    if (createConsultingFormButton.length > 0) {
        createConsultingFormButton.on('click', event => {
            event.preventDefault(); event.stopPropagation();
            let createConsultingForm = $('#createConsultingForm')
            if (createConsultingForm.hasClass('has-errors')) return false;
            $('#spinner-screen').show()
            let payloads = util.getPayloads($('#createConsultingForm'))
            api.create(payloads)
                .then(res => { 
                    if(res.data.id) {
                        alert(api.messages['create-consulting'])
                        window.location.href='/consulting/online/'
                    }
                })
                .catch(error => { console.log(error) })
            $('#spinner-screen').hide()
            return false;
        })
        return false;
    }

})
