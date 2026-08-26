import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'

/**
 * Modal
 * @param {boolean}  isOpen    - Controls visibility
 * @param {Function} onClose   - Called when the modal should close
 * @param {string}   title     - Modal heading
 * @param {ReactNode} children - Modal body content
 * @param {string}   size      - 'sm' | 'md' | 'lg' (default 'md')
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-airbnb-light">
          <h2 className="text-lg font-semibold text-airbnb-dark">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={20} className="text-airbnb-dark" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
