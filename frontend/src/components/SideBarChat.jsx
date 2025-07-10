import './SideBarChat.css'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'


export default function SideBarChat() {
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const {user} = useUser()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
            if(!user){
                console.log("HERE: ", user)
                return 
            } 
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/chatrooms/users/${user.user_id}`, { credentials: "include" })
                const data = await response.json()
                console.log("data: ", data)
                setChats(data)
            } catch (error) {
                console.error('Error: ', error)
            }
        }
        fetchData()
    }, [user])

    const loadChats = () => {
        return chats.map((chat) => {
            const otherUser = chat.userOne.user_id === user.user_id ? chat.userTwo.username : chat.userOne.username
            return  (
            <div className='chat' key={chat.chat_id} onClick={() => navigate(`/chatrooms/${chat.chat_id}`)}>
                <div>{otherUser}'s chat</div>
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

