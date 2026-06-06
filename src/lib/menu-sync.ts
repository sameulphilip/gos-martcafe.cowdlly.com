/** Broadcast + poll helpers so admin preview stays in sync with menu edits. */
export const MENU_SYNC_CHANNEL = "gosmart-menu-sync";

export function notifyMenuUpdated() {
  if (typeof window === "undefined") return;
  try {
    const channel = new BroadcastChannel(MENU_SYNC_CHANNEL);
    channel.postMessage({ type: "menu-updated", at: Date.now() });
    channel.close();
  } catch {
    /* BroadcastChannel unsupported */
  }
  try {
    localStorage.setItem("gosmart-menu-updated", String(Date.now()));
  } catch {
    /* private mode */
  }
}

export async function fetchMenuVersion(): Promise<string | null> {
  try {
    const res = await fetch("/api/menu/version", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { version?: string };
    return data.version ?? null;
  } catch {
    return null;
  }
}

export function getMenuPublicUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://gosmart.menu";
}
