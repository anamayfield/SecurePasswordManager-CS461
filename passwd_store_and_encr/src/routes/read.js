const { isApiKeyValid } = require('../apikey/apikey');

const express = require('express');
const router = express.Router();

const connectionPool = require('../database/database');

router.post('/', (req, res) => {
    const { parentAccountId, apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key must be provided!' });
    }

    if (!isApiKeyValid(apiKey)) {
        return res.status(400).json({ error: 'API Key is invalid!' });
    }

    if (!parentAccountId) {
        return res.status(400).json({ error: 'parentAccountId must be provided!' });
    }

    if (isNaN(parentAccountId)) {
        return res.status(400).json({ error: 'parentAccountId must be a number!' });
    }

    const selectQuery = `SELECT * FROM accounts WHERE parentAccountId = ?;`;

    connectionPool.query(selectQuery, [parentAccountId], (error, results) => {
        if (error) {
            console.error(`Accounts retrieval failed: ${error}`);
            return res.status(500).json({ error: 'An unknown error has occurred!' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: `No accounts found for parentAccountId: ${parentAccountId}` });
        }

        res.status(200).json({ message: 'Accounts fetched successfully', accounts: results });
    });
});

module.exports = router;
