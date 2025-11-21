import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate=useNavigate()
  const name=localStorage.getItem('email').split('@')[0]
   const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:3000/auth/logout',
        {},
        { withCredentials: true } 
      );

      localStorage.removeItem('accessToken');
      localStorage.removeItem('email');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  return (
    <div className='flex items-center justify-between bg-linear-to-r from-blue-300 to-blue-800'>
      Dashboard
      <h2>Welcome {name}!</h2>
      <button onClick={handleLogout} className='cursor-pointer p-4 bg-blue-550' >Logout</button>

    </div>
  )
}

export default Dashboard