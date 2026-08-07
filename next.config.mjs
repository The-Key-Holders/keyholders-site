/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // SPA fallback for PCF Vault static build under /public/pcf-vault
      {
        source: "/pcf-vault",
        destination: "/pcf-vault/index.html",
      },
      {
        source: "/pcf-vault/",
        destination: "/pcf-vault/index.html",
      },
      // Engagement party Guest Hub (static under /public/celebrate)
      {
        source: "/celebrate",
        destination: "/celebrate/index.html",
      },
      {
        source: "/celebrate/",
        destination: "/celebrate/index.html",
      },
      // Map Flask-compatible /api/* paths to in-memory party API
      { source: "/api/health", destination: "/api/party/health" },
      { source: "/api/config", destination: "/api/party/config" },
      { source: "/api/profiles", destination: "/api/party/profiles" },
      {
        source: "/api/profiles/:path*",
        destination: "/api/party/profiles/:path*",
      },
      { source: "/api/scores", destination: "/api/party/scores" },
      { source: "/api/checkins", destination: "/api/party/checkins" },
      {
        source: "/api/leaderboard",
        destination: "/api/party/leaderboard",
      },
      { source: "/api/export", destination: "/api/party/export" },
    ];
  },
};

export default nextConfig;