import { useEffect, useRef, useState } from 'react';

const PolygonMap = ({ onUsersInPolygon, userId, selectedPlace }) => {
    const mapRef = useRef(null);
    const polygonRef = useRef(null);
    const [users, setUsers] = useState([]); // Store all users
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/get-users/${userId}`); // fetch all users in the app
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
    fetchUsers();
  }, []);

    useEffect(() => {
        if (!window.google || !users.length) return;

        const map = new google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 }, // Default center
            zoom: 2 // Default zoom
        });

        const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon'] // Only allow polygon drawing
            },
            polygonOptions: {
            editable: true,
            draggable: true,
            fillColor: '#1E90FF',
            fillOpacity: 0.3,
            strokeWeight: 2,
            clickable: false
            }
        });

        drawingManager.setMap(map);
        setMapLoaded(true);

        google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
            if (polygonRef.current) {
                polygonRef.current.setMap(null); // Remove previous polygon
            }
            polygonRef.current = polygon;
            findUsersInPolygon(polygon);
            polygon.getPath().addListener('set_at', () => findUsersInPolygon(polygon)); // edits in the poligon
            polygon.getPath().addListener('insert_at', () => findUsersInPolygon(polygon));
        });

        return () => {
            drawingManager.setMap(null);
            if (polygonRef.current) {
            polygonRef.current.setMap(null);
            }
        };
    }, [users]); 

    useEffect(() => {
        if (window.google) {
            setMapLoaded(true); 
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAPS_API_KEY}&libraries=drawing,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapLoaded(true);

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

  // Find users within the polygon
    const findUsersInPolygon = (polygon) => {
        const usersInPolygon = users.filter(user => {
            return google.maps.geometry.poly.containsLocation( // containsLocation() function
                new google.maps.LatLng(user.latitude, user.longitude),
                polygon
            );
        });

        if (onUsersInPolygon) {
            onUsersInPolygon(usersInPolygon);
            selectedPlace(true)
        }
    };

    if (!mapLoaded) {
        return <div>Loading map...</div>;
    }

    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default PolygonMap;


