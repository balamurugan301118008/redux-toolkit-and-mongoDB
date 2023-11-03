import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, DatePicker, notification } from "antd";

export default function AdminAndManagerRegister() {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        name: '',
        role: '',
        email: '',
        password: '',
    });

    const validate = () => {
        let newErrors = { ...errors };
        let isVaild = true;
        if (formData.name.trim() === "" && formData.password.trim() === "" && formData.email.trim() === "") {
            newErrors.name = 'Username is required';
            newErrors.password = 'password is required';
            newErrors.email = 'Email is required';
            newErrors.adminOrManager = 'any one field is required';
            isVaild = false;
        }

        if (formData.name.length < 4 && formData.name.trim() !== "") {
            newErrors.name = 'Username must be at least 5 characters long';
            isVaild = false;
        }
        if (formData.email.length < 10 && formData.email.trim() !== "") {
            newErrors.email = 'Email must be at least 8 characters long';
            isVaild = false;
        }
        if (formData.password.length < 7 && formData.password.trim() !== "") {
            newErrors.password = 'Password must be at least 8 characters long';
            isVaild = false;
        }
        setErrors(newErrors);
        return isVaild;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        delete errors[name]
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            axios.post('http://localhost:4000/adminOrManagerRegister', formData)
                .then(res => {
                    if (res.data.Status == "Success") {
                        notification.success({ description: "You're Successfully Registered" })
                        navigate('/adminOrManagerLogin');
                    } else {
                        alert(res.data.Error);
                    }
                })
                .catch(err => console.log(err));
        }
        else {
            navigate('/adminOrManagerRegister')
            console.log("not okay");
        }
    }
    return (
        <div>
            <p className='alertMessage'></p>
            <div className='container w-50 p-20'>
                <div>
                    <h1 className='signUp'>Admin Or Manager <span className='text-success'>Register</span></h1>
                </div>
                <form className='container-fluid m-10' onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputUsername" className="form-label">Admin or Manager</label>
                        <input type="text" className="form-control w-75" onChange={handleChange} value={formData.name} id="exampleInputEmail1" placeholder="Enter username" name='name' />
                        {errors.name ? <span className="error">{errors.name}</span> : ""}
                    </div>

                    <div className="form-floating mb-3">
                        <select name='role' onChange={handleChange} value={formData.role} className="form-select w-75" id="floatingSelect" aria-label="Floating label select example">
                            <option value="None">None</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                        </select>
                        <label htmlFor="floatingSelect">Role Type</label>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control  w-75" onChange={handleChange} value={formData.email} id="exampleInputEmail1" placeholder="Enter email" name='email' />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className='form-control  w-75' onChange={handleChange} value={formData.password} id="exampleInputPassword1" placeholder="password" name='password' />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <button type='submit' className="btn btn-primary">Register</button>
                    <div>
                        <p className='p-3'>Already have an account  <Link to='/adminOrManagerLogin' className='btn btn-light border-secondary'>Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
