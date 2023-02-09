import React from 'react'
import cn from 'classnames'

export default function Button(
  { children, className, type, disabled, onClick}
) {
  return (
    <button
      className={cn(
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-inset',
        'focus-visible:ring-primary w-24 h-8',
        'transition-opacity duration-200',
        'opacity-75 hover:opacity-100',
        'cursor-pointer',
        { 'cursor-not-allowed': disabled },
        className
      )}
      type={type || "button"}
      disabled={disabled}
      onClick={onClick}
    ><div className={'m-auto'}>
      {children}
    </div>
    </button>
  )
}