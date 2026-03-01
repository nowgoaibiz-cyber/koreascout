'use client'

import { forwardRef } from 'react'

const inputBaseClasses =
  'bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none placeholder:text-[#C4C2BE] transition-colors w-full'
const inputErrorClasses =
  'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
const inputDisabledClasses = 'bg-[#F2F1EE] text-[#9E9C98] cursor-not-allowed'
const labelClasses =
  'text-xs font-medium text-[#9E9C98] uppercase tracking-wider'
const hintClasses = 'text-xs text-[#9E9C98]'
const errorClasses = 'text-xs text-[#DC2626]'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled'> {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      disabled = false,
      className = '',
      id: idProp,
      ...rest
    },
    ref
  ) => {
    const id = idProp ?? `input-${Math.random().toString(36).slice(2, 9)}`
    const inputClasses = [
      inputBaseClasses,
      error ? inputErrorClasses : '',
      disabled ? inputDisabledClasses : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="flex flex-col gap-1.5">
        {label != null && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={inputClasses}
          {...rest}
        />
        {hint != null && (
          <p id={`${id}-hint`} className={hintClasses}>
            {hint}
          </p>
        )}
        {error != null && (
          <p id={`${id}-error`} className={errorClasses} role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled'> {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
  rows?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      disabled = false,
      className = '',
      id: idProp,
      rows = 3,
      ...rest
    },
    ref
  ) => {
    const id =
      idProp ?? `textarea-${Math.random().toString(36).slice(2, 9)}`
    const textareaClasses = [
      inputBaseClasses,
      'resize-none',
      error ? inputErrorClasses : '',
      disabled ? inputDisabledClasses : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="flex flex-col gap-1.5">
        {label != null && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={textareaClasses}
          {...rest}
        />
        {hint != null && (
          <p id={`${id}-hint`} className={hintClasses}>
            {hint}
          </p>
        )}
        {error != null && (
          <p id={`${id}-error`} className={errorClasses} role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
