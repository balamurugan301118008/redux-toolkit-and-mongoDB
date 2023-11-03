import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function UsersList() {
    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        axios.get('http://localhost:5051/adminHome/usersList')
            .then(res => {
                console.log(res);
                if (res.data.Status === "Success") {
                    setUserList(res.data.data)
                    navigate('/adminHome/usersList');
                }
                else {
                    alert(res.data.Error)
                    navigate('/adminHome');
                }
            }).catch(err => console.log(err))
    }, [])

    const handleViewTask = (e) => {
        const { id } = e.target
        navigate(`/adminHome/usersList/viewTasks/${id}`)
    }
    const filteredList = userList.filter((item) => {
        return item.user_name.toLowerCase().includes(searchText.toLowerCase());
    });
    return (
        <div>
            <div className='d-flex justify-content-around p-3'>
                <h1>User lists</h1>
                <Link to='/adminHome'><button className='btn btn-outline-primary'>Back to AdminPage</button></Link>
            </div>
            <div>
                <input style={{ margin: '15px 70px' }} type="text" onChange={(e) => setSearchText(e.target.value)}
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
                    <tbody>
                        {
                            filteredList.length > 0 ?
                                filteredList.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.user_name}</td>
                                            <td>{item.email}</td>
                                            <td><button className='btn btn-outline-success btn-sm' onClick={handleViewTask} id={item.id}>View Task</button></td>
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
        </div>
    )
}
