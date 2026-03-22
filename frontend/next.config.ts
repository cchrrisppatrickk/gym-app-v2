/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Requisito obligatorio para Tauri / SSG
  },
};
export default nextConfig;
