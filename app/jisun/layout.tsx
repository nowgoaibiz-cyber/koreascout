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
