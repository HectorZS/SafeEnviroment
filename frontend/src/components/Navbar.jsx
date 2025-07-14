import './Navbar.css'
import { useState } from 'react';
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false)
    const { user, setUser } = useUser(); 
    let navigate = useNavigate(); 


    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_URL}/logout`, { method: "POST", credentials: "include" });
        setUser(null);
        navigate("/"); 
    };

    return (
        <div>
            <div className='navBarBody'>
                <div className='leftNavBar'>
                    <h4 onClick={() => {navigate('/homepage')}}>Homepage</h4>
                    <h4 onClick={() => {navigate('/profilecenter')}}>Profile center</h4>
                    <h4 onClick={() => {navigate('/create-post')}}>Create post</h4>
                    <h4 onClick={
                        async () => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_URL}/chatrooms/users/${user.user_id}`, {
                                    credentials: "include",
                                })
                                const data = await response.json()
                                if(data.length > 0) {
                                    navigate(`/chatrooms/${data[0].chat_id}`)
                                } else {
                                    navigate('/chatrooms/no-chats')
                                }
                            } catch (error) {
                                console.error("Error fetching chatrooms: ", error)
                            }
                        }
                    }>Messages</h4>
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