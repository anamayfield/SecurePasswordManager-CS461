const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());

let users = [];
let currentLoginId = 1;

app.post('/create-login', (req, res) => {
    const { username, password, notes } = req.body;

    if (!username || !password || !notes) {
        return res.status(400).send('Invalid body');
    }

    users.push({ loginId: currentLoginId, username: username, password: password, notes: notes });
    currentLoginId += 1;
    res.status(201).send('User creation successful');
});

app.post('/read-logins', (_req, res) => {
    res.json(users);
});

app.post('/update-login', (req, res) => {
    const { loginId, username, password, notes } = req.body;

    if (!loginId || !username || !password || !notes) {
        return res.status(400).send('Invalid body');
    }

    const usr = users.findIndex(user => (user.loginId === loginId));

    if (usr === -1) {
        return res.status(404).send('User not found');
    }

    users[usr] = { loginId: loginId, username: username, password: password, notes: notes };
    res.status(201).send('User update successful');
});

app.post('/delete-login', (req, res) => {
      const { loginId } = req.body;

      if (!loginId) {
        return res.status(400).send('Invalid body');
      }

      const usr = users.findIndex(user => user.loginId === loginId);

      if (usr === -1) {
          return res.status(404).send('User not found');
      }

      users.splice(usr, 1);
      res.status(200).send('User deletion successful');
});

app.listen(port, () => {
    console.log(`Password Storage and Encryption running on http://localhost:${port}...`);
});
