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
            console.log('Login successful!');

            // Exit for loop when successfully signed in
            break;
        } else {
            console.log('Incorrect username or password!');
        }
    }
}