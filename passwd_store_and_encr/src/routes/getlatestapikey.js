const { getLatestApiKeyBeforeExpiry, isApiKeyValid } = require('../apikey/apikey');

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

    const latestKey = getLatestApiKeyBeforeExpiry();

    if (latestKey.length === 0) {
        return res.status(400).json({ error: 'Latest api key must be requested at most 6 hours from current api key expiration!' });
    }

    res.status(200).json({ latestApiKey: latestKey });
});

module.exports = router;
