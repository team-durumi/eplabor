const ValidationService = (($) => {
    'use strict'
    // 폼 검증
    const init = () => {
        // console.log('validation initialized')
        if ($('.needs-validation').length > 0) {
            $('.needs-validation').each((index, form)=> {
                let buttons = $('button[type=button]', form);
                buttons.on('click', (event) => {
                    if ($(event.target).data('dismiss') || $(event.target).parent().data('dismiss')) return true;
                    if (form.checkValidity() === false) {
                        event.preventDefault(); event.stopPropagation();
                        // console.log('error')
                        $(form).addClass('has-errors')
                    } else {
                        event.preventDefault();
                        $(form).removeClass('has-errors')
                        // console.log('good')
                    }
                    form.classList.add('was-validated');
                });
            });
        }
        return ''
    }

    return {
        init
    }
})(jQuery)

export default ValidationService;
