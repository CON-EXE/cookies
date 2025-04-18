'use strict';

const { log } = console;

const LIFETIME = 15;

const cookies = select('.cookies');
const settingsDialog = select('.settings-dialog');
const settings = select('.settings');
const accept = select('.accept');
const save = select('.save');

// Check boxes
const cookieBrowser = select('.cookie-browser');
const cookieOs = select('.cookie-os');
const cookieWidth = select('.cookie-width');
const cookieHeight = select('.cookie-height');


function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}


function  getOS() {
    const os = navigator.userAgent;

    if (os.indexOf('Windows') !== -1) {
        return 'Windows';
    } else if (os.indexOf('Mac') !== -1) {
        return 'Mac';
    } else {
        return 'Other';
    }
}

function getBrowser() {
    let userAgent = navigator.userAgent;
  
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Google Chrome';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        return 'Safari';
    } else if (userAgent.indexOf('Firefox') > -1) {
        return 'Mozilla Firefox';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
        return 'Internet Explorer';
    } else if (userAgent.indexOf('Edge') > -1) {
        return 'Microsoft Edge';
    } else {
        return 'other';
    }
}

function getWidth() {
    return window.innerWidth;
}

function getHeight() {
    return window.innerHeight;
}


function checkCookies() {
    if (document.cookie.length === 0) {
        setTimeout(() => {
            cookies.showModal();
        }, 3000);
    } else {
        showCookies();
    }
}

function createCookies() {
    if (cookieBrowser.checked) { setCookie('Browser', getBrowser()); }
    if (cookieOs.checked) { setCookie('Operating System', getOS()); }
    if (cookieWidth.checked) { setCookie('Screen Width', getWidth()); }
    if (cookieHeight.checked) { setCookie('Screen Height', getHeight()); }
}

function getDate() {
    let date = new Date();
    date.setSeconds(date.getSeconds() + LIFETIME);
    date = date.toUTCString();
    return date;
}

function setCookie(name, value) {
    const options = {
        path: '/',
        SameSite: 'Lax',
        expires: getDate()
    };

    // construct the cookie setting
    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    for (let option in options) {
        cookieString += ';' + option + '=' + options[option]
    }

    document.cookie = cookieString;
    
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const [cookieName, cookieValue] = cookies[i].split('=').map(c => c.trim());
        if (decodeURIComponent(cookieName) === decodeURIComponent(name)) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

function showCookies() { // Only displays existing cookies in console
    if(getCookie('Browser') !== null) { log(`Browser = ${getCookie('Browser')}`); }
    if(getCookie('Operating System') !== null) { log(`Operating System = ${getCookie('Operating System')}`); }
    if(getCookie('Screen Width') !== null) { log(`Screen Width = ${getCookie('Screen Width')}`); }
    if(getCookie('Screen Height') !== null) { log(`Screen Height = ${getCookie('Screen Height')}`); }
}

checkCookies();

listen('click', accept, () => {
    createCookies();
    cookies.close();
    showCookies();
});

listen('click', settings, () => {
    cookies.close();
    settingsDialog.showModal();
});

listen('click', save, () => {
    createCookies();
    settingsDialog.close();
    showCookies();
});