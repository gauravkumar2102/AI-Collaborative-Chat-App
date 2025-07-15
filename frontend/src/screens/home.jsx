import React, {useContext} from "react";
import {UserContext} from "../context/user.context.jsx"

const Home=()=>{
     
  const user=useContext(UserContext);

    return (
       <div className="min-h-screen flex items-center justify-center px-4 ">
          <div className="text-gray-700">
              <h1 className="text-6xl font-bold text-center mt-10">Welcome to the <span className="talk">TalkWise</span></h1>
            <p className="text-center mt-4 text-xl ">A smart <span className="talk">chat app</span> powered by AI — ask questions, <span className="talk">write code</span>, and run it instantly!</p>
            <div className="justify-center items-center flex flex-col ">

              <a href="/project" className="rounded-md px-4 py-2 mt-4 project-button">Create Project< i className="ri-link ico"></i></a>
              <p className="contact-details">Have a question? Contact us — we're here to help!</p>
              <div className="flex justify-center items-center mt-4">
                <a href="http://linkedin.com"><i className="ri-linkedin-box-fill social"></i></a>

                <a href="http://instagram.com"><i className="ri-instagram-fill social"></i></a>

                <a href="http://mail.com"><i className="ri-mail-fill social"></i></a>
              </div>
              
            </div>

          </div>
            
       </div>
    )
}

export default Home;
