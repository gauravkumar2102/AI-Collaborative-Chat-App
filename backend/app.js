
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
 app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Serve the built frontend (from Vite)
app.use(express.static(path.join(__dirname, 'client/dist')));

// React routing fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
 app.use("/user", userRoutes);
 app.use("/project",projectRoutes);
 app.use("/ai", aiRoutes);
 app.get('/', (req, res) => {
     res.send("Hello World!");
 }
);


export default app;
