import 'dotenv/config.js';
import { Server } from "socket.io";
import express from 'express';     
import http from 'http';
import app from './app.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectmodel from './models/project.models.js';
import * as AiService from './service/ai.service.js';
import fs from 'fs';
 
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  console.log("Headers set for", req.url);
  next();
});


const server=http.createServer(app);
const io = new Server(server,
  {
    cors:{
      origin: "*", // Allow all origins (you can specify a specific origin if needed)
    }
  }
);
// MiddleWare


io.use(async(socket, next) => {
  try { 
      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
      const projectid = socket.handshake.query.projectid;
      
      // check valid projectid
      if (!mongoose.Types.ObjectId.isValid(projectid)) {
          throw new Error('Invalid project ID');
      }

      socket.project=await projectmodel.findById(projectid);

      if (!token) throw new Error('unAuthorized user');
      const decoded=jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) throw new Error('Invalid token');
      socket.user = decoded; // Attach user info to socket
      next();
  } catch (error) {
     next(error);
  }
});


 io.on('connection',socket=>{

    socket.roomid=socket.project._id.toString();
    
    console.log("A user Connected");
    socket.join(socket.roomid);
    socket.on('project-message', async data => {
        console.log("Send:", data,);

         socket.broadcast.to(socket.roomid).emit('project-message',data);

        const IsAiPresent = data.message.toLowerCase().includes('@ai');
        if (IsAiPresent) {  
           const prompt = data.message.replace('@ai', '').trim();
           const result = await AiService.generateResult(prompt);
           console.log("AI Result:", result);
           io.to(socket.roomid).emit('project-message', {
               message:result, 
                    isAi: true,
                    sender: {
                    email: 'AI Assistant',
                    _id: 'ai'
                },
               }, 
              );   
              return;  
        }

    })
 
   
    socket.on('event',data=>{/*....*/});
    socket.on('disconnect',()=>{
       console.log("A user Disconnected");
       socket.leave(socket.roomid);
    });

})  

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});    
 
