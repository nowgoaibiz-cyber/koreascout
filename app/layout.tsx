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
  title: {
    default: 'KoreaScout — Korean Product Intelligence for Global Sellers',
    template: '%s | KoreaScout',
  },
  description: 'Discover untapped Korean products before your competitors. Weekly AI-powered trend intelligence for Amazon and Shopify sellers.',
  keywords: ['Korean products', 'K-beauty', 'Amazon FBA', 'product sourcing', 'Korea trend', 'global sellers'],
  authors: [{ name: 'KoreaScout' }],
  creator: 'KoreaScout',
  metadataBase: new URL('https://koreascout.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://koreascout.com',
    siteName: 'KoreaScout',
    title: 'KoreaScout — Korean Product Intelligence for Global Sellers',
    description: 'Discover untapped Korean products before your competitors. Weekly AI-powered trend intelligence for Amazon and Shopify sellers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KoreaScout',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoreaScout — Korean Product Intelligence for Global Sellers',
    description: 'Discover untapped Korean products before your competitors.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
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
