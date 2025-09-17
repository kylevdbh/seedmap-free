import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon to ensure markers display correctly
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function AddMarkerOnClick({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

export default function App() {
  const [markers, setMarkers] = useState([]);

  // Load markers from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem('markers');
    if (saved) {
      try {
        setMarkers(JSON.parse(saved));
      } catch {
        // ignore parsing errors
      }
    }
  }, []);

  // Save markers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  const handleAddMarker = (latlng) => {
    const name = prompt('Enter marker name:', '');
    if (name === null || name.trim() === '') {
      return;
    }
    const note = prompt('Enter marker note (optional):', '');
    setMarkers((prev) => [
      ...prev,
      {
        id: Date.now(),
        position: [latlng.lat, latlng.lng],
        name: name.trim(),
        note: note?.trim() || '',
      },
    ]);
  };

  const handleDeleteMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div style={{ height: '100%' }}>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%' }}>
      {/* OpenStreetMap tile layer: you could replace this with any tile source you prefer */}
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnClick onAdd={handleAddMarker} />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={markerIcon}>
            <Popup>
              <div>
                <strong>{marker.name}</strong>
                {marker.note && <p>{marker.note}</p>}
                <button onClick={() => handleDeleteMarker(marker.id)}>Delete</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
