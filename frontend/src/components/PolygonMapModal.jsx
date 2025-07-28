import { useState } from 'react'
import './PolygonMapModal.css'
import PolygonMap from './PolygonMap.jsx'

export default function PolygonMapModal({ onClose, userId, onPolygonSelected }) {
  const [selectedPlace, setSelectedPlace] = useState(false);
  const [usersInPolygon, setUsersInPolygon] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if(!usersInPolygon.length) return 
    setIsLoading(true)
    try {
        const userIds = usersInPolygon.map(user => user.user_id)
        await onPolygonSelected({ users: userIds })
        onClose()
    } catch (error) {
        console.error("Error handling polygon selection: ", error)
    } finally {
        setIsLoading(false)
    }
  };


  return (
    <div className='polygon-modal-overlay'>
      <div className='polygon-modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='polygon-header'>
          <h2>Choose a location based on a polygon</h2>
          <p>You can search and select a specific area</p>
        </div>
        <div className='polygon-map-section'>
          <PolygonMap onUsersInPolygon={setUsersInPolygon} userId={userId} selectedPlace={setSelectedPlace}/>
        </div>
        {
            !usersInPolygon.length > 0 && selectedPlace && (
                <div>There are no users in the area selected</div>
            )
        }
        <div className='polygon-footer'>
          <button className='polygon-cancel' onClick={onClose}>Cancel</button>
          <button className='polygon-submit' onClick={handleSubmit} disabled={!usersInPolygon.length > 0}>
           {isLoading ? "Loading..." : "Search posts"}
          </button>
        </div>
      </div>
    </div>
  );
}





