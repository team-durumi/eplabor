import "bootstrap"
import util from "./modules/UtilService"
import validation from "./modules/ValidationService"
import api from "./modules/DirectusService"

$(() => {
    // form: #parcitipate-workshop
    // button: #parcitipate-workshop-submit
    let workshopForm = $('#participate-workshop')
    let buttons = $('button[type=button]', workshopForm)

    api.ping().then(result => {
        console.log(api.messages[result]);
    })

    // 폼 검증 시작
    validation.init()
    $('.dropdown-toggle').dropdown()

    buttons.on('click', event => {
        // 교육 프로그램 참여 신청
        // 교육 프로그램 참여 변경
        // 교육 프로그램 참여 신청 확인 -- 인증 모달창 처리
        // 교육 프로그램 참여 취소 -- 이건 어디서?
        let button = $(event.target)
        let action = button.data('action')
        let payloads = util.getPayloads(workshopForm)
        console.log(action, params)
        // api.create(params).then()
    })
    
})
