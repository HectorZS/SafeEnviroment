import './LoginPage.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage(props){
    const [formData, setFormData] = useState({ email: "", username: "", password: "", latitude: 0, longitude: 0})
    return (
        <div className='overlayStyleLogin' onClick={props.close}>
            <div className='modalBodyLogin'>
                <div className='upperPartLogin'>
                   <Link to='/signup'>
                        <p>Signup</p>
                   </Link>
                </div>
                <div>
                    <button>Login</button>
                </div>
                <div>
                    <button onClick={props.close}>Close</button>
                </div>
            </div>
        </div>
    )
}