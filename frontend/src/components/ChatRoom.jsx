import './ChatRoom.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { HiArrowCircleLeft } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'
import SideBarChat from './SideBarChat.jsx';


export default function ChatRoom(){
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')
    const { chatroomId } = useParams()
    const { user, setUser } = useUser()
    let navigate = useNavigate()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/chatrooms/${chatroomId}`, { credentials: "include" })
                const data = await response.json()
                setChat(data)
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [chatroomId]);


    const loadMessages = () => {
        return chat[0].messages.map((message) => (
             user &&
                <div className='message' key={message.message_id}>
                    <strong>{user.user_id === message.sender_id ? "you" : (message.sender_id === chat[0].userOne.user_id ? chat[0].userOne.username : chat[0].userTwo.username)} typed:</strong> {message.content}
                </div>
            ));
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if(!message) return 
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/chatrooms/${chat[0].chat_id}/messages`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({content: message}),
                credentials: "include",
            }); 
            location.reload();
        } catch (error) {
            console.error("Failed to sent message", error)
        }
    }

    return(
        <div className='chatRoom'>
            <div>
                <HiArrowCircleLeft style={{ fontSize: '2rem', color: 'black', marginLeft: '25px', width: '3vw', height: '3vw', display: "block"}} onClick={() => {navigate('/homepage')}}/>
            </div>
            <div className='chatRoom-center'>
                <div className='leftSide'>
                    <SideBarChat/>
                </div>
                <div className='rightSide'>
                    {
                        
                    chat[0] && user && 
                    <div>
                        <h2>Chat with {chat[0].userOne.user_id === user.user_id 
                            ? chat[0].userTwo.username
                            : chat[0].userOne.username
                            }</h2>
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
            </div>
        </div>
    )
}