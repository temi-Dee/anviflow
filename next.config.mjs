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
}

export default nextConfig
