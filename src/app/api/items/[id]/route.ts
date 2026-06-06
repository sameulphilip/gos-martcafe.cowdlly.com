import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, parseFormData, parseTags, parseBoolean } from "@/lib/api-helpers";
import { saveUploadedFile } from "@/lib/upload";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const formData = await parseFormData(request as never);
    const data: Record<string, unknown> = {};

    if (formData) {
      const name = (formData.get("name") as string)?.trim();
      if (name) data.name = name;
      const description = formData.get("description") as string;
      if (description !== null) data.description = description.trim() || null;
      const price = formData.get("price");
      if (price) data.price = parseFloat(price as string);
      const categoryId = formData.get("categoryId") as string;
      if (categoryId) data.categoryId = categoryId;
      if (formData.has("tags")) data.tags = parseTags(formData.get("tags"));
      if (formData.has("size")) {
        const size = formData.get("size") as string;
        data.size = size?.trim() || null;
      }
      if (formData.has("isAvailable")) {
        data.isAvailable = parseBoolean(formData.get("isAvailable"), true);
      }
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        data.image = await saveUploadedFile(imageFile);
      } else {
        const imageUrl = formData.get("imageUrl") as string;
        if (imageUrl) data.image = imageUrl;
      }
    } else {
      const body = await request.json();
      if (body.name) data.name = body.name.trim();
      if (body.description !== undefined) data.description = body.description?.trim() || null;
      if (body.price !== undefined) data.price = parseFloat(body.price);
      if (body.categoryId) data.categoryId = body.categoryId;
      if (body.tags) data.tags = body.tags;
      if (body.size !== undefined) data.size = body.size?.trim() || null;
      if (body.isAvailable !== undefined) data.isAvailable = body.isAvailable;
      if (body.image !== undefined) data.image = body.image;
    }

    const item = await prisma.item.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
