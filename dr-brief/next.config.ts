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
  // basePath does not apply to a browser fetch(), so the client needs the
  // prefix as a value rather than hardcoding it at the call site.
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
