import { Outlet } from 'react-router-dom'
import { useState,useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';
const App = () => {
;
  return (
    <div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
      >
      <source
        src="/204306-923909642_small.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
      </video>
      <Outlet/>     
    </div>
  )
}

export default App