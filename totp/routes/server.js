import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
import cors from 'cors';


import express from 'express';
import sendEmailRouter from './sendEmail.js'; // Adjust the path as necessary



const app = express();

app.use(cors());

app.use(express.json());

// Mount the sendEmail router on /api/totp
app.use('/api/totp', sendEmailRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
