'use strict';

let jsonFromServer = {};
let BASE_SERVER_URL;

const backend = {
    setItem: function(key, item) {
        jsonFromServer[key] = item;
        return saveJSONToServer();
    },
    getItem: function(key) {
        if (!jsonFromServer[key]) {
            return null;
        }
        return jsonFromServer[key];
    },
    deleteItem: function(key) {
        delete jsonFromServer[key];
        return saveJSONToServer();
    }
};


// Load the function downloadFromServer() when loading a window
window.onload = async function() {
    downloadFromServer();
}


/**
 * Download the saved String from Server and parse it
 */
async function downloadFromServer() {
    let result = await loadJSONFromServer();
    jsonFromServer = JSON.parse(result);
    // console.log('Loaded', result);
}


/**
 * Sets the url from the server
 * @param {string} url 
 */
function setURL(url) {
    BASE_SERVER_URL = url;
}


/**
 * Loads a JSON or JSON Array to the Server
 * payload {JSON | Array} - The payload you want to store
 */
async function loadJSONFromServer() {
    let response = await fetch(BASE_SERVER_URL + '/nocors.php?json=database&noache=' + (new Date().getTime()));
    return await response.text();

}


/**
 * Saves a JSON or JSON Array to the Server
 */
function saveJSONToServer() {
    return new Promise(function(resolve, reject) {
        let xhttp = new XMLHttpRequest();
        let proxy = determineProxySettings();
        let serverURL = proxy + BASE_SERVER_URL + '/save_json.php';
        xhttp.open('POST', serverURL);

        xhttp.onreadystatechange = function(oEvent) {
            if (xhttp.readyState === 4) {
                if (xhttp.status >= 200 && xhttp.status <= 399) {
                    resolve(xhttp.responseText);
                } else {
                    reject(xhttp.statusText);
                }
            }
        };

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(jsonFromServer));

    });
}


/**
 * Determine the Proxy Settings
 * @returns Returns an URL under certain conditions
 */
function determineProxySettings() {
    return '';
}