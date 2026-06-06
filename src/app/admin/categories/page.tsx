"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminSidebar";
import { adminFetch } from "@/lib/admin-fetch";
import { notifyMenuUpdated } from "@/lib/menu-sync";
import { Plus, Pencil, Trash2, X, Loader2, Upload } from "lucide-react";
import type { CategoryWithCount } from "@/types";

type FormState = {
  name: string;
  imageUrl: string;
  sortOrder: number;
  imageFile: File | null;
};

const emptyForm: FormState = { name: "", imageUrl: "", sortOrder: 0, imageFile: null };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    const res = await adminFetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setPreview(null);
    setModalOpen(true);
  }

  function openEdit(cat: CategoryWithCount) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      imageUrl: cat.image ?? "",
      sortOrder: cat.sortOrder,
      imageFile: null,
    });
    setPreview(cat.image);
    setModalOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, imageFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("sortOrder", String(form.sortOrder));
    if (form.imageFile) {
      fd.append("image", form.imageFile);
    } else if (form.imageUrl) {
      fd.append("imageUrl", form.imageUrl);
    }

    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    const method = editingId ? "PUT" : "POST";

    await adminFetch(url, { method, body: fd });
    setSaving(false);
    setModalOpen(false);
    await fetchCategories();
    notifyMenuUpdated();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category and all its items?")) return;
    await adminFetch(`/api/categories/${id}`, { method: "DELETE" });
    await fetchCategories();
    notifyMenuUpdated();
  }

  return (
    <AdminShell>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">Categories</h1>
            <p className="text-stone-500 mt-1">{categories.length} categories</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 transition"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 card-shadow"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="h-full w-full bg-stone-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900">{cat.name}</h3>
                  <p className="text-sm text-stone-500">
                    {cat._count?.items ?? 0} items · Order: {cat.sortOrder}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 card-shadow space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
              <input
                value={form.imageUrl}
                onChange={(e) => {
                  setForm((f) => ({ ...f, imageUrl: e.target.value, imageFile: null }));
                  setPreview(e.target.value || null);
                }}
                placeholder="https://..."
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Or Upload Image</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-500 hover:border-brand-blue/40 transition">
                <Upload className="h-4 w-4" />
                Choose file
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {preview && (
              <div className="relative h-32 w-full overflow-hidden rounded-xl">
                <Image src={preview} alt="Preview" fill className="object-cover" sizes="400px" />
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Save Changes" : "Create Category"}
            </button>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
