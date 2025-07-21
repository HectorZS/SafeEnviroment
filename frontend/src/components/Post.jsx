import './Post.css'
import { useState } from 'react'
import VolunteerModal from './VolunteerModal'

export default function Post({ creator, title, category, description, urgency, status, onDelete, onContact, isHome, onComplete, postId, distance, address, createdAt, onToggleInHelp, inHelp}){
    const [showVolunteerModal, setShowVolunteerModal] = useState(false)

    const dateObj = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    const formattedDate = dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, 
    });

    const handleOnCompleteClick = () => {
        setShowVolunteerModal(true)
    }

    const handleCompleteWithVolunteer = (postId, volunteerId) => {
        onComplete(postId, volunteerId)
        setShowVolunteerModal(false)
    }

    const handleToggleInHelp = () => {
        onToggleInHelp(postId, inHelp)
    }

    return (
        <div className='post'>
            <div className='data'>
                <h2 className='title'>
                    {title}
                </h2>
                <div className='creator'>
                    by {creator}
                </div>
                  <div className='urgency'>
                    Urgency: {urgency}
                </div>
                <div className='creation-date'>
                    Date: {formattedDate}
                </div>
                 <div className='status'>
                    Status: {status || 'Pending'}
                </div>
                <div className='category'>
                    {category}
                </div>
                <div className='description'>
                    {description}
                </div>
                <div className='address'>
                    <strong>{address}</strong>
                </div>
                {distance !== undefined && distance !== null && (
                    <div className='distance'>
                        Distance: {distance.toFixed(2)} km
                    </div>
                )}
            </div>
            <div className='buttons'>
                {!isHome && (
                    <>
                        <button className="delete-button" onClick={onDelete}>Delete</button>
                        {status !== 'completed' && (
                            <button className='complete-button' onClick={handleOnCompleteClick}>Mark as completed</button>
                        )}
                        {status !== 'completed' && (
                            <button
                            className={`inhelp-button ${inHelp ? 'active' : ''}`}
                            onClick={handleToggleInHelp}
                            >
                            {inHelp ? 'Marked as In Help' : 'Mark as In Help'}
                            </button>
                        )}
                    </>
                    )}
                {isHome && 
                <div>
                    <button className="contact-button" onClick={onContact}>Contact user</button>
                    <button className="contact-button">View task details</button>
                </div>
                }
            </div>
            {showVolunteerModal && (
                <VolunteerModal
                    postId={postId}
                    onComplete={handleCompleteWithVolunteer}
                    onClose={() => setShowVolunteerModal(false)}
                />
            )}
        </div>  
    )
}
