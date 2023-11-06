import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Button, Modal, DatePicker, notification } from "antd";
import { useSelector } from 'react-redux';
export default function ViewTasksByAdmin() {
    const token = useSelector((state) => state.userData.reducer.initialState.token)
    const [taskList, setTaskList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('')
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [deadline, setDeadline] = useState({
        startDate: '',
        endDate: ''
    });

    const [formData, setFormData] = useState({
        taskName: '',
        description: '',
        status: '',
    });

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
            newErrors.taskName = 'taskname is required';
            newErrors.description = 'description is required';
            isVaild = false;
        }
        setErrors(newErrors);
        return isVaild;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const timeDifference = new Date(deadline.endDate) - new Date(deadline.startDate)
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            const TaskData = { ...formData, deadline: { ...deadline, }, timeLimit: daysDifference };
            axios.post(`http://localhost:4000/adminHome/usersList/viewTasks/${user_id}`, TaskData, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    if (res.data.Status === "Success") {
                        setMessage(res.data.Status);
                        setFormData({
                            taskName: '',
                            description: '',
                            status: '',
                        })
                        notification.success({ description: 'Task Successfully added for the user' })
                    }
                    else {
                        alert(res.data.Error)
                    }
                })
                .catch(err => console.log(err));
            setIsModalOpen(false);
            window.location.reload(true)
        }
        else {
            console.log("not okay");
        }
    }

    useEffect(() => {
        axios.get(`http://localhost:4000/adminHome/usersList/viewTasks/${user_id}`)
            .then(res => {
                if (res.data.Status === "Success") {
                    setTaskList(res.data.data)
                }
                else {
                    alert(res.data.Error)
                    navigate('/adminHome')
                }
            })
            .catch(err => console.log(err))
    }, [])

    const handleDeleteTask = (e) => {
        const { id } = e.target;
        axios.post(`http://localhost:4000/delete`, { deleteId: id })
            .then(res => {
                if (res.data.message == "task delete successfully") {
                    navigate(`/adminHome/usersList/viewTasks/${user_id}`)
                    window.location.reload();
                    // console.log("user---id---------", id);
                }
            })
    }
    const filteredList = taskList.filter((item) => {
        return item.taskName.toLowerCase().includes(searchText.toLowerCase());
    });
    const handleDateChange = (date, dateString) => {
        setDeadline({ ...deadline, startDate: dateString[0], endDate: dateString[1] })
        // console.log("dateString----------", dateString);
    };
    return (
        <div>
            <div className='d-flex justify-content-around p-3'>
                <h2>View tasks Page</h2>
                <Link to='/adminHome/usersList'><button className='btn btn-outline-success'>Back to UserListPage</button></Link>
                <Link to='/adminHome'><button className='btn btn-outline-secondary'>Back to AdminHomePage</button></Link>
                <Button type="primary" className='ms-5' onClick={showModal}>
                    Add task
                </Button>
            </div>
            <div>
                <input style={{ marginLeft: '50px' }} type="text" onChange={(e) => setSearchText(e.target.value)}
                    className="form-control w-25" id="exampleInputEmail1" placeholder="search tasks" />
            </div>
            <div className='taskMainContainer'>
                {
                    filteredList.length > 0 ? (
                        filteredList.map((item, index) =>
                            <div key={index + 1} className='taskContainer'>
                                <p><span className='text-white'>Task Name : </span>{item.taskName}</p>
                                <p><span className='text-white'>Description : </span>{item.description}</p>
                                <p><span className='text-white'>Status: </span>{item.status}</p>
                                <p>{item.startedAt !== undefined ? <p><span className='text-white'>StartDate: </span>{item.startedAt}</p> : null}</p>
                                <p>{item.endedAt !== undefined ? <p><span className='text-white'>EndDate: </span>{item.endedAt}</p> : null}</p>
                                <p>{item.timeLimit != undefined ? <p className='text-white'>{item.timeLimit >= 2 ? 'No.Of.Days' : 'No.Of.Day'}:<span className={item.timeLimit > 2 ? 'text-success' : 'text-danger'}> {item.timeLimit}</span></p> : null}</p>
                                {/* <Link to={`/adminHome/usersList/viewTasks/${item.id}`}><button type="button" id={item.id} className="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#exampleModalCenter">Delete</button></Link> */}
                                <p><span className='text-white'>Completed On:</span>{item.status == "Completed" ? (<span> {item.updatedAt}</span>) : (<span className='text-danger'> Not completed yet</span>)}</p>
                                <button onClick={handleDeleteTask} id={item._id} className='btn btn-outline-danger btn-sm'>Delete</button>
                            </div>
                        )) : (<div>
                            <h3 className='text-danger'>Tasks not found.</h3>
                        </div>)
                }
            </div>
            <div>
                <Modal title="Task Form" open={isModalOpen} okText={"submit"} onCancel={handleCancel} onOk={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Task name</label>
                        <input type="text" className="form-control" onChange={handleChange} value={formData.taskName} id="exampleFormControlInput1" placeholder="Enter a task name" name='taskName' />
                        {errors.taskName ? <span className="error">{errors.taskName}</span> : ""}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                        <textarea className="form-control" onChange={handleChange} value={formData.description} id="exampleFormControlTextarea1" rows="3" placeholder='Type something' name='description'></textarea>
                        {errors.description ? <span className="error">{errors.description}</span> : ""}
                    </div>
                    <div className="form-floating mb-3">
                        <select name='status' onChange={handleChange} value={formData.status} className="form-select w-75" id="floatingSelect" aria-label="Floating label select example">
                            <option value="Status">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Started">Started</option>
                            <option value="Progress">Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <label htmlFor="floatingSelect">Role Type</label>
                    </div>
                    <div>
                        <DatePicker.RangePicker showTime onChange={handleDateChange} />
                    </div>
                </Modal>
            </div>
            {/* <!-- Modal --> */}
            {/* <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Task Delete</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" className='closePopHub'>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h5>Are you sure to delete this task ?</h5>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger btn-sm" data-dismiss="modal">Cancel</button>
                            <button type="button" id={user_id} onClick={handleDeleteTask} className="btn btn-outline-success btn-sm">Delete</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
