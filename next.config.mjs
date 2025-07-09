/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'panel.atmoondps.com',
        port: '',
        pathname: '/static/images/carousel/atmoon/**',
      },
      {
        protocol: 'https',
        hostname: 'panel.atmoondps.com',
        port: '',
        pathname: '/static/images/carousel/atmoon/carousel2.png',
      },
      {
        protocol: 'https',
        hostname: 'panel.atmoondps.com',
        port: '',
        pathname: '/static/images/carousel/atmoon/carousel3.png',
      },
      {
        protocol: 'https',
        hostname: 'panel.atmoondps.com',
        port: '',
        pathname: '/static/images/carousel/atmoon/carousel1.png',
      },
    ]
  }
};

export default nextConfig;
