/** @type {import('next').NextConfig} */
const nextConfig = {
  // copy only the necessary files for a production deployment including select files in node_modules
  output: 'standalone',
};

module.exports = nextConfig;
