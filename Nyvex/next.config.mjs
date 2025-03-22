/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  trailingSlash: true,
  experimental: {
    appDir: true,
  },
};



export default nextConfig;
