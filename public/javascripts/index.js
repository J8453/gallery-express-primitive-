const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
// const profileBtn = document.getElementById('profileBtn');
const loginWindow = document.getElementsByClassName('login');
const registerWindow = document.getElementsByClassName('register');

function popLoginWindow() {
    loginWindow[0].style.display = 'flex';
}

function hideLoginWindow(e) {
    if (e.target === loginWindow[0]) loginWindow[0].style.display = 'none';
}

function popRegisterWindow() {
    registerWindow[0].style.display = 'flex';
}

function hideRegisterWindow(e) {
    if (e.target === registerWindow[0]) registerWindow[0].style.display = 'none';
}

if (loginBtn) loginBtn.addEventListener('click', popLoginWindow);
if (registerBtn) registerBtn.addEventListener('click', popRegisterWindow);
// if (profileBtn) profileBtn.addEventListener('click', () => {
//     const getProfile = new XMLHttpRequest();
//     getProfile.open("GET", "/users");
//     getProfile.send();
//     getProfile.onreadystatechange = function() {
//     	document = getProfile.responseXML;
//     }
// })
loginWindow[0].addEventListener('click', hideLoginWindow);
registerWindow[0].addEventListener('click', hideRegisterWindow);