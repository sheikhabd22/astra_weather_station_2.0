import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Recenter({ lat, lon }) {
  const map = useMap();
  map.setView([lat, lon], map.getZoom(), { animate: true });
  return null;
}

export default function RealtimeMap({ latitude, longitude }) {
  const lat = latitude ?? 17.3850;
  const lon = longitude ?? 78.4867;
  return (
    <div className="realtime-map glass-bg">
      <div className="section-title">Real-time Map</div>
      <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom style={{ height: 260, width: '100%', borderRadius: 10, overflow: 'hidden' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} />
        <Circle center={[lat, lon]} radius={250} pathOptions={{ color: '#1f8ac0', fillOpacity: 0.15 }} />
        <Recenter lat={lat} lon={lon} />
      </MapContainer>
    </div>
  );
}


