import Image from "next/image";
import type { CSSProperties } from "react";

type LogoProps = {
  className?: string;
  style?: CSSProperties;
};

export function Logo({ className, style }: LogoProps) {
  return (
    <Image
      src="/images/KoreaScout_LOGO_V3.png"
      alt="KoreaScout Logo"
      width={320}
      height={80}
      priority
      className={className}
      style={style}
    />
  );
}
