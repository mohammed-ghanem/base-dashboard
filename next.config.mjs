/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [],
  },
  
  reactStrictMode: false,
  productionBrowserSourceMaps: false, // Disable source maps in production
  
}

export default nextConfig
