import { Outlet } from 'react-router-dom'
import { refreshAccessToken } from './services/authService';
import { useState,useEffect } from 'react';
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const data = await refreshAccessToken();
      if (data) setUser(data.user); 
      setLoading(false);
    };
    initializeAuth();
  }, []);

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
      {
        loading?
        <div>Loading</div>
        :
        <Outlet/>

      }
    </div>
  )
}

export default App