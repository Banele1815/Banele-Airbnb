/**
 * Button
 * @param {'primary'|'secondary'|'danger'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading  - Shows spinner and disables the button
 * @param {boolean} fullWidth
 * @param {string} type      - HTML button type (default 'button')
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  const variants = {
    primary: 'bg-airbnb-red text-white hover:bg-rose-600 focus-visible:ring-airbnb-red',
    secondary: 'border border-airbnb-dark text-airbnb-dark hover:bg-gray-50 focus-visible:ring-airbnb-dark',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    ghost: 'text-airbnb-dark hover:bg-gray-100 focus-visible:ring-gray-400',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
