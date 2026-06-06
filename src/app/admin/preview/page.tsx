"use client";

import { AdminShell } from "@/components/admin/AdminSidebar";
import { LiveMenuPreview } from "@/components/admin/LiveMenuPreview";
import { MenuQrCard } from "@/components/admin/MenuQrCard";

export default function PreviewPage() {
  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-stone-900">Menu Preview</h1>
          <p className="text-stone-500 mt-1 font-arabic">
            معاينة حية — أي تعديل في الأصناف أو التصنيفات يظهر تلقائياً
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
          <LiveMenuPreview />
          <MenuQrCard />
        </div>
      </div>
    </AdminShell>
  );
}
