"use client";

import { useState, useEffect } from "react";

const MAX_LINKS = 5;

function parseValue(value: string | null): string[] {
  if (value == null || value === "") return [""];
  try {
    const p = JSON.parse(value);
    if (Array.isArray(p)) {
      const arr = p.map((x) => (typeof x === "string" ? x : "")).slice(0, MAX_LINKS);
      return arr.length ? arr : [""];
    }
    if (typeof p === "string" && p.trim()) return [p.trim()];
  } catch {
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [""];
}

export function AiPageLinksHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [links, setLinks] = useState<string[]>(() => parseValue(value));

  useEffect(() => {
    setLinks(parseValue(value));
  }, [value]);

  function updateLink(i: number, v: string) {
    const newLinks = [...links];
    newLinks[i] = v;
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  function removeLink(i: number) {
    const newLinks = links.filter((_, idx) => idx !== i);
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  function addLink() {
    if (links.length >= MAX_LINKS) return;
    const newLinks = [...links, ""];
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  const inputClass =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none flex-1 min-w-0";

  return (
    <div className="flex flex-col gap-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs w-14">Link {i + 1}:</span>
          <input
            type="url"
            value={link}
            onChange={(e) => updateLink(i, e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => removeLink(i)}
            className="text-zinc-600 hover:text-red-400 p-1 shrink-0"
            aria-label="Remove"
          >
            🗑
          </button>
        </div>
      ))}
      {links.length < MAX_LINKS && (
        <button
          type="button"
          onClick={addLink}
          className="text-xs text-emerald-400 hover:text-emerald-300 w-fit"
        >
          + Add Link
        </button>
      )}
    </div>
  );
}
