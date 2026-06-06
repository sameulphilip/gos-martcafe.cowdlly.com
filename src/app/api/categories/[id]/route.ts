import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, parseFormData } from "@/lib/api-helpers";
import { saveUploadedFile } from "@/lib/upload";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const formData = await parseFormData(request as never);
    const data: { name?: string; image?: string; sortOrder?: number } = {};

    if (formData) {
      const name = (formData.get("name") as string)?.trim();
      if (name) data.name = name;
      const orderVal = formData.get("sortOrder");
      if (orderVal) data.sortOrder = parseInt(orderVal as string, 10) || 0;
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
      if (body.image !== undefined) data.image = body.image;
      if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { items: true } } },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
