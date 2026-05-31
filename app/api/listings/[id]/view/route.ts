import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Increment viewsCount once per client session (deduped in browser). */
export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Listing id required" }, { status: 400 });
  }

  try {
    const ref = adminDb.collection("listings").doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.isActive !== true) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await ref.update({ viewsCount: FieldValue.increment(1) });
    const viewsCount = (snap.data()?.viewsCount as number | undefined) ?? 0;

    return NextResponse.json({ ok: true, viewsCount: viewsCount + 1 });
  } catch (err) {
    console.error("POST /api/listings/[id]/view:", err);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
