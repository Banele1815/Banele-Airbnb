import { useState } from 'react'
import { FiStar } from 'react-icons/fi'

/**
 * StarRating
 * @param {number}   value     - Current rating (1-5)
 * @param {Function} onChange  - Called with new rating when user clicks (omit for readonly)
 * @param {boolean}  readonly  - Render as display only
 * @param {number}   size      - Icon size in px (default 20)
 */
export default function StarRating({ value = 0, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0)

  const effective = hovered || value

  return (
    <div
      className="flex items-center gap-0.5"
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
        >
          <FiStar
            size={size}
            className={
              star <= effective
                ? 'fill-airbnb-red text-airbnb-red'
                : 'fill-none text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}
