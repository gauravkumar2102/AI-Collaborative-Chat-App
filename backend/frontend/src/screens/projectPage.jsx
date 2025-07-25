import  React from "react";
import { useContext, useState,useEffect } from "react";
import { UserContext } from "../context/user.context.jsx";
import Navbar from "./navbar";
import axios from '../config/axios';
import { useNavigate } from "react-router-dom";
import OpenProject from "./project.jsx";




const ProjectPage = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState("");
const [project, setProject] = useState([]);
const navigate = useNavigate();

    function createProject(e) {
        e.preventDefault();
        console.log("Creating project:", projectName);
        axios.post("/project/create", {
            name: projectName,
        })
        .then((response) => {
            console.log("Project created:", response.data);
            setProject([...project, response.data]);
            setShowModal(false);

        })
        .catch((error) => {
            console.error("Error creating project:", error);
        });
    }
      
     useEffect(() => {
        axios.get("/project/all").then((res) => {
            setProject(res.data);
            // console.log("Projects fetched:", res.data.projects);

        }).catch(err => {
            console.log(err)
        })

    }, [])

   

  return (
    <div>
      <Navbar />
      <div className="w-full flex justify-center ">
        <h2 className="head">
          <span className="head-sp">Build it</span>.Show it.
          <span className="head-sp">Share it</span> with your squad!
        </h2>
      </div>
      <div className="w-full flex justify-space-between  px-4 box ">
        <div className="btn-pj">
          <button
            onClick={() => setShowModal(true)}

            className="rounded-md px-4 py-2 mt-4 project-button "
          >
            Create Project<i className="ri-link ico"></i>
          </button>
        </div>

        <div className="right flex flex-row flex-wrap ">
          {/* All project */}
         { project.map((pro) => (
                   <div key={pro._id}
                       onClick={() => {
                                navigate(`/OpenProject`, {
                                    state: { project: pro }
                                })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200 bo">
                            <h2
                                className='font-semibold'
                            >{pro.name}</h2>

                            <div className="flex gap-2">
                                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                                {pro.users.length}
                            </div>

                        </div>
                    ))
                
                  }

                
         
          {/* ______ */}
        </div>
      </div>
        {/* Modal */}
        {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[0.6px]">
    <div className="bg-white  rounded-xl shadow-lg w-1/4 min-h-[200px] flex flex-col justify-between pro-box">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 p-8">Create New Project</h2>
      
      <form onSubmit={createProject} className="flex flex-col flex-grow justify-between">
        <div className="mb-6">
          
          <input
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 in in-project"
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-auto">
          <button
            type="button"
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:cursor-pointer transition duration-200 pro-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer hover:bg-blue-700 transition duration-200 pro-btn"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Render projects here */}
    </div>
  );
};

export default ProjectPage;
