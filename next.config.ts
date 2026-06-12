import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/crm",
  assetPrefix: "/crm/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;