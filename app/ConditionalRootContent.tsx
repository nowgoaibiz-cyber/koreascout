"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

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
