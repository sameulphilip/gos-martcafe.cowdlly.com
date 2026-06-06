import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, parseFormData } from "@/lib/api-helpers";
import { saveUploadedFile } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { items: true } } },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await parseFormData(request as never);
    let name: string;
    let image: string | undefined;
    let sortOrder = 0;

    if (formData) {
      name = (formData.get("name") as string)?.trim();
      const orderVal = formData.get("sortOrder");
      if (orderVal) sortOrder = parseInt(orderVal as string, 10) || 0;
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        image = await saveUploadedFile(imageFile);
      } else {
        const imageUrl = formData.get("imageUrl") as string;
        if (imageUrl) image = imageUrl;
      }
    } else {
      const body = await request.json();
      name = body.name?.trim();
      image = body.image;
      sortOrder = body.sortOrder ?? 0;
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, image, sortOrder },
      include: { _count: { select: { items: true } } },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
