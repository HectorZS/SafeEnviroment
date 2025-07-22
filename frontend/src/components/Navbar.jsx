import './Navbar.css'
import { useState } from 'react';
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from "react-icons/bs";
import OptionsModal from './OptionsModal';
import { useQuery } from '@tanstack/react-query';
import { FaCircle } from 'react-icons/fa';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const { data: chats, isLoading } = useQuery({
        queryKey: ['chatrooms', user?.user_id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_URL}/chatrooms/users/${user.user_id}`, {
                credentials: 'include'
            });
            return res.json();
        },
        enabled: !!user,
        refetchInterval: 1000 
    });

    const hasNewMessages = chats?.some(chat =>
        chat.messages.some(msg => 
            msg.sender_id !== user.user_id && 
            !msg.viewed 
        )
    );

    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_URL}/logout`, { method: "POST", credentials: "include" });
        setUser(null);
        navigate("/");
    };

    const handleMore = () => setIsOpen(!isOpen);

    const goToMessages = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/chatrooms/users/${user.user_id}`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.length > 0) {
                await fetch(`${import.meta.env.VITE_URL}/chatrooms/${data[0].chat_id}/mark-as-viewed`, {
                    method: 'PUT', 
                    headers: { 'Content-Type': 'application/json'}, 
                    credentials: 'include'
                })
                navigate(`/chatrooms/${data[0].chat_id}`);
            } else {
                navigate('/chatrooms/no-chats');
            }
        } catch (error) {
            console.error("Error fetching chatrooms: ", error);
        }
    }

    return (
        <div>
            <div className='navBarBody'>
                <div className='leftNavBar'>
                    <h4 onClick={() => navigate('/homepage')}>Homepage</h4>
                    <h4 onClick={() => navigate('/profilecenter')}>Profile center</h4>
                    <h4 onClick={() => navigate('/create-post')}>Create post</h4>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={goToMessages}>
                        <h4>Messages</h4>
                        {hasNewMessages && (
                            <FaCircle 
                                size={10} 
                                color="red" 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    right: -10 
                                }} 
                            />
                        )}
                    </div>
                </div>
                <h2 className='centerNavBar'>
                    {user ? `Welcome, ${user.username}` : 'Loading...'}
                </h2>
                <div className='rightNavBar'>
                    <div className='navigationLinks'>
                        <button aria-label="More options" onClick={handleMore} className="moreButton">
                            <BsThreeDots />
                        </button>
                    </div>
                </div>
            </div>
            <OptionsModal
                open={isOpen}
                closeModal={() => setIsOpen(false)}
                handleLogout={handleLogout}
            />
        </div>
    );
}