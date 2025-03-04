/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-lib'],
  },
  optimizeFonts: true,
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      try {
        const https = require('https');
        const rootCas = require('ssl-root-cas').create();
        
        https.globalAgent.options.ca = rootCas;
      } catch (error) {
        console.warn('SSL certificate setup failed:', error.message);
      }
    }
    
    return config;
  },
}

module.exports = nextConfig 