import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Lightweight fingerprint — changes whenever categories or items change. */
export async function GET() {
  try {
    const [categories, items] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, sortOrder: true, image: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.item.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          size: true,
          image: true,
          categoryId: true,
          isAvailable: true,
          tags: true,
        },
        orderBy: { id: "asc" },
      }),
    ]);

    const version = createHash("sha256")
      .update(JSON.stringify({ categories, items }))
      .digest("hex")
      .slice(0, 16);

    return NextResponse.json({ version, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Failed to read menu version" }, { status: 500 });
  }
}
