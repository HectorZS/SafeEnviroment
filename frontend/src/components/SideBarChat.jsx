import './SideBarChat.css'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { FaCircle } from 'react-icons/fa';


export default function SideBarChat() {
    const [loading, setLoading] = useState(true)
    const {user} = useUser()
    const navigate = useNavigate()
    let notRead = new Set()
    const { data: chats, isLoading, error } = useQuery({
        queryKey: ['chatrooms', user?.user_id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_URL}/chatrooms/users/${user.user_id}`, {
                credentials: 'include'
            });
            return res.json();
        },
        enabled: !!user,
        refetchInterval: 200 
    });

    if (isLoading) return "Loading..."
    if (error)  return 'Error'

    const hasNewMessages = () => {
        chats?.map(chat => {
            if (chat.messages.some(
                msg => 
                msg.sender_id !== user.user_id &&
                !msg.viewed
            )) {
                notRead.add(chat.chat_id)
            }
        })
    }

    hasNewMessages()

    const loadChats = () => {
        return chats.map((chat) => {
            const otherUser = chat.userOne.user_id === user.user_id ? chat.userTwo.username : chat.userOne.username
            const lastMessage = chat.messages[chat.messages.length - 1]?.content
            return  (
                <div className='chat' key={chat.chat_id} onClick={async () => {
                    await fetch(`${import.meta.env.VITE_URL}/chatrooms/${chat.chat_id}/mark-as-viewed`, {
                        method: 'PUT', 
                        headers: { 'Content-Type': 'application/json'}, 
                        credentials: 'include'
                    })
                    navigate(`/chatrooms/${chat.chat_id}`)
                }}>
                    <div style={{ display: "flex"}}>
                        <h4 className='name'>{otherUser}'s chat</h4>
                        { notRead.has(chat.chat_id) && (
                            <FaCircle className='circleRead'
                                size={10} 
                                color="red" 
                            />
                        )
                        }
                    </div>
                    <div className='lastMessage'>{lastMessage}</div>
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

