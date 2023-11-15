const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());

app.post('/create-login', (req, res) => {
    res.status(501).send('Not Implemented: Create Login');
});

app.post('/read-logins', (req, res) => {
    res.status(501).send('Not Implemented: Read Logins');
});

app.post('/update-login', (req, res) => {
    res.status(501).send('Not Implemented: Update Login');
});

app.post('/delete-login', (req, res) => {
    res.status(501).send('Not Implemented: Delete Login');
});

app.listen(port, () => {
    console.log(`Password Storage and Encryption running on http://localhost:${port}...`);
});
