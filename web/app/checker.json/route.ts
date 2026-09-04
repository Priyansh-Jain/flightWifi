import { checkerIndex } from "@/lib/matrix";

export const dynamic = "force-static";

export function GET() {
  return Response.json(checkerIndex(), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" }
  });
}
