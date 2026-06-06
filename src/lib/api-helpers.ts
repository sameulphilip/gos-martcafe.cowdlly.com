import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function parseFormData(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    return request.formData();
  }

  return null;
}

export function parseTags(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function parseBoolean(value: FormDataEntryValue | null, fallback = true): boolean {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    return value === "true" || value === "1" || value === "on";
  }
  return fallback;
}
