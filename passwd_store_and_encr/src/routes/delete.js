const express = require('express');
const router = express.Router();

const connectionPool = require('../database/database');

router.post('/', (req, res) => {
    const { idToDelete, apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key must be provided!' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(400).json({ error: 'API Key must is invalid!' });
    }

    if (!idToDelete) {
        return res.status(400).json({ error: 'idToDelete field must be provided!' });
    }

    if (isNaN(idToDelete)) {
        return res.status(400).json({ error: 'idToDelete must be a number!' });
    }

    const deleteQuery = `DELETE FROM accounts WHERE id = ?;`;

    connectionPool.query(deleteQuery, [idToDelete], (error, results) => {
        if (error) {
            console.error(`Account deletion failed: ${error}`);
            return res.status(500).json({ error: 'An unknown error has occurred!' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found!' });
        }

        res.status(200).json({ message: 'Account deleted successfully', deletedId: idToDelete });
    });
});

module.exports = router;
