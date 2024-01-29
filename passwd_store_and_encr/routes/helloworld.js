const express = require('express');
const router = express.Router();

router.post('/helloworld', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(404).send('You must provide a name to greet!');
    }

    if (typeof name !== 'string') {
        return res.status(400).send('You must provide a valid name!');
    }

    if (name.trim() === '') {
        return res.status(400).send('You must provide a non blank name!');
    }

    res.status(200).send(`Hello there ${name}!`);
});

module.exports = router;
