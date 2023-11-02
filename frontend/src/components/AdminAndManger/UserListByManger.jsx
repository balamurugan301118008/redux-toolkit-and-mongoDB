import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios';
import { Button, Modal, DatePicker, notification } from "antd";


export default function UserListByManger() {
    const [userList, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('')
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:4000/usersList/${id}`)
            .then(res => {

                setUsers(res.data.data)

            })
            .catch(err => console.log(err))
    }, [userList]);

    // Here are the user assign function 
    const handleUserAssign = (e) => {
        const payload = {
            managerId: id,
            userId: e.target.id
        }
        axios.post('http://localhost:4000/adminHome/managerList', payload)
            .then(res => {
                if (res.data.Status === "Success") {
                    notification.success({ description: 'User successfully assigned' })
                }
                else {
                    notification.error({ description: res.data.Error })
                }
            })
            .catch(err => {
                notification.error({ description: 'Can not assign the users' })
            })
    }
    const filteredList = userList.filter((item) => {
        return item.name.toLowerCase().includes(searchText.toLowerCase());
    });

    // let idx = [];
    // setId.filter(id => idx.push(id.user_id));

    return (
        <React.Fragment>
            <div>
                <div className='d-flex justify-content-around p-3'>
                    <h2>User lists Page</h2>
                    <Link to='/adminHome/managerList'><button className='btn btn-outline-success'>Back to ManangerList</button></Link>
                </div>
                <div>
                    <input style={{ margin: '15px 70px' }} type="text" onChange={(e) => setSearchText(e.target.value)}
                        className="form-control w-25" id="exampleInputEmail1" placeholder="search users" />
                </div>
                <div className='userListContainer'>
                    <table className="table container-sm border border-5">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">User Name</th>
                                <th scope="col">User Email</th>
                                <th>Assign to</th>
                            </tr>
                        </thead>
                        <tbody className="userList">

                            {filteredList.length > 0 ?
                                filteredList.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            {/* <th scope="row">{user._id}</th> */}
                                            <th>{index+1}</th>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td><input type='button' value={user.status ? "UnAssign" : "Assign"} className={user.status ? "btn btn-outline-danger btn-sm" : "btn btn-outline-success btn-sm"} id={user._id} onClick={handleUserAssign}></input></td>
                                            {/* <td><input type='button' className={idx.find(id => id == user.id) == user.id ? "btn btn-outline-danger btn-sm" : "btn btn-outline-success btn-sm"} value={idx.filter(id => id == user.id) == user.id ? "Unassign" : "Assign"} id={user.id} onClick={handleUserAssign}></input></td> */}
                                        </tr>)
                                }) : (
                                    <tr>
                                        <td className='text-danger'>{searchText} not found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    )
}

