import './SelectAreaModal.css'
import CreateMap from './CreateMap.jsx'

export default function SelectAreaModal({ onClose, onBoundSet }){
   
  return(
      <div className='area-modal-overlay'>
          <div className='area-search-modal'>
              <div className='area-search-title'>
                <h2>Search for city, state or street address</h2>
              </div>
              <div className='maps-results'>
                  <CreateMap onBoundsSelected={onBoundSet} />
              </div>
              <div className='modal-actions'>
                  <button onClick={onClose}>Cancel</button>
              </div>
          </div>
      </div>
  )
}