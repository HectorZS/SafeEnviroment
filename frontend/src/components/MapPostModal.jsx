import { useUser } from '../context/UserContext.jsx'
import { useState } from 'react'
import { 
    APIProvider, 
    Map, 
    AdvancedMarker, 
    InfoWindow
} from "@vis.gl/react-google-maps"

export default function MapPostModal({ creator }){
    const [open, setOpen] = useState(false)
   
    const position = creator ? { lat: Number(creator.latitude), lng: Number(creator.longitude)} : {lat: 0, lng: 0}
    return (
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
            <div style={{height: "100%", width: "100%" }}>
                <Map zoom={17} center={position} mapId={import.meta.env.VITE_MAP_ID}>
                    <AdvancedMarker position={position} onClick={() => setOpen(true)}></AdvancedMarker>
                    {open && (
                        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
                            <p>My home</p>
                        </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    )
}