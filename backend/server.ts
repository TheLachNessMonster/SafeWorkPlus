//express start
import express from 'express'
import cors from 'cors'; // Add this import
const app = express();


// add CORS configuration -- added by ash
app.use(cors({
  origin: 'http://localhost:5173', // vite dev URL
  credentials: true
}));


//env config
import dotenv from 'dotenv';
dotenv.config();


//DB ORM config
import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL||"UNDEFINED");
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to DB'));


//express server init

import workplaceRouter from './routes/workplaceRouter';
import userRouter from './routes/userRouter';
import incidentRouter from './routes/incidentRouter';
import loginRouter from './routes/loginRouter';


app.use(express.json())

//configure routes
app.use('/workplaces', workplaceRouter)
app.use('/users', userRouter)
app.use('/incidents', incidentRouter)
app.use('/login', loginRouter)

//Serve api docs
import swaggerUI from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//Server listening
app.listen(3000, ()=>console.log("Server running"));