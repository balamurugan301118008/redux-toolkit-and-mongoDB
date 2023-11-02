import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, DatePicker, notification } from "antd";

export default function ManagerHome() {
  const token = useSelector((state) => state.userData.initialState.token)
  const [name, setName] = useState('')
  const navigate = useNavigate();
  const [managerId, setId] = useState('')
  const [userList, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('')


  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:5051/managerHome", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.Status === "Success") {
          setName(res.data.name)
          setId(res.data.id)
          setUsers(res.data.data)
          navigate('/managerHome')
        }
        else {
          alert(res.data.Error)
          navigate('/adminOrManagerLogin')
        }
      })

  }, [])

  const handleDeleteAccount = () => {
    notification.error({ description: " you're successfully log-outted" })
    localStorage.removeItem('userData')
    navigate('/adminOrManagerLogin')
  }
  const filteredList = userList.filter((item) => {
    return item.user_name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <React.Fragment>
      <div>
        <center><h1 style={{ color: 'ThreeDDarkShadow' }}>Manager Home page</h1></center>
      </div>
      <div className='d-flex justify-content-around p-3'>
        <h3>Welcome to our site <span style={{ color: 'blue' }}>{name}</span></h3>
        <button className='btn btn-outline-danger' onClick={handleDeleteAccount}>Logout</button>
      </div>
      <div>
        <input style={{ margin: '10px 70px' }} type="text" onChange={(e) => setSearchText(e.target.value)}
          className="form-control w-25" id="exampleInputEmail1" placeholder="search users" />
      </div>
      <div>
        <table className="table container-sm border border-5">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">View Tasks</th>
            </tr>
          </thead>
          <tbody >
            {
              filteredList.length > 0 ?
                filteredList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{item.id}</th>
                      <td>{item.user_name}</td>
                      <td>{item.email}</td>
                      <td><Link to={`/managerHome/viewTasks/${item.id}`}><button className='btn btn-outline-success btn-sm' id={item.id} data-set={managerId}>View Task</button></Link></td>
                    </tr>
                  )
                }) : (  
                  <tr>
                    <td className='text-danger'>{searchText} not found</td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}
