"use client";

import { useCallback, useEffect, useState } from "react";
import { Handshake, MessageCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_OPTIONS = [
  {
    Icon: Handshake,
    label: "Partnership Inquiry",
    email: "partners@koreascout.com",
  },
  {
    Icon: MessageCircle,
    label: "General Support",
    email: "support@koreascout.com",
  },
] as const;

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setCopiedEmail(null);
  }, [isOpen]);

  const handleCopy = useCallback(async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch {
      // Clipboard API may be unavailable in some contexts
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md bg-[#1A1916] border border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/60 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 id="contact-modal-title" className="text-2xl font-bold text-white mb-2">
            Get in Touch
          </h2>
          <p className="text-white/60 text-sm">Choose how to reach us:</p>
        </div>

        <div className="space-y-4">
          {CONTACT_OPTIONS.map((option) => {
            const isCopied = copiedEmail === option.email;

            return (
              <div
                key={option.email}
                className="rounded-lg border border-white/10 bg-black/40 p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <option.Icon className="w-5 h-5 shrink-0 text-emerald-500" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/80">{option.label}</p>
                    <p className="text-white text-sm mt-1 break-all">{option.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(option.email)}
                  className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  {isCopied ? "Copied!" : "Copy Email"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CONTACT_LINK_CLASSNAME =
  "text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A] text-left";

export function ContactFooterLink() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={CONTACT_LINK_CLASSNAME}
      >
        Contact
      </button>
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
