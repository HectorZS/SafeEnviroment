import './ChatRoom.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { HiArrowCircleLeft } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'


export default function ChatRoom(){
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')
    const { userOneId, userTwoId } = useParams()
    const { user, setUser } = useUser()
    let navigate = useNavigate()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/chatroom/${userOneId}/chat/${userTwoId}`, { credentials: "include" })
                const data = await response.json()
                setChat(data)
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const loadMessages = () => {
        return chat[0].messages.map((message) => (
             user &&
                <div className='message'>
                    <strong>{user.user_id === message.sender_id ? "you" : (message.sender_id === chat[0].userOne.user_id ? chat[0].userOne.username : chat[0].userTwo.username)} typed:</strong> {message.content}
                </div>
            ));
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if(!message) return 
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/chatroom/${chat[0].chat_id}/messages`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({content: message}),
                credentials: "include",
            }); 
        } catch (error) {
            console.error("Failed to sent message", error)
        }
    }

    return(
        <div className='chatRoom'>
            <div>
                <HiArrowCircleLeft style={{ fontSize: '2rem', color: 'black', marginLeft: '25px', width: '3vw', height: '3vw', display: "block"}} onClick={() => {navigate('/homepage')}}/>
            </div>
            {
                chat[0] && user &&
                <div>
                    <h2>Chat between {chat[0].userOne.username} and {chat[0].userTwo.username}</h2>
                    <div>{loadMessages()}</div>
                </div>
            }
            <form style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <input 
                className="searchVar" 
                type="text" 
                placeholder='Type something' 
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '135px' }}
            />
            <button type="submit" onClick={handleSend}>Send</button>
            </form>
        </div>
    )
}