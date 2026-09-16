import type { NextConfig } from 'next';

/**
 * Same shape as the bdimo devis app: a standalone Next app that owns a single
 * path segment of ailive.fr and is surfaced there by a rewrite.
 */
const BASE_PATH = '/dr-brief';

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  reactStrictMode: true,
  // A stray lockfile in the home directory otherwise wins root inference.
  outputFileTracingRoot: process.cwd(),

  // On the standalone *.vercel.app domain the bare root is outside basePath
  // and 404s. `basePath: false` lets this one redirect live outside the
  // prefix. Harmless once the app is rewritten under ailive.fr, where the
  // main site owns "/" and only /dr-brief is routed here.
  async redirects() {
    return [{ source: '/', destination: BASE_PATH, permanent: false, basePath: false }];
  },
};

export default nextConfig;
