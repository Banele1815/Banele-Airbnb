import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getListing, updateListing } from '../services/listingService'
import { uploadImages } from '../services/adminService'
import useRequireAuth from '../hooks/useRequireAuth'

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Studio', 'Farm']
const CATEGORIES = ['Beachfront', 'Cabins', 'Amazing views', 'Tiny homes', 'Farms', 'Luxury', 'Pools', 'Countryside']
const AMENITIES_LIST = [
  'WiFi', 'TV', 'Kitchen', 'Washing machine', 'Air conditioning', 'Heating',
  'Dedicated workspace', 'Pool', 'Hot tub', 'Gym', 'Parking', 'Pet-friendly',
]

export default function UpdateListing() {
  useRequireAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    title: '', description: '', location: '', pricePerNight: '',
    propertyType: 'Apartment', category: '', maxGuests: 1,
    bedrooms: 1, bathrooms: 1, amenities: [], photos: [],
    weeklyDiscount: 0, cleaningFee: 0, serviceFee: 0, occupancyTaxes: 0,
  })

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListing(id)
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          pricePerNight: data.pricePerNight || '',
          propertyType: data.propertyType || 'Apartment',
          category: data.category || '',
          maxGuests: data.maxGuests || 1,
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          amenities: data.amenities || [],
          photos: data.photos || [],
          weeklyDiscount: data.weeklyDiscount || 0,
          cleaningFee: data.cleaningFee || 0,
          serviceFee: data.serviceFee || 0,
          occupancyTaxes: data.occupancyTaxes || 0,
        })
      } catch (err) {
        setError('Failed to load listing.')
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  function handleChange(e) {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  function toggleAmenity(amenity) {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  function handlePhotoUrlInput(e) {
    const urls = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
    setFormData((prev) => ({ ...prev, photos: urls }))
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await uploadImages(files)
      setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...urls] }))
    } catch (err) {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(idx) {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }))
  }

  function validateStep() {
    if (step === 1 && (!formData.title || !formData.location)) {
      setError('Title and location are required.')
      return false
    }
    if (step === 2 && (!formData.pricePerNight || Number(formData.pricePerNight) < 1)) {
      setError('A valid price per night is required.')
      return false
    }
    setError('')
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep()) return
    setSaving(true)
    try {
      await updateListing(id, formData)
      navigate(`/listings/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-airbnb-gray animate-pulse">
        Loading listing…
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-airbnb-dark mb-2">Edit listing</h1>
      <p className="text-airbnb-gray text-sm mb-8">Update the details for your property.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s === step ? 'bg-airbnb-dark text-white' : s < step ? 'bg-airbnb-red text-white' : 'bg-gray-200 text-airbnb-gray'
            }`}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && <div className={`h-0.5 w-12 ${s < step ? 'bg-airbnb-red' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="text-sm text-airbnb-gray ml-2">Step {step} of 3</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Step 1: Basic info */}
        {step === 1 && (
          <>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-airbnb-dark mb-1">Title <span className="text-red-500">*</span></label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-airbnb-dark mb-1">Description</label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="input-field resize-none" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-airbnb-dark mb-1">Location <span className="text-red-500">*</span></label>
              <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} className="input-field" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-airbnb-dark mb-1">Property type</label>
                <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className="input-field">
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-airbnb-dark mb-1">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[{ name:'maxGuests',label:'Max guests',min:1},{ name:'bedrooms',label:'Bedrooms',min:0},{ name:'bathrooms',label:'Bathrooms',min:1}].map(({name,label,min})=>(
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-airbnb-dark mb-1">{label}</label>
                  <input id={name} name={name} type="number" min={min} value={formData[name]} onChange={handleChange} className="input-field" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Pricing, fees & amenities */}
        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="pricePerNight" className="block text-sm font-medium text-airbnb-dark mb-1">Price / night (R) <span className="text-red-500">*</span></label>
                <input id="pricePerNight" name="pricePerNight" type="number" min={1} value={formData.pricePerNight} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label htmlFor="weeklyDiscount" className="block text-sm font-medium text-airbnb-dark mb-1">Weekly discount (%)</label>
                <input id="weeklyDiscount" name="weeklyDiscount" type="number" min={0} max={100} value={formData.weeklyDiscount} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="cleaningFee" className="block text-sm font-medium text-airbnb-dark mb-1">Cleaning fee (R)</label>
                <input id="cleaningFee" name="cleaningFee" type="number" min={0} value={formData.cleaningFee} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="serviceFee" className="block text-sm font-medium text-airbnb-dark mb-1">Service fee (R)</label>
                <input id="serviceFee" name="serviceFee" type="number" min={0} value={formData.serviceFee} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="occupancyTaxes" className="block text-sm font-medium text-airbnb-dark mb-1">Occupancy taxes (R)</label>
                <input id="occupancyTaxes" name="occupancyTaxes" type="number" min={0} value={formData.occupancyTaxes} onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-airbnb-dark mb-3">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES_LIST.map((amenity) => (
                  <label key={amenity} className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer text-sm transition-colors ${
                    formData.amenities.includes(amenity) ? 'border-airbnb-dark bg-gray-50 font-medium' : 'border-gray-200 hover:border-gray-400'
                  }`}>
                    <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="sr-only" />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-airbnb-dark mb-1">Upload images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="block w-full text-sm text-airbnb-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-airbnb-red file:text-white hover:file:bg-rose-600 cursor-pointer"
              />
              {uploading && <p className="text-sm text-airbnb-gray mt-1">Uploading…</p>}
            </div>

            <div>
              <label htmlFor="photoUrls" className="block text-sm font-medium text-airbnb-dark mb-1">Or paste photo URLs (one per line)</label>
              <textarea
                id="photoUrls"
                rows={4}
                className="input-field resize-none font-mono text-sm"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.photos.join('\n')}
                onChange={handlePhotoUrlInput}
              />
            </div>

            {formData.photos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-airbnb-dark mb-2">{formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.photos.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="aspect-square object-cover rounded-xl border border-gray-200"
                        onError={(e) => { e.target.src = '/placeholder-home.jpg' }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                      {i === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">Cover</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <div className="flex justify-between pt-2">
          {step > 1 ? (
            <button type="button" onClick={() => { setError(''); setStep((s) => s - 1) }} className="btn-secondary">Back</button>
          ) : <div />}
          {step < 3 ? (
            <button type="button" onClick={() => { if (validateStep()) setStep((s) => s + 1) }} className="btn-primary">Next</button>
          ) : (
            <button type="submit" disabled={saving || uploading} className="btn-primary">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
