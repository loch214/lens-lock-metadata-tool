import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapDisplay = ({ lat, lng }) => {
    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-600 mt-4 relative z-0">
            <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[lat, lng]}>
                    <Popup>EVIDENCE FOUND</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
export default MapDisplay;