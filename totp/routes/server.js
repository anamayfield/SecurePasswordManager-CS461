import cors from 'cors';
import express from 'express';
import sendEmailRouter from './sendEmail.js';
import verifyTOTPRouter from './verifyTOTP.js';

const app = express();

// Allow all CORS requests
app.use(cors());

app.use(express.json());
app.use('/api/totp', sendEmailRouter);
app.use('/api/verify-totp', verifyTOTPRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
