import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //reactStrictMode: true,
};

export default withPWA({
  ...nextConfig,
  dest: "public", // Output directory for service worker
  register: true, // Automatically register service worker
  skipWaiting: true, // Activate service worker immediately
  scope: "/app",
  sw: "service-worker.js",
  disable: process.env.NODE_ENV === "development", // Disable in development mode
});
