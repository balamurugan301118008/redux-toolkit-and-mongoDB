import React from 'react'
import { Link } from 'react-router-dom'
export default function Actions() {
    return (
        <div>
            <center><h1>Welcome page</h1></center>
            <div className='d-flex justify-content-around p-3'>
                <div className='d-grid gap-2'>
                    <h2 className='text-primary-emphasis'>User actions</h2>
                    <Link to='/userLogin'><button className=' btn btn-info'>User Login</button></Link>
                    <Link to='/userRegister'><button className=' btn btn-info'>User Register</button></Link>
                </div>
                <div className='d-grid gap-2'>
                    <h2 className='text-info-emphasis'>Admin Or manager actions</h2>
                    <Link to='/adminOrManagerLogin'><button className='btn btn btn-light'>Admin or manager Login</button></Link>
                    <Link to='/adminOrManagerRegister'><button className='btn btn btn-light'>Admin or manager Register</button></Link>
                </div>
            </div>
        </div>
    )
}
