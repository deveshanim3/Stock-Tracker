import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Stock from './Stock'

const Dashboard = () => {
  const navigate=useNavigate()
  const name=localStorage.getItem('email').split('@')[0]
   const handleLogout = async () => {
    try {
      await axios.post(
        '/auth/logout',
        {},
        { withCredentials: true } 
      );  
      localStorage.removeItem('accessToken')
      localStorage.removeItem('email')
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  return (
     <div className="h-screen w-screen overflow-auto flex flex-col bg-slate-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      
      <div className="flex justify-end items-center shrink-0">
        <button
          onClick={handleLogout}
          className="cursor-pointer p-2.5 m-2 rounded-2xl bg-blue-600 transition transform 200 linear hover:bg-blue-700 text-slate-50 hover:scale-110"
        >
        Logout
        </button>
      </div>

      
        <Stock />


    </div>

  )
}

export default Dashboard