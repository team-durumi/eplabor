import "bootstrap"
import util from "./modules/UtilService"
import validation from "./modules/ValidationService"
import api from "./modules/DirectusService"

$(() => {
    // check api status
    // api.ping().then(result => { console.log(api.messages[result]); })

    // 폼 검증, 메뉴 드롭다운, 모달 초기화
    validation.init()
    $('.dropdown-toggle').dropdown()
    let authModal = $('#authModal')

    // 체크박스 선택 시 정수로 값 할당
    $('input[type="checkbox"]').on('change', function () { this.value ^= 1; });

    // 교육 프로그램 참여 신청
    let workshopForm = $('#participate-workshop')
    let buttons = $('button[type=button]', workshopForm)
    buttons.on('click', event => {
        event.preventDefault(); event.stopPropagation();
        if (workshopForm.hasClass('has-errors')) return false
        let payloads = util.getPayloads(workshopForm.first())
        $('#spinner-screen').show()
        api.create(payloads)
            .then(res => {
                // console.log(res)
                $('#spinner-screen').hide()
                let message = api.messages['participate-workshop']
                if (res.data.error) message = api.messages[res.data.error]
                alert(message)
            })
            .catch(error => {
                $('#spinner-screen').hide()
                // console.log(err)
                alert(api.messages['error'])
            })
    })

    // 교육 프로그램 참여신청 -- 인증 모달창 표시 시 데이터 전달
    if (authModal.length > 0) {
        authModal.on('show.bs.modal', event => {
            let actions = { 'check': '확인', 'update': '수정', 'delete': '삭제' }
            let actionType = $(event.relatedTarget).data('action')
            let message = (actionType) ? actions[actionType] : ''
            let workshopTitle = $('#workshop-title').text()
            $('[name=action_type]', authModal).val($(event.relatedTarget).data('action'))
            $('[name=item_id]', authModal).val(workshopTitle)
            $('.modal-title', authModal).text('교육 신청 ' + message + ' - 비밀번호 확인')
        })
        authModal.on('hidden.bs.modal', function (event) {
            $('form', authModal).trigger("reset")
        })
    }

    // 교육 프로그램 참여신청 확인 -- 인증 모달창 처리
    if ($('#authModalFormButton').length > 0) {
        $('#authModalFormButton').on('click', function (event) {
            event.preventDefault(); event.stopPropagation();
            if ($('form', '#authModal').hasClass('has-errors')) return false
            let payloads = util.getPayloads($('form', '#authModal'))
            let actionType = payloads['action_type']
            $('#spinner-screen').show()
            api.auth(payloads)
                .then(result => {
                    if (result.data && result.data.valid) {
                        // 교육 프로그램 참여신청 여부 확인
                        if (actionType == 'check') {
                            alert(api.messages['workshop-participated'])
                        }
                        // 교육 프로그램 참여신청 수정폼에 아이템 데이터 채우기
                        if (actionType == 'update') {
                            let data = {}
                            $.each(result.data, (key, value) => { data['update_' + key] = value })
                            $('#updateParticipationFormModal').modal('show')
                            util.fillForm($('form', '#updateParticipationFormModal'), data)
                        }
                        // 교육 프로그램 참여신청 취소
                        if (actionType == 'delete' && result.data.status == 'deleted') {
                            alert(api.messages['canceled'])
                        }
                    } else {
                        alert(api.messages['participation-not-found'])
                    }
                })
                .catch(error => {
                    alert(api.messages['error'])
                    // console.log(error)
                });
            $('#spinner-screen').hide()
            util.hideModal(authModal)
            return false;
        });
    }

    // 교육 프로그램 참여신청 수정
    let updateModal = $('#updateParticipationFormModal')
    let updateForm = $('#updateParticipationForm')
    let updateSumbit = $('#update_parcitipate-workshop-submit')
    if (updateSumbit.length > 0) {
        updateSumbit.on('click', event => {
            event.preventDefault(); event.stopPropagation();
            if (updateForm.hasClass('has-errors')) return false
            let payloads = util.getPayloads(updateForm)
            let data = {}
            $.each(payloads, (key, value) => { if (value) data[key.replace('update_', '')] = value })
            api.update(data)
                .then(result => {
                    // console.log(result)
                    if (result.data.status == 'published') {
                        alert(api.messages['updated'])
                    }
                })
                .catch(error => {
                    alert(api.messages['error'])
                    // console.log(error)
                })
            $('#spinner-screen').hide()
            util.hideModal(updateModal)
        })
    }

})
