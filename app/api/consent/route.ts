import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { sql } from "@/lib/db";
import { ConsentRequestSchema, POLICY_VERSION } from "@/lib/consent";

// POST /api/consent
//  { type: "cookies", choice, anonId }  anonymous cookie banner choice
//  { type: "auth", terms, privacy, age18 }  after sign-in: needs the session cookie
export async function POST(request: Request) {
  try {
    const parsed = ConsentRequestSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
    const body = parsed.data;
    const userAgent = request.headers.get("user-agent")?.slice(0, 512) ?? null;
    const userId = await getUserId();

    if (body.type === "cookies") {
      await sql`
        insert into consents (user_id, anon_id, kind, granted, detail, policy_version, user_agent)
        values (${userId}, ${body.anonId}, 'cookies', ${body.choice === "all"}, ${body.choice}, ${POLICY_VERSION}, ${userAgent})
      `;
      return NextResponse.json({ status: "ok" });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const anonId = body.anonId ?? null;
    await sql`
      insert into consents (user_id, anon_id, kind, granted, policy_version, user_agent)
      values
        (${userId}, ${anonId}, 'terms', true, ${POLICY_VERSION}, ${userAgent}),
        (${userId}, ${anonId}, 'privacy', true, ${POLICY_VERSION}, ${userAgent}),
        (${userId}, ${anonId}, 'age_18', true, ${POLICY_VERSION}, ${userAgent})
    `;
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
