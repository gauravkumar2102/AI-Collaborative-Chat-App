import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
import { UserContext } from "../context/user.context.jsx";
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';


 
const Navbar = () => {
const [isOpen, setIsOpen] = useState(false);
const { user: loginUser ,setUser} = useContext(UserContext);
console.log("User:", loginUser);
const navigate=useNavigate();
  return (
    <nav className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        <div className="flex items-center space-x-2">
            {/* <img src={logo} alt="Logo" className="h-10 w-10 object-contain img-logo" /> */}
            <span className="text-4xl font-semibold logo">TalkWise</span>
        </div>

        <div className="hidden md:flex space-x-6 nav-item nav-tit">
            <Link to="/project" className="hover:text-blue-400">Home</Link>
            <Link to="/contact" className="hover:text-blue-400">Contact</Link>
            {loginUser && (
              <>
                <button  className="hover:text-blue-400 cursor-pointer" onClick={async () => {
                  try {
                    await axios.post("/user/logout", {}, {
                     headers: {
                         Authorization: `Bearer ${localStorage.getItem("token")}`
           },
                withCredentials: true
    });
                 localStorage.removeItem("token");
                 localStorage.removeItem("user");
                 setUser(null);
                navigate("/");

  } catch (err) {
    console.error("Logout error:", err);
  }
                }}>Logout</button>
              </>
            )}

            {!loginUser && (
              <>
                <Link to="/login" className="hover:text-blue-400">Login</Link>
                <Link to="/register" className="hover:text-blue-400">Sign Up</Link>
              </>
            )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/project" className="block hover:text-blue-400">Home</Link>
          <Link to="/contact" className="block hover:text-blue-400">Contact</Link>
          <Link to="/login" className="block hover:text-blue-400">Login</Link>
          <Link to="/register" className="block hover:text-blue-400">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
