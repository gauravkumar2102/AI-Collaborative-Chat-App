
import express from 'express';      
import morgan from 'morgan';
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from "./routes/project.routes.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'
import aiRoutes from './routes/ai.routes.js';   

connectDB();
const app=express()

app.use(morgan('dev'));

app.use(cors({ 
  origin: 'https://ai-collaborative-chat-app-1.onrender.com',
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
 app.use(express.json());
 app.use(express.urlencoded({ extended: true })); 
 app.use(cookieParser());
 
 app.use("/user", userRoutes);
 app.use("/project",projectRoutes);
 app.use("/ai", aiRoutes);
 app.get('/', (req, res) => {
     res.send("Hello World!");
 }
);


export default app;
