/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
