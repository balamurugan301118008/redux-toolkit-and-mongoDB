import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function ManagerList() {
    const [managerList, setManagers] = useState([]);
    const [searchText, setSearchText] = useState('')
    useEffect(() => {
        axios.get('http://localhost:5051/managerList')
            .then(res => {
                setManagers(res.data.data)
            })
            .catch(err => console.log(err))
    }, [])

    const filteredList = managerList.filter((item) => {
        return item.name.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <div>
            <div className='d-flex justify-content-around p-3'>
                <h1>Manager lists</h1>
                <Link to='/adminHome'><button className='btn btn-outline-primary'>Back to AdminPage</button></Link>
            </div>
            <div>
                <input style={{ margin: '15px 70px' }} type="text" onChange={(e) => setSearchText(e.target.value)}
                    className="form-control w-25" id="exampleInputEmail1" placeholder="search managers" />
            </div>
            <div className='managerListContainer'>
                <table className="table container-sm border border-5">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Manager Name</th>
                            <th scope="col">Manager Email</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            filteredList.length > 0 ?
                                filteredList.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td><Link to={`/adminHome/managerList/userList/${item.id}`}><button className='btn btn-outline-success btn-sm' id={item.id}>Assign User</button></Link></td>
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
