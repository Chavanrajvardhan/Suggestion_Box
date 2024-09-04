import  {StrictMode } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements,Navigate } from 'react-router-dom'
import Home from './components/Home.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import AddPost from './components/AddPost.jsx'
import AllUserPosts from './components/AllUserPosts.jsx'


// we route here all components using react-router-dom 
const router = createBrowserRouter(

  createRoutesFromElements(
    <Route>
     <Route path='/' element = {<Login/>} >
     
      </Route>
     <Route path='/signup' element = {<Signup/>} />
       <Route path='/home' element = {<Home/>} />  
       <Route path='/AddPost' element = {<AddPost/>} />
       <Route path='/AllUserPosts' element ={<AllUserPosts />} />
    </Route>
  )
)






ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
)