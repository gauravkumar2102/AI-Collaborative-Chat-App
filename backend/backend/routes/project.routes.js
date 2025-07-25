
import { Router } from "express";
import {body} from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authuser from "../middleware/auth.middleware.js"
const router=Router();

router.post("/create",authuser.authMiddleware,
    body("name").isString().withMessage("Name are Required"),
    projectController.CreateProjectController
)

router.get("/all",authuser.authMiddleware,projectController.GetAllProjectController);

router.put("/adduser",authuser.authMiddleware,
    body("projectid").isString().withMessage("Project ID is Required"),
    body("users")
        .isArray({ min: 1 }).withMessage("Users must be a non-empty array")
        .custom((arr) => arr.every(u => typeof u === "string")).withMessage("Each user must be a string"),
    projectController.AddUserToProjectController
);

router.get("/getProject/:projectId", authuser.authMiddleware,projectController.GetProjectByIdController);

export default router;

