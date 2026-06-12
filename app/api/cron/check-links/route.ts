import { type NextRequest, NextResponse } from "next/server";
import { runLinkCheck } from "@/lib/check-links";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Manual / authenticated trigger for the link checker. The scheduled cron runs
 * via the Worker's scheduled() handler (custom-worker.ts) and does NOT hit this
 * route. Kept for manual runs and local testing; still requires CRON_SECRET so
 * it can never be triggered anonymously (it fans out HTTP requests per resource).
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const summary = await runLinkCheck();
  return NextResponse.json(summary);
}
