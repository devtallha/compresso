import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@compresso/database",
    "@compresso/infra",
    "@compresso/shared",
    "@compresso/domain"
  ],
};

export default nextConfig;
