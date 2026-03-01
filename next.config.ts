import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      // Naver Shopping / Naver static CDN
      {
        protocol: "https",
        hostname: "shopping-phinf.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.pstatic.net",
        pathname: "/**",
      },
      // K-product / Korean e-commerce image hosts
      {
        protocol: "https",
        hostname: "cdn.daisomall.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.gmarket.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thumbnail.coupang.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.coupangcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
