const show = document.querySelector('#showOrHide');

// adding event listener to show or hide password
show.addEventListener('click', () => { 
    const pswdInput = document.querySelector('#account_password');
    const type = pswdInput.getAttribute('type');
    if (type == 'password') {
        pswdInput.setAttribute('type', 'text');
        show.setAttribute('src','/images/password/eye-slash.svg');
    } else {
        pswdInput.setAttribute('type', 'password');
        show.setAttribute('src','/images/password/eye.svg');
    }
});