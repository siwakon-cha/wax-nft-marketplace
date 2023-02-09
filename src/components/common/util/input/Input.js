import React from 'react'
import cn from 'classnames'

export default function Input(
  { type, name, value, className, placeholder, checked, required, disabled, onChange : onChangeCallback}
) {

  const onChange = (e) => {
    onChangeCallback(e)
  }

  return (
    <input
      className={cn(
        'rounded-3xl p-3',
        'focus:outline-none focus-visible:ring-inset',
        'focus-visible:ring-secondary',
        'text-neutral bg-bluet',
        { 'cursor-not-allowed': disabled },
        className
      )}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      checked={checked}
      required={required}
      disabled={disabled}
      onChange={onChange}
    />
  )
}