/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js Concept: env variables prefixed NEXT_PUBLIC_ are exposed to the browser.
  // Variables WITHOUT that prefix are server-only.
  env: {
    NEXT_PUBLIC_PHP_API_URL: process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000",
  },
};

module.exports = nextConfig;
