import './VolunteerModal.css'
import { useState, useEffect } from 'react'

export default function VolunteerModal({ postId, onComplete, onClose }){
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        if(!searchQuery) return 

        setIsLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/users/search/${searchQuery}`, { credentials: 'include' })
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Search error: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = () => {
         if (!window.confirm("Are you sure you want to mark this post as completed, with the selected user as a volunteer?")){
            return
        }
        if (!selectedUser) return
        onComplete(postId, selectedUser.user_id)
        onClose()
    }

    return (
        <div className='modal-overlay'>
            <div className='volunteer-search-modal'>
                <h3>Select volunteer</h3>
                <div className='search-container'>
                    <input type="text" placeholder='Search users' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    <button onClick={handleSearch}>
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                </div>
                <div className='user-results'>
                    {users.map(user => (
                        <div key={user.user_id} className={`user-item ${selectedUser?.user_id === user.user_id ? 'selected' : ''}`} onClick={() => setSelectedUser(user)}>
                            <span>Username: {user.username}</span>
                            <span>Email: {user.email}</span>
                        </div>
                    ))}
                </div>
                <div className='modal-actions'>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit} disabled={!selectedUser}>Confirm volunteer</button>
                </div>
            </div>
        </div>
    )

}