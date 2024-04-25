const { isApiKeyValid } = require('../apikey/apikey');

const express = require('express');
const router = express.Router();

const connectionPool = require('../database/database');

router.post('/', (req, res) => {
    const { parentAccountId, websiteUrl, emailOrUsername, password, notes, apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key must be provided!' });
    }

    if (!isApiKeyValid(apiKey)) {
        return res.status(400).json({ error: 'API Key is invalid!' });
    }

    if (!parentAccountId) {
        return res.status(400).json({ error: 'parentAccountId field must be provided!' });
    }

    if (isNaN(parentAccountId)) {
        return res.status(400).json({ error: 'parentAccountId must be a number!' });
    }

    if (!websiteUrl) {
        return res.status(400).json({ error: 'websiteUrl field must be provided!' });
    }

    if (!emailOrUsername) {
        return res.status(400).json({ error: 'emailOrUsername field must be provided!' });
    }

    if (!password) {
        return res.status(400).json({ error: 'password field must be provided!' });
    }

    if (!notes) {
        return res.status(400).json({ error: 'notes field must be provided!' });
    }

    const insertQuery = `INSERT INTO accounts (parentAccountId, websiteUrl, emailOrUsername, password, notes) VALUES (?, ?, ?, ?, ?);`;

    connectionPool.query(insertQuery, [parentAccountId, websiteUrl, emailOrUsername, password, notes], (error, results) => {
        if (error) {
            console.error(`Account creation failed: ${error}`);
            return res.status(500).json({ error: 'An unknown error has occurred!' });
        }

        res.status(201).json({ message: 'Account created successfully', insertId: results.insertId, parentAccountId: parentAccountId });
    });
});

module.exports = router;
