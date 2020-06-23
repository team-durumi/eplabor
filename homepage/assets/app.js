let $ = document.querySelector.bind(document);
nunjucks.configure('/templates', { autoescape: false });

window.addEventListener('DOMContentLoaded', function() {
    header = $('#header');
    window.onscroll = () => {
        if (window.pageYOffset > header.offsetHeight) {
            header.classList.add('sticky-top');
            $('#header img').setAttribute('height', '40px');
        } else {
            header.classList.remove('sticky-top');
            $('#header img').setAttribute('height', '80px');
        }
    }

    test = nunjucks.render('_row.njk', {
        'title': "nunjuck test",
        'body': "이상하군 왜 되는거지?"
    });

});