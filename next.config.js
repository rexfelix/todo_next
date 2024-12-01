/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true
  },
  staticPageGenerationTimeout: 1000,
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig 