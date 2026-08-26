import { forwardRef } from 'react'

/**
 * Input
 * Accessible, styled text input with optional label, helper text, and error state.
 *
 * @param {string}  label       - Label text
 * @param {string}  helperText  - Helper text displayed below the input
 * @param {string}  error       - Error message (shown in red, replaces helperText)
 * @param {string}  id          - Input id (auto-generated from name if omitted)
 */
const Input = forwardRef(function Input(
  { label, helperText, error, id, name, className = '', ...props },
  ref
) {
  const inputId = id || name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-airbnb-dark mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        aria-describedby={helperText || error ? `${inputId}-hint` : undefined}
        aria-invalid={!!error}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {(helperText || error) && (
        <p
          id={`${inputId}-hint`}
          className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-airbnb-gray'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
})

export default Input
