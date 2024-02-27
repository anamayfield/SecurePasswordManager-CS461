const mysql = require('mysql2');

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const initialTableQuery = `
    CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parentAccountId INT NOT NULL,
        websiteUrl VARCHAR(255),
        emailOrUsername VARCHAR(255),
        password VARCHAR(255),
        notes TEXT
    );
`;

connectionPool.query(initialTableQuery, (error, _results, _fields) => {
    if (error) {
        console.error(`Failed to create table with error: ${error}`);
        return;
    }

    console.log('Created accounts table successfully..');
});

module.exports = connectionPool;
