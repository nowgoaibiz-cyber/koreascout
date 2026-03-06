import Image from "next/image";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/images/KoreaScout_LOGO_V3.png"
      alt="KoreaScout Logo"
      width={320}
      height={80}
      priority
      className={className}
    />
  );
}
