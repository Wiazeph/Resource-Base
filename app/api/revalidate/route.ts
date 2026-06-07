import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation. A content edit in the Studio
 * (including a broken-link fix) refreshes the live site within seconds,
 * no redeploy. Configure the webhook in sanity.io/manage to POST here with
 * the secret below and projection: { "_type": _type }.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse("Bad request", { status: 400 });
    }

    // Revalidate the document's own tag plus broad tags so list pages refresh.
    // Next 16 requires a cache profile; "max" expires the cached fetch entries
    // tagged with these tags on the next request.
    revalidateTag(body._type, "max");
    revalidateTag("sanity", "max");

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error", { status: 500 });
  }
}
