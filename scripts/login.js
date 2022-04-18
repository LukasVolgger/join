'use strict';

// ####################################### MAIN FUNCTIONS #######################################

async function initLogin() {
    await downloadFromServer();
    await loadFromBackend();
}

// https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};

const decrypt = (salt, encoded) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
};

function loginOrCreateAccount() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let createAccount = document.getElementById('create-account-checkbox').checked;

    // Encrypt user input
    const encrypted_username = crypt("salt", username);
    const encrypted_password = crypt("salt", password);

    console.log('Create new account: ' + createAccount);
    console.log('Encrypted username: ' + encrypted_username);
    console.log('Encrypted password: ' + encrypted_password);

    let user = {
        'username': encrypted_username,
        'password': encrypted_password,
        'creation_date': new Date().getTime()
    }

    // Either create new user account if the checkbox is checked or login as existing user
    if (username && password && createAccount) {
        console.log('run => createUserAccount()');
        createUserAccount(user);
    } else {
        console.log('run => loginUserAccount()');
        loginUserAccount(user);
    }
}

function createUserAccount(user) {
    let userAlreadyExists;

    for (let i = 0; i < users.length; i++) {
        if (user.username == users[i].username) {
            userAlreadyExists = true;
        } else {
            userAlreadyExists = false;
        }
    }

    if (userAlreadyExists) {
        console.log('User already exists!');
    } else {
        console.log('User is free!');
        users.push(user);
        saveToBackend();
    }
}

function loginUserAccount(user) {
    for (let i = 0; i < users.length; i++) {
        let correctLoginInformation = user.username == users[i].username && user.password == users[i].password;

        if (correctLoginInformation) {
            loginSuccessful();
            break;
        } else {
            loginNotSuccessful(user);
            break;
        }
    }
}

function loginSuccessful() {
    let loginContainer = document.getElementById('login-form');

    console.log('Login successful!');
    loginContainer.innerHTML = loginSuccessfulMessage();
}

function loginNotSuccessful(user) {
    let messagesContainer = document.getElementById('login-messages');
    messagesContainer.innerHTML = '';

    for (let i = 0; i < users.length; i++) {
        if (user.username == users[i].username) {
            console.log('Incorrect password!');
            messagesContainer.innerHTML += loginErrorMessage('Incorrect password!');

            document.getElementById('password').value = '';

            break;
        } else {
            console.log('This user does not exist!');
            messagesContainer.innerHTML += loginErrorMessage('This user does not exist!');

            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            break;
        }
    }
}

function loginSuccessfulMessage() {
    return `
        <div class="alert alert-success" role="alert">
            Login successful!
        </div>
        <button type="button" class="btn btn-primary" onclick="redirect()">Continue</button>
    `;
}

function loginErrorMessage(string) {
    return `
        <div id="invalid-login" class="alert alert-danger" role="alert">
            ${string}
        </div>
    `;
}

function redirect() {
    window.location.href = './html/index.html';
}