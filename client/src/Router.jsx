import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Error from './components/Error'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import {createBrowserRouter} from 'react-router-dom'
import App from './App'
const Router= createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {index:true,element:<PublicRoute><Login/></PublicRoute>},
      {path:'/signup',element:<PublicRoute><Signup/></PublicRoute>}, 
    ]
  },
  {
    path:'/dashboard',
    element:<ProtectedRoute><Dashboard/></ProtectedRoute>
  }
  ,
  {
    path:'*',
    element:<Error/>
  }
])
export default Router;