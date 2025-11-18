import React from 'react';

const Login = () => {
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
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200 placeholder-gray-500"
                placeholder="trader@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200 placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500" />
                <span className="ml-2 text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-green-400 hover:text-green-300 hover:underline">Forgot password?</a>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 duration-200"
            >
              Enter Market
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account? <a href="#" className="text-green-400 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;