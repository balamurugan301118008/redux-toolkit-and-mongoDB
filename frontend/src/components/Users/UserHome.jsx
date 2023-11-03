import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, DatePicker, notification } from "antd";

import { useSelector } from 'react-redux';
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import { DatePicker } from 'antd';
import moment from 'moment'

export default function UserHome() {
  const [date, setDate] = useState(null)
  const token = useSelector((state) => state.userData.initialState.token)
  const [searchText, setSearchText] = useState('')
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadline, setDeadline] = useState({
    startDate: '',
    endDate: ''
  });
  // const [startDate, setStartDate] = useState({
  //   startedDate: ""
  // })
  // const [endDate, setEndDate] = useState({
  //   endedDate: ""
  // })
  // const currentDate = moment();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    status: '',
  });
  const [storeData, setStoreData] = useState([]);
  const [errors, setErrors] = useState({
    taskName: '',
    description: '',
    status: '',
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    delete errors[name]
  };

  const validate = () => {
    let newErrors = { ...errors };
    let isVaild = true;
    if (formData.taskName.trim() === "" && formData.description.trim() === "") {
      newErrors.taskName = 'Taskname is required';
      newErrors.description = 'Description is required';
      newErrors.status = 'Task status is required'
      isVaild = false;
    }
    setErrors(newErrors);
    return isVaild;
  }
  // const clearInputs = () => {
  //   const [formData, setFormData] = useState({
  //     taskName: '',
  //     description: '',
  //     status: '',
  //   });
  // }
  // Here are the handlesubmit function 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const timeDifference = new Date(deadline.endDate) - new Date(deadline.startDate)
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      const TaskData = { ...formData, deadline: { ...deadline, }, total_days: daysDifference };
      axios.post('http://localhost:4000/userHome', TaskData, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data.Status === "Success") {
            setFormData({
              taskName: '',
              description: '',
              status: '',
            })
            setDate(null)
            // setDeadline({
            //   startDate: null,
            //   endDate: null
            // })
            setDeadline('')
            // setDeadline({ startDate: '' })
            // setDeadline({ endDate: '' })
            notification.success({ description: 'Your Task Successfully added' })
          }
          else {
            alert(res.data.Error)
          }
        })
        .catch(err => console.log(err));
      setIsModalOpen(false);
    }
    else {
      console.log("not okay");
    }
  }

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/userHome', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.Status === "Success") {
          setName(res.data.data[0].name);
          setStoreData(res.data.tasks)
        } else {
          navigate('/userLogin');
          localStorage.removeItem("userData")
          notification.error({ description: res.data.Error })
        }
      })
      .catch(err => console.log(err));
  }, [storeData])

  const handleDeleteAccount = () => {
    localStorage.removeItem('userData')
    notification.error({ description: "you're successfully log-outted" })
    navigate('/userLogin')
  }

  const handleDeleteTask = (e) => {
    const { id } = e.target;
    axios.post(`http://localhost:4000/delete`, { deleteId: id })
      .then(res => {
        console.log(res.data.message)
        if (res.data.message === "task delete successfully") {
          notification.error({ description: 'your task deleted successfully' })
          navigate('/userHome')
        }
        else {
          // navigate('/userHome')
          notification.error({ description: res.data.Error })
        }
      })
  }
  const filteredList = storeData.filter((item) => {
    return item.taskName.toLowerCase().includes(searchText.toLowerCase());
  });

  // const handleStartDateChange = (date, dateString) => {
  //   setStartDate({ ...startDate, startedDate: dateString })
  //   // dateString contains the selected date in a string format, you can use it if needed
  // };
  // const handleEndDateChange = (date, dateString) => {
  //   setEndDate({ ...endDate, endedDate: dateString })
  //   // dateString contains the selected date in a string format, you can use it if needed
  // };

  const handleDateChange = (date, dateString) => {
    // console.log(moment(dateString[0]));
    // const formattedDate = moment(dateString[0], 'YYYY-MM-DD').format('MMMM D, YYYY');
    // console.log(formattedDate);
    setDeadline({ ...deadline, startDate: dateString[0], endDate: dateString[1] })
  };

  // console.log("deadline---------------", deadline);


  return (
    <div>
      <center><h1 style={{ color: 'ThreeDDarkShadow' }}>User Homepage</h1></center>
      <div className='d-flex justify-content-around'>
        <h3>Welcome to our site <span style={{ color: 'blue' }}>{name}</span></h3>
        <button className='btn btn-outline-danger' onClick={handleDeleteAccount}>Logout</button>
      </div>
      {/* <h3>{message}</h3> */}
      <div className='d-flex  justify-content-start align-items-center gap-5'>
        <Button type="primary" className='ms-5' onClick={showModal}>
          Add task
        </Button>
        <input type="text" onChange={(e) => setSearchText(e.target.value)}
          className="form-control w-25" id="exampleInputEmail1" placeholder="search tasks" />
      </div>
      <Modal title="Task Form" open={isModalOpen} okText={"submit"} onCancel={handleCancel} onOk={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Task name</label>
          <input type="text" className="form-control" onChange={handleChange} value={formData.taskName} id="exampleFormControlInput1" placeholder="Enter a task name" name='taskName' />
          {errors.taskName ? <span className="error text-danger">{errors.taskName}</span> : ""}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
          <textarea className="form-control" onChange={handleChange} value={formData.description} id="exampleFormControlTextarea1" rows="3" placeholder='Type something' name='description'></textarea>
          {errors.description ? <span className="error text-danger">{errors.description}</span> : ""}
        </div>
        <div className="form-floating mb-3">
          <select name='status' onChange={handleChange} value={formData.status} className="form-select w-100" id="floatingSelect" aria-label="Floating label select example">
            <option value="Status">Status</option>
            <option value="Pending">Pending</option>
            <option value="Started">Started</option>
            <option value="Progress">Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <label htmlFor="floatingSelect">Task Status</label>
          {errors.status ? <span className="error text-danger">{errors.status}</span> : ""}
        </div>
        <div>
          {/* <DatePicker
            name='deadlineOn'
            className='form-control'
            placeholderText='Pick a deadline'
            selected={selectedDate}
            dateFormat={'dd/MM/yyyy'}
            onChange={date => setSelectedDate(date)}
            minDate={new Date()}
            isClearable
            // showYearDropdown
            // scrollableMonthYearDropdown
            filterDate={date => date.getDay() !== 6 && date.getDay() !== 0}
          /> */}
          {/* {/* <DatePicker onChange={handleStartDateChange} placeholder='Pick a Start date' /> */}
          {/* <DatePicker value={date} onChange={(date) => setDate(date)} placeholder='Pick a End date' /> */}
          {/* <DatePicker.RangePicker

            onChange={handleDateChange}
          /> */}

          {/* <DatePicker.RangePicker showTime onChange={handleDateChange} /> */}

        </div>
      </Modal>
      <div className='taskMainContainer'>
        {
          filteredList.length > 0 ? (
            filteredList.map((item, index) =>
              <div key={index} className='taskContainer'>
                <p><span className='text-white'>Task Name : </span>{item.taskName}</p>
                <p><span className='text-white'>Description : </span>{item.description}</p>
                <p><span className='text-white'>Status: </span>{item.status}</p>
                <p><span className='text-white'>Started On : </span>{item.startedAt}</p>
                <p><span className='text-white'>Ended On : </span>{item.endedAt}</p>
                {/* <p><span className='text-white'>TimeLimit On : </span>{} days</p> */}
                <div className='d-flex justify-content-start gap-3'>
                  <p className='text-white'>{item.timeLimit >= 2 ? 'TotalDays' : 'TotalDay'}:</p><span className={item.timeLimit > 2 ? 'text-success' : 'text-danger'}>{item.timeLimit}</span>
                  <Link to={`/userHome/${item._id}`}><button type="button" id={item._id} className="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#exampleModalCenter">Delete</button></Link>
                  <Link to={`/userHome/editTask/${item._id}`}><button id={item._id} className='btn btn-outline-success btn-sm'>Edit</button></Link>
                </div>
              </div>
            )) : (
            <div>
              <h3 className='text-danger'>{searchText} not found.</h3>
            </div>
          )
        }
      </div>

      {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">Task Delete</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" className='closePopHub' onClick={() => { navigate('/userHome'); notification.error({ description: 'your task not deleted' }) }}>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5>Are you sure to delete this task ?</h5>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger btn-sm" data-dismiss="modal" onClick={() => { navigate('/userHome'); notification.error({ description: 'your task not deleted' }) }}>Cancel</button>
              <button type="button" id={id} onClick={handleDeleteTask} className="btn btn-outline-success btn-sm" data-dismiss="modal">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}