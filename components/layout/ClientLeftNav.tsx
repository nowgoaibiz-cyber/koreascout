'use client'

import { useEffect, useState } from 'react'

export type Section = { id: string; label: string; icon: React.ReactNode }

export interface ClientLeftNavProps {
  sections: Section[]
}

export function ClientLeftNav({ sections }: ClientLeftNavProps) {
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
      <div className="border-t border-[#E8E6E1] p-5 shrink-0">
        <p className="text-sm text-[#9E9C98]">KoreaScout</p>
      </div>
    </nav>
  )
}
