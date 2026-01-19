import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow localhost images in development
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async rewrites() {
    return [
      // Proxy notifications to Django backend (with and without trailing slash)
      {
        source: '/api/v2/notifications',
        destination: 'http://localhost:8000/api/v2/notifications/',
      },
      {
        source: '/api/v2/notifications/',
        destination: 'http://localhost:8000/api/v2/notifications/',
      },
      // Proxy gallery endpoints to Django backend (with and without trailing slash)
      {
        source: '/api/v2/gallery/categories',
        destination: 'http://localhost:8000/api/v2/gallery/categories/',
      },
      {
        source: '/api/v2/gallery/categories/',
        destination: 'http://localhost:8000/api/v2/gallery/categories/',
      },
      {
        source: '/api/v2/gallery/images',
        destination: 'http://localhost:8000/api/v2/gallery/images/',
      },
      {
        source: '/api/v2/gallery/images/',
        destination: 'http://localhost:8000/api/v2/gallery/images/',
      },
    ];
  },
};

export default nextConfig;
