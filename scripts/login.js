'use strict';

// ####################################### MAIN FUNCTIONS #######################################

/**
 * Initialize the login page
 * Only the data has to be fetched from the server
 */
async function initLogin() {
    await downloadFromServer();
    await loadFromBackend();
}

/**
 * Encryption function of username and password
 * Source: https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
 * @param {string} salt // Text which is added to the text to be encrypted
 * @param {string} text // Text to encrypt
 * @returns // Returns the encrypted text
 */
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

/**
 * Decryption function of username and password
 * Source: https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
 * @param {string} salt // Text which is added to the text to be decrypted
 * @param {string} text // Text to decrypt
 * @returns // Returns the decrypted text
 */
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

/**
 * Gets the user input, encrypts the user data and creates an object from it
 * Either an existing user is logged in or a new user is created
 */
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

/**
 * Creates a user account if it doesn't already exist
 * @param {Object} user // The encrypted user data 
 */
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

/**
 * Logs in the existing user if correct credentials have been entered
 * @param {Object} user // The encrypted user data 
 */
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

/**
 * Shows the user a message that the login was successful
 */
function loginSuccessful() {
    let loginContainer = document.getElementById('login-form');
    console.log('Login successful!');
    document.getElementById('login-messages').classList.remove('d-none');
    loginContainer.innerHTML = loginSuccessfulMessage();
}

/**
 * Iterate through all users
 * The if query checks whether the username exists and only the password was entered incorrectly
 * An error message is displayed in the else statement because the user name does not exist
 * @param {Object} user // The encrypted user data 
 */
function loginNotSuccessful(user) {
    let messagesContainer = document.getElementById('login-messages');
    messagesContainer.innerHTML = '';

    for (let i = 0; i < users.length; i++) {
        // Username exists - Password was entered incorrectly
        if (user.username == users[i].username) {
            console.log('Incorrect password!');
            document.getElementById('login-messages').classList.remove('d-none');
            messagesContainer.innerHTML += loginErrorMessage('Incorrect password!');

            document.getElementById('password').value = '';

            break;
            // Username doesn't exist
        } else {
            console.log('This user does not exist!');
            document.getElementById('login-messages').classList.remove('d-none');
            messagesContainer.innerHTML += loginErrorMessage('This user does not exist!');

            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            break;
        }
    }
}

/**
 * HTML template for the successful login
 * @returns // Return the HTML snippet
 */
function loginSuccessfulMessage() {
    return `
        <div class="alert alert-success" role="alert">
            Login successful!
        </div>
        <button type="button" class="btn btn-primary" onclick="redirect()">Continue</button>
    `;
}

/**
 * HTML template for incorrect login
 * @param {string} string // An error message displayed to the user 
 * @returns // // Return the HTML snippet
 */
function loginErrorMessage(string) {
    return `
        <div id="invalid-login" class="alert alert-danger" role="alert">
            ${string}
        </div>
    `;
}

/**
 * Directs the user to the index.html of the project after a successful login
 */
function redirect() {
    window.location.href = './html/index.html';
}