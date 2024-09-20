/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/langflow/:path*',
        destination: 'https://api.langflow.astra.datastax.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
