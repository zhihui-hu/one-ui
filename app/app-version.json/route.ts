import { env } from "@/lib/env";

// Polled by public/app-update-checker.worker.js; must match the bundle's BUILD_TIME.
export const dynamic = "force-static";

export function GET() {
  return Response.json({ build: env.BUILD_TIME ?? "" });
}
