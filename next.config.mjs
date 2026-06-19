/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: '.',
  },
  serverExternalPackages: ['pg', 'pg-native'],
  allowedDevOrigins: ['192.168.220.1'],
}

export default nextConfig
