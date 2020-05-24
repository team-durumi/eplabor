let $ = document.querySelector.bind(document);

window.addEventListener('DOMContentLoaded', () => {
    header = $('#header');
    window.onscroll = () => {
        if(window.pageYOffset > header.offsetHeight) {
            header.classList.add('sticky-top');
            $('#header img').setAttribute('height', '40px');
        } else {
            header.classList.remove('sticky-top');
            $('#header img').setAttribute('height', '80px');
        }
    }
});