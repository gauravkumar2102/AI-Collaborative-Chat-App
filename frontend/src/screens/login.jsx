import React, { useState,useContext } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import Navbar from './navbar';
import axios from '../config/axios';
import {UserContext} from '../context/user.context.jsx' 

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   
   const {setUser}=useContext(UserContext);

   const navigate=useNavigate();
   
   const handleLogin = (e) => {
     e.preventDefault();
      axios.post("/user/login",{
         email,
         password
     }).then((res)=>{
          console.log(res.data);
           localStorage.setItem('token',res.data.token);
           localStorage.setItem('user', JSON.stringify(res.data.user));
           console.log("User data stored in localStorage:", res.data.user);
           setUser(res.data.user);
          navigate("/project");
     }).catch((e)=>{
            console.log(e);
     })
   };

  return (
    <>
      <Navbar />  
    <div className="min-h-screen  flex items-center justify-center px-4 login-o">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg text-white login">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 labelName">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 focus:outline-none in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 labelName">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2  focus:outline-none in"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-center items-center'>
             <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition btn"
          >
            Log in
          </button>
          </div>
         
        </form>
        <p className="text-sm text-center mt-4 text-white">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-900 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
