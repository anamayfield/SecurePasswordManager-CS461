import { config } from 'dotenv';
import cors from 'cors';
import express, { json } from 'express';
import sendEmailRouter from './sendEmail.js';
import verifyTOTPRouter from './verifyTOTP.js';

config({ path: '../../../.env' });

const app = express();

app.use(cors());
app.use(json());

app.use('/api/totp', sendEmailRouter);
app.use('/api/verify-totp', verifyTOTPRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))