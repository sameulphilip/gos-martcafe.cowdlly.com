"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Radio } from "lucide-react";
import Link from "next/link";
import {
  MENU_SYNC_CHANNEL,
  fetchMenuVersion,
} from "@/lib/menu-sync";

const POLL_MS = 2500;

type LiveMenuPreviewProps = {
  onVersionChange?: (version: string) => void;
};

export function LiveMenuPreview({ onVersionChange }: LiveMenuPreviewProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [live, setLive] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const versionRef = useRef<string | null>(null);

  const bump = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLastSync(new Date());
  }, []);

  const checkVersion = useCallback(async () => {
    const version = await fetchMenuVersion();
    if (!version) return;
    onVersionChange?.(version);
    if (versionRef.current && versionRef.current !== version) {
      bump();
    }
    versionRef.current = version;
    if (!lastSync) setLastSync(new Date());
  }, [bump, lastSync, onVersionChange]);

  useEffect(() => {
    checkVersion();
    if (!live) return;
    const id = window.setInterval(checkVersion, POLL_MS);
    return () => window.clearInterval(id);
  }, [checkVersion, live]);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(MENU_SYNC_CHANNEL);
      channel.onmessage = () => bump();
    } catch {
      /* ignore */
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "gosmart-menu-updated") bump();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      channel?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [bump]);

  const syncLabel = lastSync
    ? lastSync.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "…";

  return (
    <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-lg bg-white">
      <div className="bg-stone-800 px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center min-w-0">
          <span className="text-xs text-stone-400 truncate block">gosmart.menu</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            className={`rounded-lg px-2 py-1 text-[10px] font-medium transition ${
              live ? "text-stone-400 hover:text-white" : "bg-white/10 text-white"
            }`}
            title={live ? "إيقاف التحديث التلقائي" : "تشغيل التحديث التلقائي"}
          >
            {live ? "⏸" : "▶"}
          </button>
        </div>
      </div>

      <iframe
        key={refreshKey}
        src={`/?preview=admin&live=${refreshKey}`}
        title="GO'S MART Menu Preview"
        className="w-full h-[min(72vh,720px)] border-0 bg-cream"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 bg-stone-50 px-4 py-2.5 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-emerald-600" />
          يتحدّث تلقائياً · آخر مزامنة {syncLabel}
        </span>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 text-brand-blue hover:underline font-medium"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          فتح المنيو
        </Link>
      </div>
    </div>
  );
}
