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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {ITEMS.map((item) => {
        const value = Boolean(parsed[item.key]);
        const base = "inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium border";

        return (
          <span key={item.key} className={`${base} ${value ? item.trueClass : item.falseClass}`}>
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}

