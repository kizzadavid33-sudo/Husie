import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() { return [{ source: '/api/:path*', destination: `${process.env.MIRROR_GRAM_API_URL || 'http://127.0.0.1:4000'}/api/:path*` }, { source: '/media/:path*', destination: `${process.env.MIRROR_GRAM_API_URL || 'http://127.0.0.1:4000'}/media/:path*` }] },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
}

export default nextConfig
