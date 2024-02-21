const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.post('/deleteaccount', (req, res) => {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send('Error: Account id is required to perform your request');
        }

        db.query('DELETE FROM accounts WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error('Error: ', error);
                return res.status(500).send('Internal server error!');
            }

            if (results.affectedRows === 0) {
                return res.status(404).send({ message: `Account with the id:${id} not found` });
            }

            res.status(200).send({ message: 'Account deletion successful' });
        });
    });

    return router;
};

