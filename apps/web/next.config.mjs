/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mosswood/shared", "three", "@react-three/fiber", "@react-three/drei"],
  reactStrictMode: false, // Prevents double mounting WebGL canvas in dev mode
};

export default nextConfig;

