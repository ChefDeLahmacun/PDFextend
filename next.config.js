/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pdf-lib'],
  },
  optimizeFonts: true,
  webpack: (config, { isServer, dev }) => {
    return config;
  },
}

module.exports = nextConfig 