'use client'

import { Lock } from 'lucide-react'
import { PRICING } from '@/src/config/pricing'
import { Button } from './Button'

export type PaywallTier = 'standard' | 'alpha'

export interface PaywallOverlayProps {
  tier: PaywallTier
  ctaText: string
  onUpgrade?: () => void
  children: React.ReactNode
  className?: string
}

export function PaywallOverlay({
  tier,
  ctaText,
  onUpgrade,
  children,
  className = '',
}: PaywallOverlayProps) {
  const ctaLabel =
    tier === 'alpha' ? `Go Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →` : `Go Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`

  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      <div className="blur-sm select-none pointer-events-none">
        {children}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 pointer-events-auto"
        aria-hidden
      >
        <Lock className="w-5 h-5 text-[#9E9C98] shrink-0" />
        <p className="text-sm font-semibold text-[#3D3B36]">{ctaText}</p>
        <Button variant="primary" size="sm" onClick={onUpgrade}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
