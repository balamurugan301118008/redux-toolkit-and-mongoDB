import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Modal, DatePicker, notification } from "antd";

export default function AdminHome() {
  const token = useSelector((state) => state.userData.initialState.token)
  const [name, setAdminName] = useState('')
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5051/adminHome', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.Status === "Success") {
          setAdminName(res.data.name)
        }
        else {
          localStorage.removeItem("userData")
          navigate('/adminOrManagerLogin')
          notification.error({ description: res.data.Error })
        }
      })
  }, [])

  // Below the function for logout the user
  const handleDeleteAccount = () => {
    localStorage.removeItem('userData')
    navigate('/adminOrManagerLogin')
    notification.error({ description: "you're successfully log-outted" })
  }
  return (
    <React.Fragment>
      <div>
        <center><h1 style={{ color: 'ThreeDDarkShadow' }}>Admin Home page</h1></center>
        <div className='d-flex justify-content-around'>
          <h3>Welcome to our site <span style={{ color: 'blue' }}>{name}</span></h3>
          <button className='btn btn-outline-danger' onClick={handleDeleteAccount}>Logout</button>
        </div>
        <div className='d-flex justify-content-center gap-5 p-3'>
          <Link to='/adminHome/managerList'><button className='btn btn-primary'>Manager List</button></Link>
          <Link to='/adminHome/usersList'><button className='btn btn-primary'>Users List</button></Link>
        </div>
      </div>
    </React.Fragment>
  )
}
