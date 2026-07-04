/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the app can be hosted on GitHub Pages (no Node server).
  // All data is client-side (localStorage), so every page exports cleanly.
  output: "export",
  // GitHub Pages serves folders, so /raid -> /raid/index.html needs the slash.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
