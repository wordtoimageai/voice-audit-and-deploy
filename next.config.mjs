/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js to NOT bundle these server-side packages;
  // load them from node_modules at runtime instead
  serverExternalPackages: [
    'openai',
    '@anthropic-ai/sdk',
    '@google/generative-ai',
  ],
  // Disable type checking during build for faster deploys
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
