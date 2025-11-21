import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [message, setMessage] = useState('');
  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/register",
        {
          email,password,
        },{
          withCredentials:true
        }
      );
      const data=res.data
      setMessage("Signup successful!");
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("email",data.user.email)
      navigate('/dashboard')
      console.log("Success:", res.data);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Signup failed");
        console.log(error);
        
      } else {
        setMessage("Server error");
      }
    }
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-10" />

      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <div className="w-full max-w-md p-8 mx-4 bg-transparent backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-400 ">TradeFlow</h2>
            <p className="text-gray-400 text-sm mt-2">Access the global markets</p>
          </div>
          {/* Form */}
          <form className="space-y-6">
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
            
            <button
              type='submit'
              onClick={handleSubmit}
              className="w-full py-3 bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 duration-200"
            >
              Signup
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Already have an account? <span onClick={()=>navigate('/')}className="text-green-400 hover:underline cursor-pointer">Login</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup