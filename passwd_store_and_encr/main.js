// config
require('dotenv').config();

// manage mysql related stuff
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
    if (!err) {
        console.log('MySQL database connection successful...');

        console.log('Creating accounts table if it does not exist..');

        const accountsTableQuery = `
            CREATE TABLE IF NOT EXISTS accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                websiteUrl VARCHAR(255),
                emailOrUsername VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                notes TEXT
            );
        `;

        db.query(accountsTableQuery, (err, _results) => {
            if (!err) {
                console.log('Accounts table query successful..');
            } else {
                throw err;
            }
        });
    } else {
        throw err;
    }
});

// manage express related stuff
const express = require('express');
const app = express();

app.use(express.json());

const createAccountRoute = require('./routes/createaccount')(db);
app.use('/', createAccountRoute);

const deleteAccountRoute = require('./routes/deleteaccount')(db);
app.use('/', deleteAccountRoute);


// start the server
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
