import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, items, totalItems, categoryCounts] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: { _count: { select: { items: true } } },
      }),
      prisma.item.findMany({
        where: { isAvailable: true },
        orderBy: { createdAt: "asc" },
        include: { category: { select: { id: true, name: true } } },
      }),
      prisma.item.count(),
      prisma.item.groupBy({
        by: ["categoryId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
    ]);

    let mostPopularCategory = null;
    if (categoryCounts.length > 0) {
      mostPopularCategory = await prisma.category.findUnique({
        where: { id: categoryCounts[0].categoryId },
        select: { id: true, name: true, _count: { select: { items: true } } },
      });
    }

    return NextResponse.json({
      categories,
      items,
      analytics: {
        totalItems,
        totalCategories: categories.length,
        mostPopularCategory,
        dailyViews: Math.floor(Math.random() * 200) + 50,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
