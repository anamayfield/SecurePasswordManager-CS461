const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
    res.send('Hello World! This API is working!');
});

module.exports = router;
