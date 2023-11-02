import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Modal, DatePicker, notification } from "antd";
import { useSelector } from 'react-redux';

export default function ViewTasks() {
    const token = useSelector((state) => state.userData.initialState.token)
    const [taskList, setTaskList] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
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
        status: ''
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
            newErrors.status = 'Task status is required';
            isVaild = false;
        }
        setErrors(newErrors);
        return isVaild;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const TaskData = { ...formData, deadline: { ...deadline } };
            console.log(TaskData);
            axios.post(`http://localhost:4000/managerHome/viewTasks/${id}`, TaskData, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    if (res.data.Status === "Success") {
                        setFormData({
                            taskName: '',
                            description: '',
                            status: '',
                        })
                        notification.success({ description: 'Task Successfully added for the user' })
                        // console.log("Task added succcessful");
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
    useEffect(() => {
        axios.get(`http://localhost:4000/managerHome/viewTasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.data.Status === "Success") {
                    setTaskList(res.data.data)
                }
                else {
                    alert(res.data.Error)
                    navigate('/adminOrManagerLogin')
                }
            })
            .catch(err => console.log(err))
    }, [taskList]);
    const handleDeleteTask = (e) => {
        const { id } = e.target;
        axios.post(`http://localhost:4000/delete`, { deleteId: id })
            .then(res => {
                if (res.data.message === "task delete successfully") {
                    notification.error({ description: 'your task successfully deleted' })
                }
                else {
                    notification.error({ description: res.data.Error })
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
                <Link to='/managerHome'><button className='btn btn-outline-success'>Back to ManangerHomepage</button></Link>
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
                    filteredList.length > 0 ? filteredList.map((item, index) =>
                        <div key={index} className='taskContainer'>
                            <p><span className='text-white'>Task Name : </span>{item.taskName}</p>
                            <p><span className='text-white'>Description : </span>{item.description}</p>
                            <p><span className='text-white'>Status: </span>{item.status}</p>
                            <p><span className='text-white'>Started On : </span>{item.deadline_start}</p>
                            <p><span className='text-white'>Ended On : </span>{item.deadline_end}</p>
                            <button onClick={handleDeleteTask} id={item._id} className='btn btn-outline-danger btn-sm'>Delete</button>
                        </div>
                    ) : (<div>
                        <h4 className='text-danger'>{searchText} not found</h4>
                    </div>)
                }
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
                    <DatePicker.RangePicker showTime onChange={handleDateChange} />
                </div>
            </Modal>
        </div>
    )
}
