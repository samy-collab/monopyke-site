import type { NextConfig } from "next";
import { SITE_ALIAS_HOSTS, SITE_HOST } from "./src/lib/site";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // why: the page embeds YouTube but is never meant to be framed by other sites.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // hazard: no includeSubDomains/preload, so a future plain-HTTP subdomain is not locked out.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

// why: files in /public keep their names when replaced, so they cannot be cached as immutable;
// a week plus background revalidation keeps repeat visits fast without serving stale art for long.
const publicAssetCache = { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" };

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return SITE_ALIAS_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${SITE_HOST}/:path*`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [publicAssetCache] },
      { source: "/audio/:path*", headers: [publicAssetCache] },
      { source: "/icon-:size.png", headers: [publicAssetCache] },
    ];
  },
};

export default nextConfig;
