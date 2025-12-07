import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Stock from './Stock'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const navigate=useNavigate()

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
      toast.success("Logout successfully")
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  return (
     <div className="h-screen w-screen overflow-auto flex flex-col bg-slate-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative flex w-full items-center justify-center p-4">
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>S</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>T</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>O</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>C</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider mr-1.5 transition transform hover:scale-120 linear duration-200 cursor-default'>K</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>T</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>R</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>A</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>C</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>K</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>E</h1>
      <h1 className='text-white text-2xl font-bold tracking-wider transition transform hover:scale-130 linear duration-200 cursor-default'>R</h1>
  
        <button
          onClick={handleLogout}
          className="absolute right-4 cursor-pointer rounded-2xl bg-blue-600 p-2.5 text-slate-50 transition transform hover:scale-110 hover:bg-blue-700 linear duration-200"
        >
        Logout
        </button>
      </div>

      
        <Stock />


    </div>

  )
}

export default Dashboard