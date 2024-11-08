/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    api:
      process.env.NEXT_PUBLIC_TENANT === "fashion"
        ? process.env.NEXT_PUBLIC_F_URL
        : process.env.NEXT_PUBLIC_URL,
    tenant: process.env.NEXT_PUBLIC_TENANT,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
export default nextConfig;
