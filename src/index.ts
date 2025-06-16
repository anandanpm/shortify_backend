import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './Config/db';


import userRoutes from './Routes/userRoute';
import urlRoutes from './Routes/urlRoute';
import cookieParser from 'cookie-parser';
import { UrlController } from './Controller/urlController';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();


app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());



app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});


app.use('/api/user', userRoutes);
app.use('/api/url', urlRoutes);
app.get("/:shortCode", UrlController.redirectToOriginal)




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
