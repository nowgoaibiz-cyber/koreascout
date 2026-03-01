'use client'

import { TrendingUp } from 'lucide-react'

const variantClasses = {
  default:
    'inline-flex items-center bg-[#F2F1EE] border border-[#E8E6E1] rounded-full px-3 py-1 text-xs font-medium text-[#3D3B36]',
  trending:
    'inline-flex items-center gap-1.5 bg-[#DCFCE7] border border-[#BBF7D0] rounded-full px-3 py-1 text-xs font-medium text-[#16A34A]',
} as const

export type KeywordPillVariant = keyof typeof variantClasses

export interface KeywordPillProps {
  keyword: string
  variant?: KeywordPillVariant
  className?: string
}

export function KeywordPill({
  keyword,
  variant = 'default',
  className = '',
}: KeywordPillProps) {
  const variantClass = variantClasses[variant]
  return (
    <span
      className={`${variantClass} ${className}`.trim()}
      role="listitem"
    >
      {variant === 'trending' && <TrendingUp className="w-3 h-3 shrink-0" />}
      {keyword}
    </span>
  )
}
