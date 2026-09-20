import React from 'react'
import './Input.css'

import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon,
  fullWidth = false,
  className = '',
  ...props 
}, ref) => {
  const classes = [
    'input-wrapper',
    fullWidth && 'input-full-width',
    error && 'input-error',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input ref={ref} className="input-field" {...props} />
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
})

export default Input
