require('dotenv').config();
require('./database/database');

const express = require('express');
const rateLimiter = require('express-rate-limit');

const { setupStartApiKey } = require('./apikey/apikey');
setupStartApiKey(process.env.START_API_KEY);

const app = express();
const port = 8080;

app.use(express.json());

const rateLimit = rateLimiter({
    windowMs: 60 * 1000 * 1,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(rateLimit);

const helloRouter = require('./routes/hello');
app.use('/hello', helloRouter);

const createRouter = require('./routes/create');
app.use('/create', createRouter);

const readRouter = require('./routes/read');
app.use('/read', readRouter);

const updateRouter = require('./routes/update');
app.use('/update', updateRouter);

const deleteRouter = require('./routes/delete');
app.use('/delete', deleteRouter);

const getLatestApiKeyRouter = require('./routes/getlatestapikey');
app.use('/getlatestapikey', getLatestApiKeyRouter);

const getApiKeyExpRouter = require('./routes/getapikeyexp');
app.use('/getapikeyexp', getApiKeyExpRouter);

app.listen(port, () => {
    console.log(`User website login manager has started on port ${port} successfully..`);
});
