'use client'

const baseClasses =
  'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full'

const variantClasses = {
  default: 'bg-[#F2F1EE] text-[#6B6860]',
  success: 'bg-[#DCFCE7] text-[#16A34A]',
  warning: 'bg-[#FEF3C7] text-[#D97706]',
  danger: 'bg-[#FEE2E2] text-[#DC2626]',
  info: 'bg-[#DBEAFE] text-[#2563EB]',
  'tier-free': 'bg-[#F2F1EE] text-[#6B6860]',
  'tier-standard': 'bg-[#DBEAFE] text-[#2563EB]',
  'tier-alpha': 'bg-[#DCFCE7] text-[#16A34A]',
} as const

export type BadgeVariant = keyof typeof variantClasses

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  className?: string
  children?: React.ReactNode
}

export function Badge({
  variant = 'default',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const variantClass = variantClasses[variant]
  return (
    <span
      className={`${baseClasses} ${variantClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  )
}
