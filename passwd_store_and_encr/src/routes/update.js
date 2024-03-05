const express = require('express');
const router = express.Router();

const connectionPool = require('../database/database');

router.post('/', (req, res) => {
    const { idToUpdate, parentAccountId, websiteUrl, emailOrUsername, password, notes, apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key must be provided!' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(400).json({ error: 'API Key must is invalid!' });
    }

    if (!idToUpdate) {
        return res.status(400).json({ error: 'idToUpdate field must be provided!' });
    }

    if (isNaN(idToUpdate)) {
        return res.status(400).json({ error: 'idToUpdate must be a number!' });
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

    const updateQuery = `UPDATE accounts SET parentAccountId = ?, websiteUrl = ?, emailOrUsername = ?, password = ?, notes = ? WHERE id = ?;`;

    connectionPool.query(updateQuery, [parentAccountId, websiteUrl, emailOrUsername, password, notes, idToUpdate], (error, results) => {
        if (error) {
            console.error(`Account update failed: ${error}`);
            return res.status(500).json({ error: 'An unknown error has occurred!' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found!' });
        }

        res.status(200).json({ message: 'Account updated successfully', updatedId: idToUpdate });
    });
});

module.exports = router;
