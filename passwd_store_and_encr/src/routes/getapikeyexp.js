const { getExpireTime, isApiKeyValid } = require('../apikey/apikey');

const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key must be provided!' });
    }

    if (!isApiKeyValid(apiKey)) {
        return res.status(400).json({ error: 'API Key is invalid!' });
    }

    res.status(200).json({ expireTime: getExpireTime(), timeLeftMs: getExpireTime() - Date.now() });
});

module.exports = router;
