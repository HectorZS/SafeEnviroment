import './PostModal.css'
import Map from './MapPostModal'
import { useUser } from '../context/UserContext.jsx'


export default function PostModal({ onClose, post, onContact }) {
  const { user } = useUser();
  const dateObj = typeof post?.created_at === 'string' ? new Date(post?.created_at) : post?.created_ad;
  const formattedDate = dateObj?.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className='post-modal-overlay'>
      <div className='post-modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='post-header'>
          <button className='post-cancel' onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className='modal-body'>
          <div className='post-content'>
            <div className='post-text'>
              <h2>{post?.title}</h2>
              <div className='post-meta'>
                <span className='post-author'>By {post?.creator?.username}</span>
                <span className='post-date'>{formattedDate}</span>
                <span className='post-category'>{post?.category}</span>
              </div>
              <div className='post-details'>
                <div className='detail-item'>
                  <span className='detail-label'>Urgency:</span>
                  <span className={`detail-value urgency-${post?.urgency?.toLowerCase()}`}>
                {post?.urgency}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Status:</span>
                  <span className={`detail-value status-${post?.status?.toLowerCase()}`}>
                    {post?.status}
                  </span>
                </div>
              </div>
              <div className='post-description'>
                <h3>Description</h3>
                <p>{post?.description}</p>
              </div>
              {user && post.creator.user_id !== user.user_id && (
                <div className='location-info'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Located in <strong>{post?.creator?.address}</strong>, at <strong>{post?.distance.toFixed(2)}km</strong> from you</span>
                </div>
              )}
            </div>
            <div className='post-map-container'>
              <Map creator={post?.creator} />
            </div>
          </div>
        </div>
        <div className='post-footer'>
          {user && post.creator.user_id !== user.user_id && (
            <button className="contact-button" onClick={onContact}>
              <span>Contact user</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
  }





