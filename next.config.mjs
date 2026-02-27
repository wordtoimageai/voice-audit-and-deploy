/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js to NOT bundle these server-side packages;
  // load them from node_modules at runtime instead
  serverExternalPackages: [
    'openai',
    '@anthropic-ai/sdk',
    '@google/generative-ai',
  ],
  // Disable type checking & lint during build for faster deploys
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
