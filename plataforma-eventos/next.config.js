/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '10.10.0.73'],
  },
  env: {
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
