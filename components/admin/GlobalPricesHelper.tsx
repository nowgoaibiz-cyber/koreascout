"use client";

import { useState, useEffect } from "react";

const REGIONS = [
  { id: "us", flag: "🇺🇸", name: "US", placeholder: "Amazon" },
  { id: "uk", flag: "🇬🇧", name: "UK", placeholder: "Amazon UK" },
  { id: "sea", flag: "🇸🇬", name: "SEA", placeholder: "Shopee" },
  { id: "australia", flag: "🇦🇺", name: "AU", placeholder: "Amazon AU" },
  { id: "india", flag: "🇮🇳", name: "IN", placeholder: "Flipkart" },
] as const;

type RegionRow = { platform: string; url: string };

function parseValue(value: string | null): Record<string, RegionRow> {
  if (!value?.trim()) return {};
  try {
    const p = JSON.parse(value);
    if (typeof p !== "object" || p === null) return {};
    const out: Record<string, RegionRow> = {};
    for (const r of REGIONS) {
      const v = p[r.id] ?? p[r.id === "australia" ? "au" : r.id];
      if (v && typeof v === "object") {
        out[r.id] = {
          platform: typeof v.platform === "string" ? v.platform : "",
          url: typeof v.url === "string" ? v.url : "",
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function GlobalPricesHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [rows, setRows] = useState<Record<string, RegionRow>>(() =>
    parseValue(value)
  );
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    setRows(parseValue(value));
  }, [value]);

  function updateRegion(id: string, field: "platform" | "url", val: string) {
    const next = { ...rows };
    const current = next[id] ?? { platform: "", url: "" };
    next[id] = { ...current, [field]: val };
    setRows(next);
    const result: Record<string, RegionRow> = {};
    for (const r of REGIONS) {
      const row = next[r.id];
      if (row?.url?.trim()) {
        result[r.id] = {
          platform: row.platform?.trim() ?? "",
          url: row.url.trim(),
        };
      }
    }
    onChange(JSON.stringify(result));
  }

  const currentJson = (() => {
    const result: Record<string, RegionRow> = {};
    for (const r of REGIONS) {
      const row = rows[r.id];
      if (row?.url?.trim()) {
        result[r.id] = {
          platform: row.platform?.trim() ?? "",
          url: row.url.trim(),
        };
      }
    }
    return JSON.stringify(result, null, 2);
  })();

  const inputClass =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none";

  return (
    <div className="flex flex-col gap-3">
      {REGIONS.map((r) => (
        <div key={r.id} className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-400 text-sm w-16">
            {r.flag} {r.name}
          </span>
          <input
            type="text"
            placeholder={r.placeholder}
            value={rows[r.id]?.platform ?? ""}
            onChange={(e) => updateRegion(r.id, "platform", e.target.value)}
            className={`${inputClass} w-28`}
          />
          <input
            type="url"
            placeholder="URL"
            value={rows[r.id]?.url ?? ""}
            onChange={(e) => updateRegion(r.id, "url", e.target.value)}
            className={`${inputClass} flex-1 min-w-0`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRawOpen((o) => !o)}
        className="text-[10px] text-zinc-600 hover:text-zinc-400 w-fit"
      >
        {rawOpen ? "▼ Hide Raw JSON" : "▶ Show Raw JSON"}
      </button>
      {rawOpen && (
        <textarea
          readOnly
          value={currentJson}
          rows={6}
          className="bg-zinc-950 text-zinc-500 text-[10px] font-mono rounded-lg px-3 py-2 border border-zinc-800 resize-none w-full"
        />
      )}
      <p className="text-[10px] text-zinc-600 italic">
        Leave URL empty to show 🔵 Blue Ocean badge on the product page.
      </p>
    </div>
  );
}
