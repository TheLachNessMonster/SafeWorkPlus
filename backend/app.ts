// app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DATABASE_URL || 'your-default-mongo-uri');
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log('Connected to DB'));
  }

import workplaceRouter from './routes/workplaceRouter';
import userRouter from './routes/userRouter';
import incidentRouter from './routes/incidentRouter';

app.use(express.json());
app.use('/workplaces', workplaceRouter);
app.use('/users', userRouter);
app.use('/incidents', incidentRouter);

export default app;