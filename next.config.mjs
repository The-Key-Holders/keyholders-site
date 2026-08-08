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
      // Map Flask-compatible /api/* paths to in-memory party API (cellular guest hub)
      { source: "/api/health", destination: "/api/party/health" },
      { source: "/api/config", destination: "/api/party/config" },
      { source: "/api/status", destination: "/api/party/status" },
      { source: "/api/profiles", destination: "/api/party/profiles" },
      {
        source: "/api/profiles/:path*",
        destination: "/api/party/profiles/:path*",
      },
      { source: "/api/scores", destination: "/api/party/scores" },
      { source: "/api/checkins", destination: "/api/party/checkins" },
      { source: "/api/leaderboard", destination: "/api/party/leaderboard" },
      { source: "/api/dashboard", destination: "/api/party/dashboard" },
      { source: "/api/comingle", destination: "/api/party/comingle" },
      { source: "/api/stations", destination: "/api/party/stations" },
      { source: "/api/predictions", destination: "/api/party/predictions" },
      { source: "/api/wishes", destination: "/api/party/wishes" },
      { source: "/api/photos", destination: "/api/party/photos" },
      { source: "/api/songs", destination: "/api/party/songs" },
      { source: "/api/margarita", destination: "/api/party/margarita" },
      { source: "/api/advice", destination: "/api/party/advice" },
      { source: "/api/export", destination: "/api/party/export" },
      { source: "/api/content/:path*", destination: "/api/party/content/:path*" },
      { source: "/api/memories", destination: "/api/party/memories" },
      { source: "/api/memories/:path*", destination: "/api/party/memories/:path*" },
      { source: "/api/host", destination: "/api/party/host" },
      { source: "/api/host/:path*", destination: "/api/party/host/:path*" },
    ];
  },
};

export default nextConfig;