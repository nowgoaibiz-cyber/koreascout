'use client'

import { useEffect, useState } from 'react'

export type Section = { id: string; label: string; icon: React.ReactNode }

export type NavTier = 'free' | 'standard' | 'alpha'

export interface ClientLeftNavProps {
  sections: Section[]
  /** When provided, shows a User Profile block at the bottom instead of placeholder. */
  userEmail?: string | null
  tier?: NavTier
}

function truncateEmail(email: string, maxLen = 24): string {
  if (email.length <= maxLen) return email
  const local = email.split('@')[0] ?? ''
  const domain = email.split('@')[1] ?? ''
  if (local.length + domain.length + 1 <= maxLen) return email
  const keep = maxLen - domain.length - 4 // "...@"
  return keep > 0 ? `${local.slice(0, keep)}...@${domain}` : `...@${domain}`
}

export function ClientLeftNav({ sections, userEmail, tier }: ClientLeftNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return
        const byTop = [...intersecting].sort(
          (a, b) =>
            (a.target as HTMLElement).getBoundingClientRect().top -
            (b.target as HTMLElement).getBoundingClientRect().top
        )
        setActiveId(byTop[0].target.id)
      },
      {
        threshold: 0.1,
        rootMargin: '-15% 0px -45% 0px',
      }
    )

    const ids = sections.map((s) => s.id)
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed left-0 top-[72px] h-[calc(100vh-4.5rem)] w-56 z-40 bg-[#F8F7F4] border-r border-[#E8E6E1] flex flex-col"
      aria-label="Page sections"
    >
      <div className="flex-1 overflow-y-auto py-5">
        {sections.map(({ id, label, icon }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleClick(id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-base rounded-lg mx-2 text-left transition-colors ${
                isActive
                  ? 'font-semibold text-[#16A34A] bg-[#DCFCE7]'
                  : 'text-[#6B6860] hover:bg-[#F2F1EE] hover:text-[#1A1916]'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <div className="border-t border-[#E8E6E1] bg-[#F2F1EE]/80 p-4 shrink-0">
        {userEmail != null && userEmail !== '' ? (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: '#16A34A' }}
              aria-hidden
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <p className="text-sm font-medium text-[#1A1916] truncate" title={userEmail}>
                {truncateEmail(userEmail)}
              </p>
              {tier != null && (
                <span
                  className={
                    tier === 'alpha'
                      ? 'w-fit rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#16A34A]/10 text-[#16A34A]'
                      : 'w-fit rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-gray-100 text-gray-600 border border-gray-200'
                  }
                >
                  {tier === 'alpha' ? 'Alpha' : tier === 'standard' ? 'Standard' : 'Free'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#9E9C98]">KoreaScout</p>
        )}
      </div>
    </nav>
  )
}
