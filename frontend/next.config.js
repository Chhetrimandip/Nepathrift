/** @type {import('next').NextConfig} */
const path = require('path')

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://nepathrift.vercel.app'] 
  : ['http://localhost:3000']

const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'firebasestorage.googleapis.com'],
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: {
      allowedOrigins
    }
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: allowedOrigins.join(',') },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    }
    return config
  }
}

module.exports = nextConfig 