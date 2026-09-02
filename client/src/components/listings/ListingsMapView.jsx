import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../../utils/leafletIcons'
import { getCoordinatesForLocation } from '../../utils/locationCoordinates'

function priceIcon(price) {
  return L.divIcon({
    className: 'listing-price-marker',
    html: `<div style="
      background:#222; color:#fff; font-size:12px; font-weight:600;
      padding:6px 10px; border-radius:999px; white-space:nowrap;
      box-shadow:0 1px 4px rgba(0,0,0,0.3); border:1px solid #fff;
    ">R${Math.round(price).toLocaleString()}</div>`,
    iconSize: null,
    iconAnchor: [24, 16],
  })
}

const SOUTH_AFRICA_CENTER = [-28.4793, 24.6727]

export default function ListingsMapView({ listings }) {
  const navigate = useNavigate()

  const points = listings
    .filter((l) => l.location)
    .map((l) => ({ listing: l, ...getCoordinatesForLocation(l.location) }))

  const center = points.length
    ? [points[0].lat, points[0].lng]
    : SOUTH_AFRICA_CENTER

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 h-full min-h-[400px]">
      <MapContainer
        center={center}
        zoom={points.length ? 11 : 5}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map(({ listing, lat, lng }) => (
          <Marker
            key={listing._id}
            position={[lat, lng]}
            icon={priceIcon(listing.pricePerNight)}
            eventHandlers={{ click: () => navigate(`/listings/${listing._id}`) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-airbnb-dark">{listing.title}</p>
                <p className="text-airbnb-gray">{listing.location}</p>
                <p className="mt-1 font-medium">R{listing.pricePerNight?.toLocaleString()} / night</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}