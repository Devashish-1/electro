/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  outputFileTracingExcludes: {
    '*': [
      './AGENTS.md',
      'AGENTS.md',
      'node_modules/next/dist/docs/**',
    ],
  },
};

export default nextConfig;
