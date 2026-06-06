import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, parseFormData, parseTags, parseBoolean } from "@/lib/api-helpers";
import { saveUploadedFile } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const availableOnly = searchParams.get("available") === "true";

    const items = await prisma.item.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(availableOnly ? { isAvailable: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await parseFormData(request as never);
    let name: string;
    let description: string | undefined;
    let price: number;
    let categoryId: string;
    let size: string | undefined;
    let image: string | undefined;
    let tags: string[] = [];
    let isAvailable = true;

    if (formData) {
      name = (formData.get("name") as string)?.trim();
      description = (formData.get("description") as string)?.trim() || undefined;
      price = parseFloat(formData.get("price") as string);
      categoryId = formData.get("categoryId") as string;
      size = (formData.get("size") as string)?.trim() || undefined;
      tags = parseTags(formData.get("tags"));
      isAvailable = parseBoolean(formData.get("isAvailable"), true);
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
      description = body.description?.trim();
      price = parseFloat(body.price);
      categoryId = body.categoryId;
      image = body.image;
      size = body.size?.trim() || undefined;
      tags = body.tags ?? [];
      isAvailable = body.isAvailable ?? true;
    }

    if (!name || !categoryId || isNaN(price)) {
      return NextResponse.json(
        { error: "Name, category, and valid price are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: { name, description, price, size, categoryId, image, tags, isAvailable },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
