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
        'Pet Care' : 'https://media.istockphoto.com/id/1388816698/photo/happy-pet-sitters-enjoying-with-group-of-dogs-during-a-walk-in-the-park.jpg?s=612x612&w=0&k=20&c=AxT0OZol2z6ogIOapwdI5hPRR-WI0tdFksxqIg94sIc=',
        'Tool & Equipment Lending': 'https://images.squarespace-cdn.com/content/v1/52717f08e4b079ec23e2b627/0e5b33ae-2bdf-421f-9f7d-73843e066100/DSC_3216-24.jpg',
        'Errands & Assistance': 'https://www.theworkathomewoman.com/wp-content/uploads/A-young-woman-getting-paid-to-run-errands.jpeg',
        'Home & Yard Help': 'https://www.uab.edu/news/images/photos/2025/summer/Five_tips_for_yard_work_safety_01.jpg',
        'Social & Community Engagement': 'https://insider.augusta.edu/wp-content/uploads/sites/25/2024/01/community-service-manager-outside.jpg'
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
            <div className={`urgency-tag ${urgency.toLowerCase()}`}>{urgency}</div>
        </div>
        <div className='post-info-section'>
            <h3>{title}</h3>
            <p>By: {creator}</p>
            <p>Category: {category}</p>
            <p>Location: {address}</p>
            {status === 'completed' && !isHome && (
                <strong><p> Completed by {post.volunteer.username}</p></strong>
            )
            }
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


