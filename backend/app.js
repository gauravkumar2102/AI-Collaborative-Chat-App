
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
<<<<<<< HEAD
  origin: 'http://localhost:5173',
=======
  origin: 'https://ai-collaborative-chat-app.vercel.app',
>>>>>>> d3ee68670c11cf509c037cd71b60dd208716b25e
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
