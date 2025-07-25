import './SideBarChat.css'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FaCircle } from 'react-icons/fa'


export default function SideBarChat() {
    const { chatroomId } = useParams()
    const { user } = useUser()
    const navigate = useNavigate()
    let notRead = new Set()


    const { data: chats, isLoading, error } = useQuery({
        queryKey: ['chatrooms', user?.user_id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_URL}/chatrooms/users/${user.user_id}`, {
                credentials: 'include'
            })
            return res.json()
        },
        enabled: !!user,
        refetchInterval: 1000
    })


    const hasNewMessages = () => {
        chats?.forEach(chat => {
            if (chat.messages.some(
                msg => 
                msg.sender_id !== user.user_id &&
                !msg.viewed
            )) {
                notRead.add(chat.chat_id)
            }
        })
    }


    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now - date) / 1000)
        
        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }


    const getLastMessageTime = (chat) => {
        if (!chat.messages.length) return ''
        return formatTimeAgo(chat.messages[chat.messages.length - 1].createdAt)
    }


    if (isLoading) return <div className="loading">Loading chats...</div>
    if (error) return <div className="error">Error loading chats</div>


    hasNewMessages()


    const loadChats = () => {
        return chats.map((chat) => {
            const otherUser = chat.userOne.user_id === user.user_id ? chat.userTwo : chat.userOne
            const lastMessage = chat.messages[chat.messages.length - 1]?.content || 'No messages yet'
            const isActive = chat.chat_id === chatroomId
            return (
                <div 
                    className={`chat ${isActive ? 'active' : ''}`} 
                    key={chat.chat_id} 
                    onClick={async () => {
                        await fetch(`${import.meta.env.VITE_URL}/chatrooms/${chat.chat_id}/mark-as-viewed`, {
                            method: 'PUT', 
                            headers: { 'Content-Type': 'application/json'}, 
                            credentials: 'include'
                        })
                        navigate(`/chatrooms/${chat.chat_id}`)
                    }}
                >
                    <div className="chat-header">
                        <h4 className='name'>{otherUser.username}</h4>
                        {notRead.has(chat.chat_id) && (
                            <FaCircle 
                                className='circleRead'
                                size={10} 
                                color="#ff4444" 
                            />
                        )}
                    </div>
                    <div className='lastMessage'>{lastMessage}</div>
                    {chat.messages.length > 0 && (
                        <div className='time-ago'>{getLastMessageTime(chat)}</div>
                    )}
                </div>
            )
        })
    }
    
    return (
        <div className='sideBarChat'>
            {loadChats()}
        </div>
    )
}



