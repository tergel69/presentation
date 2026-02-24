/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Vercel deployment
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
