# scan_result.md

---

## 1. lib/supabase/server.ts

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client. Use for Server Components, Route Handlers, Server Actions.
 * RLS applies: profiles (own row), weeks (published only), scout_final_reports (tier-based).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component; middleware will refresh the session.
          }
        },
      },
    }
  );
}
```

---

## 2. app/jisun/layout.tsx

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function JisunLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "#0f1117",
        overflow: "hidden",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      {children}
    </div>
  );
}
```

---

## 3. app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ConditionalRootContent } from "./ConditionalRootContent";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KoreaScout",
  description: "Korean product intelligence for global sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0A0908]`}
      >
        <ConditionalRootContent>{children}</ConditionalRootContent>
      </body>
    </html>
  );
}
```

---

## 4. components/layout/Header.tsx

```tsx
import { createClient } from "@/lib/supabase/server";
import { HeaderShellClient } from "./HeaderShellClient";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();
    tier = profile?.tier ?? "free";
  }

  return <HeaderShellClient user={user} tier={tier} />;
}
```

---

## 5. app/ConditionalRootContent.tsx

```tsx
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
```
