import './Navbar.css'
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false)
    const { user, setUser } = useUser(); // Access authentication state
    let navigate = useNavigate(); 


    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_URL}/logout`, { method: "POST", credentials: "include" });
        setUser(null); // Remove user from context
        navigate("/"); // Redirect to login
    };

    return (
        <div>
            <div className='navBarBody'>
                <div className='leftNavBar'>
                    <h4 onClick={() => {navigate('/homepage')}}>Home page</h4>
                    <h4 onClick={() => {navigate('/profilecenter')}}>Profile center</h4>
                    <h4 onClick={() => {navigate('/create-post')}}>Create post</h4>
                </div>
                <h2 className='centerNavBar'>
                    {user ? `Welcome, ${user.username}` : 'Loading...'}
                </h2>
                <div className='rightNavBar'>
                    <div className='navigationLinks'>

                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}