import type { NextConfig } from "next";

// Backend API URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Parse the backend URL to extract components for image patterns
const backendUrlParsed = new URL(BACKEND_URL);
const backendProtocol = backendUrlParsed.protocol.replace(":", "") as "http" | "https";
const backendHostname = backendUrlParsed.hostname;
const backendPort = backendUrlParsed.port || (backendProtocol === "https" ? "443" : "80");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendProtocol,
        hostname: backendHostname,
        port: backendPort,
        pathname: "/media/**",
      },
      // Fallback for 127.0.0.1 in development
      ...(backendHostname === "localhost"
        ? [
            {
              protocol: backendProtocol as "http" | "https",
              hostname: "127.0.0.1",
              port: backendPort,
              pathname: "/media/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === "development",
  },
  async rewrites() {
    return [
      // Proxy notifications to backend (with and without trailing slash)
      {
        source: "/api/v2/notifications",
        destination: `${BACKEND_URL}/api/v2/notifications/`,
      },
      {
        source: "/api/v2/notifications/",
        destination: `${BACKEND_URL}/api/v2/notifications/`,
      },
      // Proxy gallery endpoints to backend (with and without trailing slash)
      {
        source: "/api/v2/gallery/categories",
        destination: `${BACKEND_URL}/api/v2/gallery/categories/`,
      },
      {
        source: "/api/v2/gallery/categories/",
        destination: `${BACKEND_URL}/api/v2/gallery/categories/`,
      },
      {
        source: "/api/v2/gallery/images",
        destination: `${BACKEND_URL}/api/v2/gallery/images/`,
      },
      {
        source: "/api/v2/gallery/images/",
        destination: `${BACKEND_URL}/api/v2/gallery/images/`,
      },
    ];
  },
};

export default nextConfig;
