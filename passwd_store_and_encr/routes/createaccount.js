const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.post('/createaccount', (req, res) => {
        const { userId, websiteUrl, emailOrUsername, password, notes } = req.body;

        if (!emailOrUsername || !password || userId === undefined) {
            return res.status(400).send('Error: emailOrUsername, password, and userId are required fields!');
        }

        const createAccountQuery = 'INSERT INTO accounts (userId, websiteUrl, emailOrUsername, password, notes) VALUES (?, ?, ?, ?, ?)';

        db.query(createAccountQuery, [userId, websiteUrl, emailOrUsername, password, notes], (error, _results) => {
            if (error) {
                console.error('Error: ', error);
                return res.status(500).send('Internal server error!');
            }

            res.status(201).send({ message: `Account created successfully!` });
        });
    });

    return router;
};
