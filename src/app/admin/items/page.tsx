"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminSidebar";
import { ProductImage } from "@/components/menu/ProductImage";
import { adminFetch } from "@/lib/admin-fetch";
import { notifyMenuUpdated } from "@/lib/menu-sync";
import { Plus, Pencil, Trash2, X, Loader2, Upload, Search } from "lucide-react";
import { formatPrice, getTagLabel } from "@/lib/utils";
import type { CategoryWithCount, ItemWithCategory } from "@/types";

const AVAILABLE_TAGS = ["popular", "new", "chef-special", "spicy", "vegetarian"];

type FormState = {
  name: string;
  price: string;
  size: string;
  categoryId: string;
  imageUrl: string;
  imageFile: File | null;
  tags: string[];
  isAvailable: boolean;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  size: "",
  categoryId: "",
  imageUrl: "",
  imageFile: null,
  tags: [],
  isAvailable: true,
};

export default function ItemsPage() {
  const [items, setItems] = useState<ItemWithCategory[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchData = useCallback(async () => {
    const [itemsRes, catsRes] = await Promise.all([
      adminFetch("/api/items"),
      adminFetch("/api/categories"),
    ]);
    setItems(await itemsRes.json());
    setCategories(await catsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterCategory) result = result.filter((i) => i.categoryId === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    return result;
  }, [items, filterCategory, search]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setPreview(null);
    setModalOpen(true);
  }

  function openEdit(item: ItemWithCategory) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: String(item.price),
      size: item.size ?? "",
      categoryId: item.categoryId,
      imageUrl: item.image ?? "",
      imageFile: null,
      tags: item.tags,
      isAvailable: item.isAvailable,
    });
    setPreview(item.image);
    setModalOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, imageFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", "");
    fd.append("price", form.price);
    fd.append("size", form.size);
    fd.append("categoryId", form.categoryId);
    fd.append("tags", form.tags.join(","));
    fd.append("isAvailable", String(form.isAvailable));
    if (form.imageFile) {
      fd.append("image", form.imageFile);
    } else if (form.imageUrl) {
      fd.append("imageUrl", form.imageUrl);
    }

    const url = editingId ? `/api/items/${editingId}` : "/api/items";
    const method = editingId ? "PUT" : "POST";

    await adminFetch(url, { method, body: fd });
    setSaving(false);
    setModalOpen(false);
    await fetchData();
    notifyMenuUpdated();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await adminFetch(`/api/items/${id}`, { method: "DELETE" });
    await fetchData();
    notifyMenuUpdated();
  }

  async function toggleAvailability(item: ItemWithCategory) {
    await adminFetch(`/api/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    await fetchData();
    notifyMenuUpdated();
  }

  return (
    <AdminShell>
      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">Items</h1>
            <p className="text-stone-500 mt-1">{items.length} menu items</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 transition self-start"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 card-shadow"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-stone-900 truncate">{item.name}</h3>
                    {item.size && (
                      <span className="shrink-0 rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-medium text-brand-blue">
                        {item.size}
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-500">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-500 truncate">
                    {item.category?.name} · {formatPrice(item.price)}
                    {item.tags.length > 0 && ` · ${item.tags.map(getTagLabel).join(", ")}`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleAvailability(item)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      item.isAvailable
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <p className="text-center text-stone-500 py-12">No items found</p>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 card-shadow space-y-4 my-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">
                {editingId ? "Edit Item" : "New Item"}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Price (EGP)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Size (S / M)</label>
                <input
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  placeholder="S أو M — اتركه فارغاً إن لم يكن له مقاس"
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      form.tags.includes(tag)
                        ? "bg-brand-blue text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {getTagLabel(tag)}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                className="rounded border-stone-300 text-brand-blue focus:ring-brand-blue/20"
              />
              <span className="text-sm text-stone-700">Available for order</span>
            </label>

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

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-500 hover:border-brand-blue/40 transition">
              <Upload className="h-4 w-4" />
              Upload image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {preview && (
              <div className="relative h-32 w-full overflow-hidden rounded-xl">
                <ProductImage src={preview} alt="Preview" fill className="object-cover" sizes="400px" />
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Save Changes" : "Create Item"}
            </button>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
