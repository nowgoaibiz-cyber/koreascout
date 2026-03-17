"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Header = dynamic(
  () => import("@/components/layout/Header").then((m) => m.Header),
  { ssr: true }
);

export function ConditionalRootContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/jisun")) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
