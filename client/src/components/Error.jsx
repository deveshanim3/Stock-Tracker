import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800 text-gray-400">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">
        404
      </h1>
      
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>

      <div className="mt-5 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">
          Oops! You seem to be lost.
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-100 transition-colors font-medium"
          >
           Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-900 transition-colors font-medium shadow-lg hover:shadow-xl cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;