import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";

export async function ConditionalRootContent({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (pathname.startsWith("/jisun")) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
