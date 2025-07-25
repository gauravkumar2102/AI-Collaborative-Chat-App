import project from "../models/project.models.js";

export const CreateProject = async ({ name, userid }) => {
    if (!name) throw new Error("Name is Required");
    if (!userid) throw new Error("User is Required");
    let pj;
    try {
        pj = await project.create({
            name,
            users: [userid]
        });
    } catch (error) {
        if (error.code == 11000)
            throw new Error("project name is Already Exist");
        throw error; // rethrow other errors
    }
    return pj;
}

export const GetAllProject = async ({ userid }) => {
    if (!userid) throw new Error("User is Required");
    const projects = await project.find({ users: { $in: [userid] } });
    return projects;
}

export const AddUserToProject = async ({ projectId, users, userid }) => {
    if (!projectId) throw new Error("Project ID is Required");
    if (!users || users.length === 0) throw new Error("Users are Required");
    if (!userid) throw new Error("User is Required");

    console.log("Adding users to project:", { projectId, users, userid });
    const projectData = await project.findById(projectId);
    if (!projectData) throw new Error("Project not found");

    // Check if the user is part of the project
    if (!projectData.users.includes(userid)) throw new Error("User is not part of the project");

    // Add users to the project
    projectData.users.push(...users);
    await projectData.save();

    return projectData;
}

export const GetProjectById = async ({projectid}) => {
    if (!projectid) throw new Error("Project ID is Required");
    const projectData = await project.findById(projectid).populate("users");
    if (!projectData) throw new Error("Project not found");
    return projectData;
}