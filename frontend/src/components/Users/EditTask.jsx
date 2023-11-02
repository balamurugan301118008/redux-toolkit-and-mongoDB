import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Modal, DatePicker, notification } from "antd";
function EditTask() {
    const [taskName, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setTaskStatus] = useState('');
    const { id } = useParams();
    const naviagate = useNavigate();

    // const [errors, setErrors] = useState({
    //     taskName: '',
    //     description: '',
    //     status: '',
    // });

    // const validate = () => {
    //     let newErrors = { ...errors };
    //     let isVaild = true;
    //     if (formData.taskName.trim() === "" && formData.description.trim() === "") {
    //         newErrors.taskName = 'Taskname is required';
    //         newErrors.description = 'Description is required';
    //         newErrors.status = 'Task status is required'
    //         isVaild = false;
    //     }
    //     setErrors(newErrors);
    //     return isVaild;
    // }

    useEffect(() => {
        axios.get(`http://localhost:4000/userHome/editTask/${id}`)
            .then((response) => {
                setTaskName(response.data.data[0].taskName);
                setDescription(response.data.data[0].description);
                setTaskStatus(response.data.data[0].status)
            })
            .catch((error) => {
                console.error('Error fetching item:', error);
            });
    }, []);

    const handleUpdateTask = (e) => {
        e.preventDefault();
        // alert("Ads")
        // if (taskName.length < 0) {
        //     console.log("taskname is required");
        // }
        // else {
        axios.post(`http://localhost:4000/userHome/editTask/${id}`, { taskName: taskName, description: description, status: status })
            .then(res => {
                if (res.data.Status == "Success") {
                    notification.success({ description: 'Your Task Successfully Updated' })
                    naviagate("/userHome")
                }
            })
            .catch(err => console.log(err))
        // }
    }
    return (
        <div>
            <div className='d-flex justify-content-around p-3'>
                <h1>Update User Task page</h1>
                <Link to='/userHome'><button className='btn btn-outline-primary'>Back to UserHomePage</button></Link>
            </div>
            <div className='wd-25 container'>
                <form onSubmit={handleUpdateTask}>
                    <div className="mb-3">
                        <label className="form-label">Task Name</label>
                        <input type="text" className="form-control" onChange={(e) => setTaskName(e.target.value)} value={taskName} name='taskName' />
                        {taskName.length < 0 ? <span className='error text-danger'>Taskname is required</span> : ''}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input type="text" className="form-control" onChange={(e) => setDescription(e.target.value)} value={description} name='description' />
                    </div>
                    <div className="form-floating mb-3">
                        <select name='status' onChange={(e) => setTaskStatus(e.target.value)} value={status} className="form-select w-100" id="floatingSelect" aria-label="Floating label select example">
                            <option value="Status">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Started">Started</option>
                            <option value="Progress">Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <label htmlFor="floatingSelect">Task Status</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Update Task</button>
                </form>
            </div>
        </div>
    )
}

export default EditTask
