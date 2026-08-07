/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@ftv/local-runtime",
    "@ftv/errors",
    "@ftv/identifiers",
    "@ftv/audit",
    "@ftv/contracts",
    "@ftv/source-asset-registry",
    "@ftv/media-processing",
    "@ftv/content-production",
    "@ftv/publishing-preparation",
    "@ftv/human-review-approval",
    "@ftv/performance-data",
    "@ftv/analytics-reporting",
    "@ftv/workflow-orchestration",
    "@ftv/governance-rule",
    "@ftv/core-data-administration"
  ],
  webpack(config) {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"]
    };
    return config;
  }
};

export default nextConfig;
