/**
 * Spinner
 * Full-page or inline loading indicator.
 * @param {boolean} fullPage - Centers the spinner in the viewport
 * @param {string}  size     - Tailwind size class for the spinner (default 'h-10 w-10')
 */
export default function Spinner({ fullPage = false, size = 'h-10 w-10' }) {
  const spinner = (
    <div
      role="status"
      aria-label="Loading"
      className={`${size} animate-spin rounded-full border-4 border-airbnb-light border-t-airbnb-red`}
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-10">{spinner}</div>
}
