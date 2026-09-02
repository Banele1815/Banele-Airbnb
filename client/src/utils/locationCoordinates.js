const KNOWN_LOCATIONS = [
  { match: 'clifton, cape town', lat: -33.9394, lng: 18.3778 },
  { match: 'green point, cape town', lat: -33.9083, lng: 18.4108 },
  { match: 'bo-kaap, cape town', lat: -33.9214, lng: 18.4145 },
  { match: 'v&a waterfront, cape town', lat: -33.9036, lng: 18.4199 },
  { match: 'stellenbosch, western cape', lat: -33.9321, lng: 18.8602 },
  { match: 'franschhoek, western cape', lat: -33.9107, lng: 19.1214 },
  { match: 'knysna, garden route', lat: -34.0363, lng: 23.0471 },
  { match: 'plettenberg bay, garden route', lat: -34.0527, lng: 23.3716 },
  { match: 'sandton, johannesburg', lat: -26.1076, lng: 28.0567 },
  { match: 'umhlanga, kwazulu-natal', lat: -29.7268, lng: 31.0839 },
  { match: 'drakensberg, kwazulu-natal', lat: -29.0, lng: 29.4 },
  { match: 'waterberg, limpopo', lat: -24.05, lng: 28.5 },
  { match: 'cape town', lat: -33.9249, lng: 18.4241 },
  { match: 'johannesburg', lat: -26.2041, lng: 28.0473 },
  { match: 'durban', lat: -29.8587, lng: 31.0218 },
  { match: 'pretoria', lat: -25.7479, lng: 28.2293 },
]

const DEFAULT_COORDS = { lat: -28.4793, lng: 24.6727 }

export function getCoordinatesForLocation(location) {
  if (!location) return DEFAULT_COORDS

  const normalised = location.toLowerCase().trim()
  const found = KNOWN_LOCATIONS.find((entry) => normalised.includes(entry.match))
  const base = found || DEFAULT_COORDS

  const jitter = hashJitter(location)
  return {
    lat: base.lat + jitter.dLat,
    lng: base.lng + jitter.dLng,
  }
}

function hashJitter(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const dLat = ((hash % 1000) / 1000) * 0.016 - 0.008
  const dLng = (((hash >> 8) % 1000) / 1000) * 0.016 - 0.008
  return { dLat, dLng }
}