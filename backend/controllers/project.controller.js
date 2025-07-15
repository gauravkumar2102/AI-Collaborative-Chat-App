import * as projectService from "../service/project.service.js";
import {validationResult} from "express-validator";

export const CreateProjectController=async (req,res)=>{
     const error=validationResult(req);
     if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
     }

    try {
        const name=req.body.name;
        const userid=req.user.id;
        console.log(req.user.id);
        const newproject=await projectService.CreateProject({name,userid});
        res.status(200).json(newproject);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

export const GetAllProjectController=async (req,res)=>{
    try {
        const userid=req.user.id;
        const projects=await projectService.GetAllProject({userid});
        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }

}

export const AddUserToProjectController=async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }

    try {
        const projectId=req.body.projectid;
        const users=req.body.users;
        const userid=req.user.id;

        const updatedProject=await projectService.AddUserToProject({projectId,users,userid});
        res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

export const GetProjectByIdController=async (req,res)=>{
    const Id=req.params.projectId;
    if(!Id) return res.status(400).send("Project ID is Required");

    try {
        const project=await projectService.GetProjectById({projectid:Id});
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}