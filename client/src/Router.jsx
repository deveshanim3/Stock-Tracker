import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Error from './components/Error'
import {createBrowserRouter} from 'react-router-dom'
import App from './App'
const Router= createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {index:true,element:<Login/>},
      {path:'/signup',element:<Signup/>},
      {}
    ]
  },
  {
    path:'/dashboard',
    element:<Dashboard/>
  }
  ,
  {
    path:'*',
    element:<Error/>
  }
])
export default Router;