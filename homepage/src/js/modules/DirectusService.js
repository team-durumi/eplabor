import DirectusSDK from "@directus/sdk-js"

const DirectusService = (() => {
    'use strict';
    const client = new DirectusSDK({
        url: "http://localhost:8080",
        project: "eplabor"
    })

    const serverPing = () => {
        client.ping()
            .then(res => { console.log(res); return res })
            .catch(err => { console.log(err); return err });
    }

    const auth = (params) => {
        client.api.post('/custom/auth', params)
            .then(res => { console.log(res); return res })
            .catch(err => { console.log(err); return err });
    }

    const create = (params) => {
        client.api.post('/custom/auth/process', params)
            .then(res => { console.log(res); return res })
            .catch(err => { console.log(err); return err });
    }

    const update = (params) => {
        client.api.post('/custom/auth/process', params)
            .then(res => { console.log(res); return res })
            .catch(err => { console.log(err); return err });
    }

    const remove = (params) => {
        client.api.post('/custom/auth/process', params)
            .then(res => { console.log(res); return res })
            .catch(err => { console.log(err); return err });
    }

    return {
        serverPing,
        auth,
        create,
        update,
        remove
    }
})()

export default DirectusService
