import './SelectAreaModal.css'
import { useState } from 'react'
import CreateMap from './CreateMap.jsx'

export default function SelectAreaModal({ onClose, onPostsLoad, filters}){
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState('noselectedposition');

  const handleBoundsSelect = async ({ location, placeTypes }) => {
    console.log(":O: ", location)
    try {
        const response = await fetch(`${import.meta.env.VITE_URL}/posts/by-location/${location}/${placeTypes}`, {
        credentials: 'include' })
        const data = await response.json()
        console.log("data: ", data)
        onPostsLoad(data, location)
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  return(
      <div className='area-modal-overlay'>
          <div className='area-search-modal'>
              <div className='area-search-title'>
                <h2>Search for city, state or street address</h2>
              </div>
              <div className='maps-results'>
                  <CreateMap onBoundsSelected={handleBoundsSelect} />
              </div>
              <div className='modal-actions'>
                  <button onClick={onClose}>Cancel</button>
              </div>
          </div>
      </div>
  )
}