import { useState } from 'react'
import './SelectAreaModal.css'
import CreateMap from './CreateMap.jsx'


export default function SelectAreaModal({ onClose, onBoundSet }) {
  const [selectedPlace, setSelectedPlace] = useState(null);


  const handleSubmit = () => {
    if (!selectedPlace?.geometry?.location) return;
    const location = selectedPlace.name;
    const placeTypes = selectedPlace.types || [];
    onBoundSet({ location, placeTypes });
  };


  return (
    <div className='area-modal-overlay'>
      <div className='area-modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='area-header'>
          <h2>Choose a Location</h2>
          <p>You can search and select a specific street, city or region to refine your feed results.</p>
        </div>
        <div className='area-map-section'>
          <CreateMap onPlaceChange={setSelectedPlace} />
        </div>
        <div className='area-footer'>
          <button className='area-cancel' onClick={onClose}>Cancel</button>
          <button className='area-submit' onClick={handleSubmit} disabled={!selectedPlace}>
            Search posts
          </button>
        </div>
      </div>
    </div>
  );
}





