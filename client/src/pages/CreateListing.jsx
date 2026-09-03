import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createListing } from '../services/listingService'
import { uploadImages } from '../services/adminService'

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Studio', 'Farm']
const CATEGORIES = ['Beachfront', 'Cabins', 'Amazing views', 'Tiny homes', 'Farms', 'Luxury', 'Pools', 'Countryside']
const AMENITIES_LIST = [
  'WiFi', 'TV', 'Kitchen', 'Washing machine', 'Air conditioning', 'Heating',
  'Dedicated workspace', 'Pool', 'Hot tub', 'Gym', 'Parking', 'Pet-friendly',
]

export default function CreateListing() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    propertyType: 'Apartment',
    category: '',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    photos: [],
    weeklyDiscount: 0,
    cleaningFee: 0,
    serviceFee: 0,
    occupancyTaxes: 0,
  })

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

  function handlePhotoInput(e) {
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

  function validateStep() {
    if (step === 1 && (!formData.title || !formData.location || !formData.propertyType)) {
      setError('Please fill in all required fields.')
      return false
    }
    if (step === 2 && (!formData.pricePerNight || formData.pricePerNight < 1)) {
      setError('Please enter a valid price per night.')
      return false
    }
    setError('')
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep()) return
    setLoading(true)
    try {
      const listing = await createListing(formData)
      navigate(`/listings/${listing._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-airbnb-dark mb-2">List your space</h1>
      <p className="text-airbnb-gray text-sm mb-8">Fill in the details about your property.</p>

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
              <label htmlFor="title" className="block text-sm font-medium text-airbnb-dark mb-1">
                Listing title <span className="text-red-500">*</span>
              </label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange}
                className="input-field" placeholder="e.g. Cosy apartment in Cape Town" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-airbnb-dark mb-1">Description</label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange}
                className="input-field resize-none" placeholder="Describe your space..." />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-airbnb-dark mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input id="location" name="location" type="text" value={formData.location} onChange={handleChange}
                className="input-field" placeholder="e.g. Cape Town, South Africa" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-airbnb-dark mb-1">
                  Property type <span className="text-red-500">*</span>
                </label>
                <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange}
                  className="input-field">
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-airbnb-dark mb-1">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'maxGuests', label: 'Max guests', min: 1 },
                { name: 'bedrooms', label: 'Bedrooms', min: 0 },
                { name: 'bathrooms', label: 'Bathrooms', min: 1 },
              ].map(({ name, label, min }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-airbnb-dark mb-1">{label}</label>
                  <input id={name} name={name} type="number" min={min} value={formData[name]} onChange={handleChange}
                    className="input-field" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Pricing & amenities */}
        {step === 2 && (
          <>
            <div>
              <label htmlFor="pricePerNight" className="block text-sm font-medium text-airbnb-dark mb-1">
                Price per night (R) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-dark font-medium">R</span>
                <input id="pricePerNight" name="pricePerNight" type="number" min={1} value={formData.pricePerNight}
                  onChange={handleChange} className="input-field pl-8" placeholder="500" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weeklyDiscount" className="block text-sm font-medium text-airbnb-dark mb-1">Weekly discount (%)</label>
                <input id="weeklyDiscount" name="weeklyDiscount" type="number" min={0} max={100} value={formData.weeklyDiscount}
                  onChange={handleChange} className="input-field" placeholder="0" />
              </div>
              <div>
                <label htmlFor="cleaningFee" className="block text-sm font-medium text-airbnb-dark mb-1">Cleaning fee (R)</label>
                <input id="cleaningFee" name="cleaningFee" type="number" min={0} value={formData.cleaningFee}
                  onChange={handleChange} className="input-field" placeholder="0" />
              </div>
              <div>
                <label htmlFor="serviceFee" className="block text-sm font-medium text-airbnb-dark mb-1">Service fee (R)</label>
                <input id="serviceFee" name="serviceFee" type="number" min={0} value={formData.serviceFee}
                  onChange={handleChange} className="input-field" placeholder="0" />
              </div>
              <div>
                <label htmlFor="occupancyTaxes" className="block text-sm font-medium text-airbnb-dark mb-1">Occupancy taxes (R)</label>
                <input id="occupancyTaxes" name="occupancyTaxes" type="number" min={0} value={formData.occupancyTaxes}
                  onChange={handleChange} className="input-field" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-airbnb-dark mb-3">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES_LIST.map((amenity) => (
                  <label key={amenity} className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer transition-colors text-sm ${
                    formData.amenities.includes(amenity)
                      ? 'border-airbnb-dark bg-gray-50 font-medium'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}>
                    <input type="checkbox" checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)} className="sr-only" />
                    <span>{amenity}</span>
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
              <label htmlFor="photos" className="block text-sm font-medium text-airbnb-dark mb-1">
                Or paste photo URLs (one per line)
              </label>
              <textarea
                id="photos"
                rows={6}
                className="input-field resize-none font-mono text-sm"
                placeholder={`https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-...`}
                defaultValue={formData.photos.join('\n')}
                onChange={handlePhotoInput}
              />
              <p className="text-xs text-airbnb-gray mt-1">First photo is the cover photo.</p>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {formData.photos.slice(0, 6).map((url, i) => (
                  <img key={i} src={url} alt={`Preview ${i + 1}`}
                    className="aspect-square object-cover rounded-xl border border-gray-200"
                    onError={(e) => { e.target.src = '/placeholder-home.svg' }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-2">
          {step > 1 ? (
            <button type="button" onClick={() => { setError(''); setStep((s) => s - 1) }} className="btn-secondary">
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button type="button" onClick={() => { if (validateStep()) setStep((s) => s + 1) }} className="btn-primary">
              Next
            </button>
          ) : (
              <button type="submit" disabled={loading || uploading} className="btn-primary">
              {loading ? 'Publishing...' : 'Publish listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
