'use client'

const variantClasses = {
  default:
    'bg-white rounded-xl border border-[#E8E6E1] p-6 shadow-[0_2px_8px_0_rgb(26_25_22/0.08)]',
  elevated:
    'bg-white rounded-xl border border-[#E8E6E1] p-6 shadow-[0_8px_24px_-4px_rgb(26_25_22/0.12)]',
  subcard:
    'bg-[#F2F1EE] rounded-lg border border-[#E8E6E1] p-4',
  accent:
    'bg-white rounded-xl border border-[#E8E6E1] border-l-4 border-l-[#16A34A] p-6 shadow-[0_2px_8px_0_rgb(26_25_22/0.08)]',
} as const

export type CardVariant = keyof typeof variantClasses

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  className?: string
  children?: React.ReactNode
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...rest
}: CardProps) {
  const variantClass = variantClasses[variant]
  return (
    <div
      className={`${variantClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  )
}
