"use client";

import { useState, useCallback } from "react";

export type ContactPillProps = {
  icon: string;
  label: string;
  value: string;
  action: "copy" | "link";
};

const pillClass =
  "bg-[#F8F7F4] border border-[#E8E6E1] hover:border-[#BBF7D0] text-sm text-[#6B6860] px-4 py-2 rounded-full flex items-center gap-2 w-full transition-colors";

export function ContactPill({ icon, label, value, action }: ContactPillProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [value]);

  if (action === "copy") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={pillClass + " text-left"}
      >
        <span aria-hidden>{icon}</span>
        <span className="truncate flex-1 min-w-0">
          {copied ? "✅ Copied!" : label}
        </span>
      </button>
    );
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className={pillClass}
    >
      <span aria-hidden>{icon}</span>
      <span className="truncate flex-1 min-w-0">{label}</span>
    </a>
  );
}

interface ContactCardProps {
  name?: string | null;
  corporateScale?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  homepage?: string | null;
  naverLink?: string | null;
  wholesaleLink?: string | null;
}

export function ContactCard({
  name,
  corporateScale,
  contactEmail,
  contactPhone,
  homepage,
  naverLink,
  wholesaleLink,
}: ContactCardProps) {
  const hasAnyContact =
    contactEmail || contactPhone || homepage || naverLink || wholesaleLink;

  if (!name && !corporateScale && !hasAnyContact) {
    return null;
  }

  return (
    <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4 flex flex-col gap-4">
      {(name || corporateScale) && (
        <div>
          {name && (
            <p className="text-xl font-bold text-[#1A1916] flex items-center gap-2">
              <span aria-hidden>🏭</span>
              <span>{name}</span>
            </p>
          )}
          {corporateScale && (
            <span className="inline-block mt-1 text-xs bg-[#F2F1EE] text-[#6B6860] px-2 py-0.5 rounded-full w-fit">
              {corporateScale}
            </span>
          )}
        </div>
      )}

      {hasAnyContact && (
        <div className="flex flex-col gap-2">
          {contactEmail && (
            <ContactPill
              icon="📧"
              label={contactEmail}
              value={contactEmail}
              action="copy"
            />
          )}
          {contactPhone && (
            <ContactPill
              icon="📞"
              label={contactPhone}
              value={contactPhone}
              action="copy"
            />
          )}
          {homepage && (
            <ContactPill
              icon="🌐"
              label="Website"
              value={homepage}
              action="link"
            />
          )}
          {naverLink && (
            <ContactPill
              icon="🛒"
              label="Naver Store"
              value={naverLink}
              action="link"
            />
          )}
          {wholesaleLink && (
            <ContactPill
              icon="🛒"
              label="Wholesale Portal"
              value={wholesaleLink}
              action="link"
            />
          )}
        </div>
      )}
    </div>
  );
}
