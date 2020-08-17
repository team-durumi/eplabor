import DirectusSDK from "@directus/sdk-js"

const DirectusService = (() => {
    'use strict';
    const client = new DirectusSDK({
        url: "http://localhost:8080",
        project: "eplabor"
    })

    const messages = {
        'pong': 'api 서버가 요청을 처리할 수 있습니다.',
        'error': '문제가 생겨 확인할 수 없습니다. 센터로 전화주시면 감사하겠습니다.',
        'password-not-match': '비밀번호가 일치하지 않습니다.',
        'cancel-consulting': '무료 상담 요청을 취소했습니다.',
        'create-consulting': '무료 상담 요청을 작성하셨습니다.'
    }

    const ping = () => {
        return client.ping()
    }

    const auth = (params) => {
        return client.api.post('/custom/auth', params)
    }

    const create = (params) => {
        return client.api.post('/custom/auth/process', params)
    }

    const update = (params) => {
        return client.api.post('/custom/auth/process', params)
    }

    const remove = (params) => {
        return client.api.post('/custom/auth/process', params)
    }

    return {
        messages,
        ping,
        auth,
        create,
        update,
        remove
    }
})()

export default DirectusService
