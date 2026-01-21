/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(nextConfig, {
  org: "minh-49",
  project: "askpdf",
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
});

