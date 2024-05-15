const crypto = require('crypto');

let latestApiKeyToChangeTo = '';

let currentApiKey = '';
let startKeyAssigned = false;

let expireTime = -1;

const setupStartApiKey = (key) => {
    if (!startKeyAssigned) {
        currentApiKey = key;
        startKeyAssigned = true;
    }
};

const generateChangeToApiKey = () => {
    const keyLength = 32;
    latestApiKeyToChangeTo = crypto.randomBytes(keyLength).toString('hex').toLowerCase();
};

const isApiKeyValid = (key) => {
    if (expireTime == -1) {
        expireTime = Date.now() + (1000 * 60 * 60 * 24 * 14);
        generateChangeToApiKey();
    }

    if (Date.now() > expireTime) {
        currentApiKey = latestApiKeyToChangeTo;
        expireTime = Date.now() + (1000 * 60 * 60 * 24 * 14);
        generateChangeToApiKey();
    }

    return key === currentApiKey;
};

const getLatestApiKeyBeforeExpiry = () => {
    if (expireTime == -1) {
        expireTime = Date.now() + (1000 * 60 * 60 * 24 * 14);
        generateChangeToApiKey();
    }

    if (expireTime - Date.now() < (1000 * 60 * 60 * 6)) {
        return latestApiKeyToChangeTo;
    } else {
        return '';
    }
};

const getExpireTime = () => {
    if (expireTime == -1) {
        expireTime = Date.now() + (1000 * 60 * 60 * 24 * 14);
        generateChangeToApiKey();
    }


    return expireTime;
};

module.exports = { setupStartApiKey, isApiKeyValid, getLatestApiKeyBeforeExpiry, getExpireTime };
