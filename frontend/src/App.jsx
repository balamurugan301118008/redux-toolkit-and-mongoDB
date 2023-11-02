import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Actions from './components/Users/Actions'
import UserLogin from './components/Users/UserLogin'
import UserRegister from './components/Users/UserRegister'
import UserHome from './components/Users/UserHome'
import AdminAndManagerRegister from './components/AdminAndManger/AdminAndManagerRegister'
import AdminAndMangerLogin from './components/AdminAndManger/AdminAndMangerLogin'
import AdminHome from './components/AdminAndManger/AdminHome'
import ManagerHome from './components/AdminAndManger/ManagerHome'
import ManagerList from './components/AdminAndManger/ManagerList'
import UsersList from './components/AdminAndManger/UsersList'

import ViewTasks from './components/AdminAndManger/ViewTasks'

import ViewTasksByAdmin from './components/AdminAndManger/ViewTasksByAdmin'
import UserListByManger from './components/AdminAndManger/UserListByManger'
import EditTask from './components/Users/EditTask'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Actions />}></Route>
        <Route path='/userHome' element={<UserHome />}></Route>
        <Route path='/userRegister' element={<UserRegister />}></Route>
        <Route path='/userLogin' element={<UserLogin />}></Route>
        <Route path='/userHome/editTask/:id' element={<EditTask />}></Route>
        <Route path='/userHome/:id' element={<UserHome />}></Route>

        <Route path='/adminOrManagerRegister' element={<AdminAndManagerRegister />}></Route>
        <Route path='/adminOrManagerLogin' element={<AdminAndMangerLogin />}></Route>
        <Route path='/adminHome' element={<AdminHome />}></Route>
        <Route path='/managerHome' element={<ManagerHome />}></Route>

        <Route path='/adminHome/managerList' element={<ManagerList />}></Route>
        <Route path='/adminHome/usersList' element={<UsersList />}></Route>
        <Route path='/managerHome/viewTasks/:id' element={<ViewTasks />}></Route>
        <Route path='/adminHome/usersList/viewTasks/:user_id' element={<ViewTasksByAdmin />}></Route>
        {/* <Route path='/adminHome/usersList/viewTasks/' element={<ViewTasksByAdmin />}></Route> */}
        <Route path='/adminHome/managerList/userList/:id' element={< UserListByManger />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
