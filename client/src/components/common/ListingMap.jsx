import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../../utils/leafletIcons'
import { getCoordinatesForLocation } from '../../utils/locationCoordinates'

export default function ListingMap({ location }) {
  const { lat, lng } = getCoordinatesForLocation(location)

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 h-[400px]">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={[lat, lng]}
          radius={600}
          pathOptions={{ color: '#FF385C', fillColor: '#FF385C', fillOpacity: 0.15 }}
        />
      </MapContainer>
    </div>
  )
}