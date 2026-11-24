import type { NextConfig } from "next";

// one value per build, compiled into the bundle and served as app-version.json; next dev evaluates this file more than once, so keep the first
process.env.NEXT_PUBLIC_BUILD_TIME ??= new Date().toISOString();

const PUBLIC_CACHE = [
  {
    key: "Cache-Control",
    value: "public, max-age=345600, stale-while-revalidate=604800",
  },
];

const IMMUTABLE_CACHE = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

// registry urls stay the same across deploys, so keep this short
const REGISTRY_CACHE = [
  {
    key: "Cache-Control",
    value: "public, max-age=3600, stale-while-revalidate=86400",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:dir(logos|assets|fonts)/:path*",
        headers: PUBLIC_CACHE,
      },
      // rename a video when replacing it, browsers will never refetch the same url
      { source: "/componentdemos/:path*", headers: IMMUTABLE_CACHE },
      { source: "/og/:path*", headers: PUBLIC_CACHE },
      { source: "/r/:path*", headers: REGISTRY_CACHE },
      // polled by the update checker, so a stale copy would hide new deploys
      {
        source: "/app-version.json",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
