import { useUser } from '../context/UserContext.jsx'
import { useState } from 'react'
import { 
    APIProvider, 
    Map, 
    AdvancedMarker, 
    InfoWindow
} from "@vis.gl/react-google-maps"

export default function CreateMap(){
    const [open, setOpen] = useState(false)
    const { user, setUser } = useUser(); 
    if (!user) {
        return <p>Loading...</p>
    }
    const position = { lat: Number(user.latitude), lng: Number(user.longitude)}

    return (
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
            <div style={{height: "100%", width: "100%", borderRadius: "12px"}}>
                <Map zoom={14} center={position} mapId={import.meta.env.VITE_MAP_ID}>
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