const axios = require('axios');
const apiUrl = 'http://localhost:8000';

// Accessing the create-login endpoint
async function createLogin(message) {
    try {
        const response = await axios.post(`${apiUrl}/create-login`, { message });
        console.log('Response from create-login:', response.data);
    } catch (error) {
        console.error('Error calling create-login:', error.message);
    }
}

// Accessing the read-login endpoint
async function readLogins(message) {
    try {
        const response = await axios.post(`${apiUrl}/read-logins`, { message });
        console.log('Response from read-logins:', response.data);
    } catch (error) {
        console.error('Error calling read-logins:', error.message);
    }
}

// Accessing the update-login endpoint
async function updateLogin(message) {
    try {
        const response = await axios.post(`${apiUrl}/update-login`, { message });
        console.log('Response from update-login:', response.data);
    } catch (error) {
        console.error('Error calling update-login:', error.message);
    }
}

// Accessing the delete-login endpoint
async function deleteLogin(message) {
    try {
        const response = await axios.post(`${apiUrl}/delete-login`, { message });
        console.log('Response from delete-login:', response.data);
    } catch (error) {
        console.error('Error calling delete-login:', error.message);
    }
}

// Example run
createLogin("Authenticated key.")
readLogins("Authenticated key.")
updateLogin("Authenticated key.")
deleteLogin("Authenticated key.")