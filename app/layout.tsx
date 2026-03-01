import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "K-Product Scout — Scout Korea's Next Viral Product",
  description:
    "We decode Korea's viral trends and deliver a weekly Digital Execution Blueprint. Raw ad assets, supplier contacts, launch data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <Header />
        <main className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
