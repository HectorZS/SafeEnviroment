import './ChatRoom.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { HiArrowLeft } from "react-icons/hi"
import SideBarChat from './SideBarChat.jsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from './Navbar.jsx'


export default function ChatRoom() {
    const [message, setMessage] = useState('')
    const { chatroomId } = useParams()
    const { user } = useUser()
    const navigate = useNavigate()
    const [intervalMs] = useState(300)
    const messagesEndRef = useRef(null)
    const queryClient = useQueryClient()


    const { data, isLoading, error } = useQuery({
        queryKey: ['chatroom', chatroomId],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_URL}/chatrooms/${chatroomId}`, {
                credentials: 'include'
            })
            
            const result = await response.json()
            await fetch(`${import.meta.env.VITE_URL}/chatrooms/${result[0].chat_id}/mark-as-viewed`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json'}, 
                credentials: 'include'
            })
            return result[0]
        },
        refetchInterval: intervalMs
    })


    const handleDate = (date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const formattedDate = dateObj.toLocaleDateString(undefined, {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
    });
    return formattedDate
    }


    const handleSend = async (e) => {
        e.preventDefault()
        if (!message || !data) return
        try {
            await fetch(`${import.meta.env.VITE_URL}/chatrooms/${data.chat_id}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message }),
            credentials: "include"
            })
            setMessage('')
            queryClient.invalidateQueries(['chatroom', chatroomId]) 
        } catch (error) {
            console.error("Failed to send message", error)
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data?.messages])


    if (isLoading) return <div className="loading">Loading chat...</div>
    if (error) return <div className="error">Error loading chat.</div>
    if (!data || !user) return null


    const otherUser = data.userOne.user_id === user.user_id ? data.userTwo : data.userOne


    return (
        <div className='chatRoom'>
            <Navbar/>
        <div className='chatRoom-center'>
            <div className='leftSide'>
            <SideBarChat  />
            </div>
            <div className='rightSide'>
            <div className="chat-header">
                <button className="back-button" onClick={() => navigate('/homepage')}>
                <HiArrowLeft />
                </button>
                <div className="chat-title">
                Chat with {otherUser.username}
                </div>
                <div></div> 
            </div>
            
            <div className="messages-list">
                {data.messages.map((msg) => (
                <div
                    key={msg.message_id}
                    className={`message-bubble ${msg.sender_id === user.user_id ? 'you' : 'other'}`}
                >
                    <div className="message-content">
                    <div className='head-message'>
                        <span className="sender">
                            {msg.sender_id === user.user_id ? "You" : (
                                msg.sender_id === data.userOne.user_id ? data.userOne.username : data.userTwo.username
                            )}
                        </span>
                    </div>
                    <div style={{display: "flex", gap: "5px"}}>
                    <span className='message-text'>{msg.content}</span>
                    <span className='time'>{handleDate(msg.createdAt)}</span>
                    </div>
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="message-input-container">
                <form onSubmit={handleSend} className="message-form">
                <input
                    className="message-input"
                    type="text"
                    placeholder='Type a message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="send-button">
                    Send
                </button>
                </form>
            </div>
            </div>
        </div>
        </div>
    )
}



