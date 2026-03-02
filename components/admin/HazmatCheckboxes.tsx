"use client";

import { useState, useEffect } from "react";

type HazmatState = {
  is_liquid: boolean;
  is_powder: boolean;
  is_battery: boolean;
  is_aerosol: boolean;
};

function parseValue(value: string | null): HazmatState {
  const def: HazmatState = {
    is_liquid: false,
    is_powder: false,
    is_battery: false,
    is_aerosol: false,
  };
  if (!value?.trim()) return def;
  try {
    const p = JSON.parse(value);
    if (typeof p !== "object" || p === null) return def;
    return {
      is_liquid: Boolean(p.is_liquid),
      is_powder: Boolean(p.is_powder),
      is_battery: Boolean(p.is_battery),
      is_aerosol: Boolean(p.is_aerosol),
    };
  } catch {
    return def;
  }
}

export function HazmatCheckboxes({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [state, setState] = useState<HazmatState>(() => parseValue(value));

  useEffect(() => {
    setState(parseValue(value));
  }, [value]);

  function toggle(key: keyof HazmatState) {
    const newState = { ...state, [key]: !state[key] };
    setState(newState);
    onChange(
      JSON.stringify({
        is_liquid: newState.is_liquid,
        is_powder: newState.is_powder,
        is_battery: newState.is_battery,
        is_aerosol: newState.is_aerosol,
      })
    );
  }

  const items: { key: keyof HazmatState; icon: string; label: string }[] = [
    { key: "is_liquid", icon: "💧", label: "Liquid" },
    { key: "is_powder", icon: "🧪", label: "Powder" },
    { key: "is_battery", icon: "🔋", label: "Battery" },
    { key: "is_aerosol", icon: "💨", label: "Aerosol" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 bg-[#F8F7F4] p-3 rounded-lg">
      {items.map(({ key, icon, label }) => (
        <label
          key={key}
          className="flex items-center gap-2 cursor-pointer text-sm text-[#3D3B36]"
        >
          <input
            type="checkbox"
            checked={state[key]}
            onChange={() => toggle(key)}
            className="appearance-none w-4 h-4 rounded border border-[#E8E6E1] bg-white checked:bg-[#16A34A] checked:border-[#16A34A] focus:border-[#16A34A] outline-none"
          />
          <span>
            {icon} {label}
          </span>
        </label>
      ))}
    </div>
  );
}
