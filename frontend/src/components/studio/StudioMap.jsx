import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapBounds = ({ studios }) => {
  const map = useMap();

  useEffect(() => {
    if (studios.length > 0) {
      const bounds = studios.map(studio => [studio.latitude, studio.longitude]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [studios, map]);

  return null;
};

const StudioMap = ({ studios, selectedStudio, onStudioSelect }) => {
  const [mapCenter, setMapCenter] = useState([37.5665, 126.9780]); // Default to Seoul

  useEffect(() => {
    if (studios.length > 0) {
      const avgLat = studios.reduce((sum, s) => sum + s.latitude, 0) / studios.length;
      const avgLng = studios.reduce((sum, s) => sum + s.longitude, 0) / studios.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [studios]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-medium">
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds studios={studios} />
        
        {studios.map((studio) => (
          <Marker
            key={studio.id}
            position={[studio.latitude, studio.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => onStudioSelect(studio),
            }}
          >
            <Popup>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 min-w-[200px]"
              >
                <img
                  src={studio.thumbnailUrl || '/placeholder-studio.jpg'}
                  alt={studio.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-primary-900 mb-1">{studio.name}</h3>
                <p className="text-sm text-primary-600 mb-1">{studio.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-accent-600">
                    {studio.minPrice?.toLocaleString()}원~
                  </span>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{studio.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </motion.div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StudioMap;
