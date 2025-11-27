import React, { useState,useEffect } from 'react';
import {useNavigate,useOutletContext} from 'react-router-dom'
import axios from 'axios';
const Login = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()


 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;

      console.log('Login successful:', data);
      localStorage.setItem("email",data.user.email)
      localStorage.setItem("accessToken", data.accessToken);
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);

      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Server error. Please try again.');
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* 2. Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-10" />

      {/* 3. Login Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <div className="w-full max-w-md p-8 mx-4 bg-transparent backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-400 tracking-wider">TradeFlow</h2>
            <p className="text-gray-400 text-sm mt-2">Access the global markets</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                type="email"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200 placeholder-gray-500"
                placeholder="trader@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                type="password"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200 placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex
            flex-row-reverse items-center  text-sm">
              
              <span className="text-green-400 transition duration-200 hover:text-green-300  hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 duration-200"
            >
              Enter Market
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account? <span onClick={()=>navigate('/signup')} className="text-green-400  hover:underline cursor-pointer ">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;