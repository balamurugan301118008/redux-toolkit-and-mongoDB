import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
export default function AdminAssignedViews() {
    const token = useSelector(state => state.adminDetails.adminToken)
    const [getData, setData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5051/adminHome/AssignList', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.data.Status == "Success") {
                    console.log(res.data.data)
                    setData(res.data.data);
                }
            })
            .catch(res => console.log(res))
    }, []);

    return (
        <React.Fragment>
            <div>Hello Admin</div>
            <div>
                <table className="table table-responsive table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Manager Name</th>
                            <th scope="col">User id</th>
                        </tr>
                    </thead>
                    {getData.map((item, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.user_id}</td>
                                    {/* <td><button onClick={handleViewTask} id={item.id}>View Task</button></td> */}
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        </React.Fragment>
    )
}