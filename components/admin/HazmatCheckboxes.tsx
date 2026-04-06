"use client";

import { useState, useEffect } from "react";

type HazmatState = {
  contains_liquid: boolean;
  contains_powder: boolean;
  contains_battery: boolean;
  contains_aerosol: boolean;
};

function parseValue(value: string | null): HazmatState {
  const def: HazmatState = {
    contains_liquid: false,
    contains_powder: false,
    contains_battery: false,
    contains_aerosol: false,
  };
  if (!value?.trim()) return def;
  try {
    const p = JSON.parse(value);
    if (typeof p !== "object" || p === null) return def;
    return {
      contains_liquid: Boolean(p.contains_liquid),
      contains_powder: Boolean(p.contains_powder),
      contains_battery: Boolean(p.contains_battery),
      contains_aerosol: Boolean(p.contains_aerosol),
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
        contains_liquid: newState.contains_liquid,
        contains_powder: newState.contains_powder,
        contains_battery: newState.contains_battery,
        contains_aerosol: newState.contains_aerosol,
      })
    );
  }

  const items: { key: keyof HazmatState; icon: string; label: string }[] = [
    { key: "contains_liquid", icon: "💧", label: "Liquid" },
    { key: "contains_powder", icon: "🧪", label: "Powder" },
    { key: "contains_battery", icon: "🔋", label: "Battery" },
    { key: "contains_aerosol", icon: "💨", label: "Aerosol" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 bg-[#F8F7F4] p-4 rounded-lg">
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
