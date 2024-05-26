import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import stoppageImage from '../assets/busstop.png';
import './VehicleMap.css';


// Create a custom icon for stoppages
const stoppageIcon = new L.Icon({
  iconUrl: stoppageImage,
  iconSize: [32, 32], // Adjust size as needed
  iconAnchor: [16, 32], // Adjust anchor as needed
  popupAnchor: [0, -32], // Adjust popup anchor as needed
});

const VehicleMap = ({ gpsData, stoppages }) => {
  
  const position = [gpsData[0].latitude, gpsData[0].longitude];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {gpsData.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]}>
          <Popup>
            Speed: {point.speed} km/h<br />
            Odometer: {point.odometer} km<br />
            Event Time: {new Date(parseFloat(point.eventGeneratedTime)).toLocaleString()}
          </Popup>
        </Marker>
      ))}
      {stoppages.map((stop, index) => (
        <Marker key={`stop-${index}`} position={[stop.data.latitude, stop.data.longitude]} icon={stoppageIcon}>
          <Popup>
            Reach Time: {stop.reachTime.toLocaleString()}<br />
            End Time: {stop.endTime ? stop.endTime.toLocaleString() : 'N/A'}<br />
            stoppage Duration: {stop.duration} minutes
          </Popup>
        </Marker>
      ))}
      <Polyline positions={gpsData.map(point => [point.latitude, point.longitude])} />
    </MapContainer>
  );
};

export default VehicleMap;
