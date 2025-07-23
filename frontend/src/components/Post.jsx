import './Post.css'
import { useState } from 'react'
import VolunteerModal from './VolunteerModal'
import PostModal from './PostModal'
import pet from '../../assets/pet-care.jpg'


export default function Post({ creator, title, category, urgency, status, onDelete, onContact, isHome, onComplete, postId, distance, address, createdAt, onToggleInHelp, inHelp, canDelete = true, post }) {
    const [showVolunteerModal, setShowVolunteerModal] = useState(false)
    const [showPostModal, setShowPostModal] = useState(false)
    const dateObj = typeof createdAt === 'string' ? new Date(createdAt) : createdAt
    const formattedDate = dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })

    const getCategoryImage = () => {
        const categoryImages = {
        'Pet Care': '../../assets/pet-care.jpg',
        'Tool & Equipment Lending': '../../assets/tool-and-equipment.jpg',
        'Errands & Assistance': '../../assets/errands.jpeg',
        'Home & Yard Help': '../../assets/yard-help.jpg',
        'Social & Community Engagement': '../../assets/community.avif'
        };

        return categoryImages[category]
    }


    const handleOnCompleteClick = (e) => {
        e.stopPropagation()
        setShowVolunteerModal(true)
    }

    const handleCompleteWithVolunteer = (postId, volunteerId) => {
        onComplete(postId, volunteerId)
        setShowVolunteerModal(false)
    }
    const handleShowPostModal = () => {
        setShowPostModal(true)
    }

    const handleToggleInHelp = (e) => {
        e.stopPropagation()
        onToggleInHelp(postId, inHelp)
    }

    return (
        <div className='simple-post' onClick={handleShowPostModal}>
        <div className='post-image-section'>
            <img
            src={getCategoryImage()}
            alt={category}
            className='simple-post-image'
            />
            <div className='urgency-tag'>{urgency}</div>
        </div>
        <div className='post-info-section'>
            <h3>{title}</h3>
            <p>By: {creator}</p>
            <p>Category: {category}</p>
            <p>Location: {address}</p>
            {distance !== undefined && distance !== null && (
            <p>Distance: {distance.toFixed(2)} km</p>
            )}
            <div className='post-buttons'>
            {!isHome && (
                <>
                {canDelete && (
                    <button className='simple-button delete-btn' onClick={(e) => { e.stopPropagation()
                        onDelete()
                    }}
                    >
                    Delete
                    </button>
                )}
                {status !== 'completed' && (
                    <button className='simple-button complete-btn' onClick={handleOnCompleteClick}
                    >
                    Mark as completed
                    </button>
                )}


                {status !== 'completed' && (
                    <button
                    className={`simple-button inhelp-btn ${inHelp ? 'active' : ''}`} onClick={handleToggleInHelp}
                    >
                    {inHelp ? 'In Help' : 'Need Help'}
                    </button>
                )}
                </>
            )}
            </div>
        </div>
        {showVolunteerModal && (
            <VolunteerModal
            postId={postId}
            onComplete={handleCompleteWithVolunteer}
            onClose={() => setShowVolunteerModal(false)}
            />
        )}
        {showPostModal && (
            <PostModal
            onClose={() => setShowPostModal(false)}
            post={post}
            onContact={onContact}
            />
        )}
        </div>
    )
}


