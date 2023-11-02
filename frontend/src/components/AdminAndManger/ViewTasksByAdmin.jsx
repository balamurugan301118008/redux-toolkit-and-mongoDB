import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Button, Modal } from "antd";
import { useSelector } from 'react-redux';
export default function ViewTasksByAdmin() {
    const token = useSelector((state) => state.userData.initialState.token)
    const [taskList, setTaskList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('')
    const { user_id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        taskName: '',
        description: '',
        status: '',
    });

    const [errors, setErrors] = useState({
        taskName: '',
        description: '',
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
            axios.post(`http://localhost:5051/adminHome/usersList/viewTasks/${user_id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    if (res.data.Status === "Success") {
                        setMessage(res.data.Status);
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
        axios.get(`http://localhost:5051/adminHome/usersList/viewTasks/${user_id}`)
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
        axios.post(`http://localhost:5051/delete`, { deleteId: id })
            .then(res => {
                if (res.data.message == "task delete successfully") {
                    navigate(`/adminHome/usersList/viewTasks/${user_id}`)
                    window.location.reload();
                    // console.log("user---id---------", id);
                }
            })
    }
    const filteredList = taskList.filter((item) => {
        return item.task_name.toLowerCase().includes(searchText.toLowerCase());
    });
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
                            <div key={index} className='taskContainer'>
                                <p><span className='text-white'>Task Name : </span>{item.task_name}</p>
                                <p><span className='text-white'>Description : </span>{item.description}</p>
                                <p><span className='text-white'>Status: </span>{item.status}</p>
                                {/* <Link to={`/adminHome/usersList/viewTasks/${item.id}`}><button type="button" id={item.id} className="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#exampleModalCenter">Delete</button></Link> */}
                                <button onClick={handleDeleteTask} id={item.id} className='btn btn-outline-danger btn-sm'>Delete</button>
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
