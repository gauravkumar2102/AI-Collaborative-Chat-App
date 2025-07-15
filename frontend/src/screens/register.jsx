import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import axios from '../config/axios';

const Register= () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("hii i am triger");
    
     axios.post('/user/register',{
        email,
        password
     }).then((res)=>{
         console.log(res.data);
         navigate("/");
     }).catch((e)=>{
           console.log(e);
     })
  };

  return (
    <>
    { <Navbar />  }
    <div className="min-h-screen flex items-center justify-center px-4 login-o">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg text-white login">
        <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 labelName">Email</label>
            <input
              type="email"
              placeholder='Enter your Email'
              className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 labelName">Password</label>
            <input
              type="password"
              placeholder='Enter password'
              className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none in"
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
            sign Up
          </button>
          </div>
        </form>
        <p className="text-sm text-center mt-4 text-gray-900">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;
