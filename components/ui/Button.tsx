'use client'

import { forwardRef } from 'react'

const variantClasses = {
  primary:
    'bg-[#16A34A] text-white font-semibold hover:bg-[#15803D] transition-colors disabled:opacity-50',
  secondary:
    'bg-[#F2F1EE] text-[#3D3B36] font-medium border border-[#E8E6E1] hover:bg-[#E8E6E1] transition-colors',
  ghost:
    'text-[#6B6860] font-medium hover:bg-[#F2F1EE] transition-colors',
  danger:
    'bg-[#DC2626] text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50',
} as const

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
} as const

export type ButtonVariant = keyof typeof variantClasses
export type ButtonSize = keyof typeof sizeClasses

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const base = 'rounded-md inline-flex items-center justify-center gap-2'
    const sizeClass = sizeClasses[size]
    const variantClass = variantClasses[variant]
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${base} ${sizeClass} ${variantClass} ${className}`.trim()}
        {...rest}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
