import mongoose from "mongoose";
import * as userService from "../service/user.service.js";
// import { createUser } from "../service/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../service/redis.service.js";
// register user controller

export const createUserController = async (req, res) => {
  const error = validationResult(req);
    console.log(req.body);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const user = await userService.createUser(req.body.email, req.body.password);

    const token = await user.generateJWT();

    res.status(201).json({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// Login user controller

export const loginUserController = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const user = await userService.loginUser(req.body.email, req.body.password);

    const token = await user.generateJWT();
    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

// profile user controller
export const UserProfileController=async( req,res)=>{
    console.log(req.user);
    res.status(201).json({
        user:req.user
    });
}

// logout user controller
export const logoutUserController = async (req, res) => {
     
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ message: 'Unauthorized access' });
      }
       redisClient.set(token, "logout", "EX", 60 * 60 * 24);
       res.status(200).json({ message: 'User logged out successfully' });
}

export const getAllusersController = async (req, res) =>{
    try {
        const users = await userService.getAllUsers({userid:req.user.id});
        res.status(200).json(users);
    } catch (error) {
        return res.status(400).send(error.message);
    }
}