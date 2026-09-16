import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/devis/bdimo",
  // A stray lockfile in the home directory otherwise wins root inference.
  turbopack: { root: __dirname },
};

export default nextConfig;
