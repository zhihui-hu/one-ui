// polled by public/app-update-checker.worker.js; must match the bundle's build id
export const dynamic = "force-static";

export function GET() {
  return Response.json({ build: process.env.NEXT_PUBLIC_BUILD_TIME ?? "" });
}
