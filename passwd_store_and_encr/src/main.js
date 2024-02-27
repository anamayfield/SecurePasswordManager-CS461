require('dotenv').config();
require('./database/database');

const express = require('express');

const app = express();
const port = 8080;

app.use(express.json());

const createRouter = require('./routes/create');
app.use('/create', createRouter);

const readRouter = require('./routes/read');
app.use('/read', readRouter);

const updateRouter = require('./routes/update');
app.use('/update', updateRouter);

const deleteRouter = require('./routes/delete');
app.use('/delete', deleteRouter);

app.listen(port, () => {
    console.log(`User website login manager has started on port ${port} successfully..`);
});
