import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/tokyo-activities" : "",
  devIndicators: { buildActivity: false },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.big-bang.co.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.round1.co.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tile.openstreetmap.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.sportsjourney.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-imgix.headout.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rimage.gnst.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.big-echo.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.timeout.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.japannakama.co.uk",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mysterycircus.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
