type HazmatStatus = {
  contains_liquid?: boolean;
  contains_powder?: boolean;
  contains_battery?: boolean;
  contains_aerosol?: boolean;
};

interface HazmatBadgesProps {
  status: unknown;
}

function parseHazmatStatus(raw: unknown): HazmatStatus | null {
  if (raw == null) return null;
  if (typeof raw === "number" || typeof raw === "boolean") return null;
  let hazmat: unknown = raw;
  if (typeof hazmat === "string") {
    try {
      hazmat = JSON.parse(hazmat);
    } catch {
      return null;
    }
  }
  if (typeof hazmat === "string") {
    try {
      hazmat = JSON.parse(hazmat);
    } catch {
      return null;
    }
  }
  if (typeof hazmat === "object" && hazmat !== null) return hazmat as HazmatStatus;
  return null;
}

const ITEMS: Array<{
  key: keyof HazmatStatus;
  label: string;
  icon: string;
  trueClass: string;
  falseClass: string;
}> = [
  { key: "contains_liquid", label: "Liquid", icon: "💧", trueClass: "bg-[#DBEAFE] border-[#BFDBFE] text-[#2563EB]", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
  { key: "contains_powder", label: "Powder", icon: "🧪", trueClass: "bg-[#6B6860]/80 border-[#9E9C98]/80 text-white", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
  { key: "contains_battery", label: "Battery", icon: "🔋", trueClass: "bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
  { key: "contains_aerosol", label: "Aerosol", icon: "💨", trueClass: "bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
];

export function HazmatBadges({ status }: HazmatBadgesProps) {
  const parsed = parseHazmatStatus(status);
  if (!parsed || typeof parsed !== "object") return null;

  const badges = ITEMS.map((item) => {
    const active = Boolean(parsed[item.key]);
    return {
      label: item.label,
      icon: item.icon,
      active,
      activeClass: active ? item.trueClass : item.falseClass,
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border min-w-0 ${
            badge.active ? badge.activeClass : "bg-[#F8F7F4] border-[#E8E6E1]"
          }`}
        >
          <span className="w-5 h-5 shrink-0 flex items-center justify-center" aria-hidden>
            {badge.icon}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-normal truncate min-w-0">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}

