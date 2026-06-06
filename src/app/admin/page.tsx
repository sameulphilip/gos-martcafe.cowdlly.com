"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminSidebar";
import { adminFetch } from "@/lib/admin-fetch";
import { Package, FolderOpen, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

type Analytics = {
  totalItems: number;
  totalCategories: number;
  mostPopularCategory: { name: string; _count: { items: number } } | null;
  dailyViews: number;
};

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/menu")
      .then((r) => r.json())
      .then((data) => setAnalytics(data.analytics))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Items",
      value: analytics?.totalItems ?? "—",
      icon: Package,
      color: "bg-brand-blue/10 text-brand-blue",
    },
    {
      label: "Categories",
      value: analytics?.totalCategories ?? "—",
      icon: FolderOpen,
      color: "bg-brand-red/10 text-brand-red",
    },
    {
      label: "Daily Views",
      value: analytics?.dailyViews ?? "—",
      icon: Eye,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Top Category",
      value: analytics?.mostPopularCategory?.name ?? "—",
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <AdminShell>
      <div className="max-w-5xl">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 mt-1">Welcome to GO&apos;S MART admin panel</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-5 card-shadow"
            >
              <div className={`inline-flex rounded-xl p-2.5 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-2xl font-bold text-stone-900">
                {loading ? "..." : value}
              </p>
              <p className="text-sm text-stone-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/categories"
            className="rounded-2xl bg-white p-6 card-shadow hover:card-shadow-hover transition group"
          >
            <FolderOpen className="h-8 w-8 text-brand-blue group-hover:scale-110 transition" />
            <h3 className="font-semibold text-stone-900 mt-3">Manage Categories</h3>
            <p className="text-sm text-stone-500 mt-1">Add, edit, or remove menu categories</p>
          </Link>
          <Link
            href="/admin/items"
            className="rounded-2xl bg-white p-6 card-shadow hover:card-shadow-hover transition group"
          >
            <Package className="h-8 w-8 text-brand-red group-hover:scale-110 transition" />
            <h3 className="font-semibold text-stone-900 mt-3">Manage Items</h3>
            <p className="text-sm text-stone-500 mt-1">Control menu items, prices, and availability</p>
          </Link>
          <Link
            href="/admin/preview"
            className="rounded-2xl bg-white p-6 card-shadow hover:card-shadow-hover transition group"
          >
            <Eye className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-stone-900 mt-3">Menu Preview</h3>
            <p className="text-sm text-stone-500 mt-1">See how customers view your menu</p>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
