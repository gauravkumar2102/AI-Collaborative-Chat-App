import { Router } from "express";
import {body} from "express-validator";
import * as UserController  from "../controllers/user.controllers.js";
import * as Middleware from "../middleware/auth.middleware.js";


const router = Router();

router.post("/register",
     body('email').isEmail().withMessage('Invalid email format'),
     body('password').isLength({ min: 3}).withMessage('Password must be at least 6 characters long'),
     UserController.createUserController
)

router.post("/login",
     body('email').isEmail().withMessage('Invalid email format'),
     body('password').isLength({ min: 3}).withMessage('Password must be at least 6 characters long'),
     UserController.loginUserController
)

 router.get("/profile",Middleware.authMiddleware,UserController.UserProfileController);
 
router.post("/logout", UserController.logoutUserController);

router.get("/all", Middleware.authMiddleware, UserController.getAllusersController);


export default router;