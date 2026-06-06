import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toFixed(0)} EGP`;
}

export function getTagLabel(tag: string): string {
  const labels: Record<string, string> = {
    popular: "Popular",
    new: "New",
    "chef-special": "Chef Special",
    spicy: "Spicy",
    vegetarian: "Vegetarian",
  };
  return labels[tag] ?? tag;
}

export function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    popular: "bg-brand-red text-white",
    new: "bg-brand-blue text-white",
    "chef-special": "bg-amber-500 text-white",
    spicy: "bg-orange-500 text-white",
    vegetarian: "bg-emerald-500 text-white",
  };
  return colors[tag] ?? "bg-stone-500 text-white";
}
