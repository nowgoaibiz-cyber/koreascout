"use client";

import Link from "next/link";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/LogoutButton";
import { PRICING } from "@/src/config/pricing";
import { Logo } from "@/components/Logo";

const NAV_TRANSITION =
  "color 0.4s cubic-bezier(0.4,0,0.2,1), background-color 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.4s cubic-bezier(0.4,0,0.2,1)";

function getGhostClass(isTransparent: boolean) {
  return `rounded-md border border-solid border-transparent px-3.5 py-2 text-sm font-semibold tracking-tight sm:text-base ${
    isTransparent
      ? "text-white hover:bg-white/10 hover:text-white"
      : "text-[#0A0908] hover:bg-[#F2F1EE] hover:text-[#0A0908]"
  }`;
}

function getPrimaryClass(isTransparent: boolean) {
  return `rounded-md border border-solid px-5 py-2 text-sm font-semibold tracking-tight sm:text-base ${
    isTransparent
      ? "border-white/20 bg-transparent text-white hover:bg-white/10"
      : "border-[#0A0908]/20 bg-[#16A34A] text-white hover:bg-[#15803D]"
  }`;
}

function MobileMenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function HeaderNavClient({
  user,
  tier,
  isTransparent,
}: {
  user: User | null;
  tier: string;
  isTransparent: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ghostClass = getGhostClass(isTransparent);
  const primaryClass = getPrimaryClass(isTransparent);

  const transitionStyle = { transition: NAV_TRANSITION };

  if (!user) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <MobileMenuIcon />
          </button>
          <div className="hidden items-center gap-2 md:flex md:gap-3">
            <Link href="/login" className={ghostClass} style={transitionStyle} title="Sign in to view weekly reports">
              Weekly Report
            </Link>
            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
              Pricing
            </Link>
          </div>
          <div className="hidden md:block">
            <Link href="/login" className={primaryClass} style={transitionStyle}>
              Login
            </Link>
          </div>
        </div>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#F8F7F4] md:hidden flex flex-col"
            style={{
              animation: "slideDown 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
              backgroundColor: "#F8F7F4",
              isolation: "isolate",
            }}
          >
            <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

            {/* Header row */}
            <div className="flex items-center justify-between px-6 h-[80px] border-b border-[#E8E6E1] shrink-0">
              <Logo className="h-8 w-auto object-contain" style={{ filter: "none" }} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#1A1916]"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col px-6 pt-8 gap-0">
              <Link href="/login" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={() => setMobileMenuOpen(false)}>Weekly Report</Link>
              <Link href="/pricing" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/login" className="block py-5 text-2xl font-black text-[#16A34A] border-b border-[#E8E6E1] tracking-tight" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 md:hidden"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <MobileMenuIcon />
        </button>
        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <Link href="/weekly" className={ghostClass} style={transitionStyle}>
            Weekly Report
          </Link>
          {tier === "free" && (
            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
              Pricing
            </Link>
          )}
          {tier === "standard" && (
            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
              Upgrade
            </Link>
          )}
          <Link href="/account" className={ghostClass} style={transitionStyle}>
            Account
          </Link>
        </div>
        <div className="hidden md:block">
          <LogoutButton className={primaryClass} style={transitionStyle} />
        </div>
      </div>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#F8F7F4] md:hidden flex flex-col"
          style={{
            animation: "slideDown 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
            backgroundColor: "#F8F7F4",
            isolation: "isolate",
          }}
        >
          <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

          {/* Header row */}
          <div className="flex items-center justify-between px-6 h-[80px] border-b border-[#E8E6E1] shrink-0">
            <Logo className="h-8 w-auto object-contain" style={{ filter: "none" }} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#1A1916]"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col px-6 pt-8 gap-0">
            <Link
              href="/weekly"
              className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Weekly Report
            </Link>
            {tier === "free" && (
              <Link
                href="/pricing"
                className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            )}
            {tier === "standard" && (
              <Link
                href="/pricing"
                className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
                onClick={() => setMobileMenuOpen(false)}
              >
                Upgrade
              </Link>
            )}
            <Link
              href="/account"
              className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Account
            </Link>
            <LogoutButton
              className="block w-full text-left py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
            />
          </div>
        </div>
      )}
    </div>
  );
}
