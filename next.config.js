/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'out',
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig; 