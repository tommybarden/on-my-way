import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"
    },
}
 
export default nextConfig