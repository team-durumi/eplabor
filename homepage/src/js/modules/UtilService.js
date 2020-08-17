const UtilService = (($) => {
    'use strict'

    const fillForm = (form, data) => {
        if (!form) throw Error('폼을 찾을 수 없습니다.')
        $.each( data, (key, value) => {
            let elm = $('[name=' + key + ']', form)
            if (elm && data[key] && elm.attr('type') != 'password') {
                if (elm.attr('type') != 'radio') {
                    elm.val(data[key])
                } else {
                    $('[name=' + key + '][value="' + data[key] + '"]', form).prop('checked', true)
                }
            }
        })
    }

    const hideModal = (elm) => {
        if( (elm.data('bs.modal') || {_isShown: false})._isShown) {
            elm.modal('hide')
            $('body').removeClass('modal-open')
            $('.modal-backdrop').removeClass('show').hide()
        }
    }

    const getPayloads = (elm) => {
        return $(elm).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value; return obj;
        }, {});
    }

    return {
        fillForm,
        hideModal,
        getPayloads
    }
})(jQuery)

export default UtilService;
