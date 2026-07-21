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
    ];
  },
};

export default nextConfig;