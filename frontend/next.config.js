/** @type {import('next').NextConfig} */
const apiRaw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const apiHost = apiRaw.replace(/\/api\/?$/, "").replace(/^https?:\/\//, "");

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3001" },
      { protocol: "https", hostname: apiHost },
    ],
  },
};

module.exports = nextConfig;
