"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Download, Printer, QrCode } from "lucide-react";
import { getMenuPublicUrl } from "@/lib/menu-sync";

function buildQrImageUrl(menuUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&data=${encodeURIComponent(menuUrl)}`;
}

function openPrintWindow(menuUrl: string, qrSrc: string) {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>GO'S MART — QR Menu</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #fff;
      padding: 2rem;
    }
    .card { text-align: center; max-width: 420px; }
    .qr-wrap { position: relative; display: inline-block; margin-bottom: 1.5rem; }
    .qr-wrap img.qr { width: 320px; height: 320px; display: block; }
    .logo {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 10px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    .logo img { width: 72px; height: 72px; border-radius: 12px; display: block; }
    h1 { color: #1a3278; font-size: 2rem; letter-spacing: 0.02em; }
    .sub { color: #7a5234; font-size: 1.1rem; margin-top: 0.75rem; font-family: "Segoe UI", Tahoma, sans-serif; }
    .url { color: #9ca3af; font-size: 0.85rem; margin-top: 1rem; font-family: monospace; word-break: break-all; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="qr-wrap">
      <img class="qr" src="${qrSrc}" alt="QR Code" />
      <div class="logo"><img src="${window.location.origin}/logo.png" alt="GO'S MART" /></div>
    </div>
    <h1>GO'S MART</h1>
    <p class="sub">امسح للاطلاع على المنيو الرقمي</p>
    <p class="url">${menuUrl.replace(/^https?:\/\//, "")}</p>
  </div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=480,height=640");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

export function MenuQrCard() {
  const [menuUrl, setMenuUrl] = useState("");
  const [qrSrc, setQrSrc] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const url = getMenuPublicUrl();
    setMenuUrl(url);
    setQrSrc(buildQrImageUrl(url));
  }, []);

  const downloadPng = useCallback(async () => {
    if (!menuUrl || downloading || !qrSrc) return;
    setDownloading(true);
    try {
      const size = 520;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size + 120;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const [logo, qr] = await Promise.all([
        loadImage(`${window.location.origin}/logo.png`),
        loadImage(qrSrc),
      ]);

      const qrSize = 400;
      const qrX = (size - qrSize) / 2;
      ctx.drawImage(qr, qrX, 24, qrSize, qrSize);

      const logoSize = 72;
      const logoX = (size - logoSize) / 2;
      const logoY = 24 + (qrSize - logoSize) / 2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16);
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

      ctx.fillStyle = "#1a3278";
      ctx.font = "bold 22px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("GO'S MART", size / 2, qrSize + 58);

      ctx.fillStyle = "#7a5234";
      ctx.font = "14px sans-serif";
      ctx.fillText("امسح للاطلاع على المنيو الرقمي", size / 2, qrSize + 86);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "11px monospace";
      ctx.fillText(menuUrl.replace(/^https?:\/\//, ""), size / 2, qrSize + 108);

      const link = document.createElement("a");
      link.download = "gosmart-menu-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      window.open(qrSrc, "_blank");
    } finally {
      setDownloading(false);
    }
  }, [downloading, menuUrl, qrSrc]);

  const handlePrint = () => {
    if (menuUrl && qrSrc) openPrintWindow(menuUrl, qrSrc);
  };

  return (
    <div className="rounded-2xl bg-white border border-stone-200 card-shadow overflow-hidden sticky top-6">
      <div className="bg-brand-blue px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          <h2 className="font-serif text-lg font-bold">QR Code المنيو</h2>
        </div>
        <p className="text-white/75 text-xs mt-1 font-arabic">اطبعه وضعه على الطاولات أو عند الكاشير</p>
      </div>

      <div className="p-6 flex flex-col items-center">
        <div className="relative">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrSrc}
              alt="QR Code للمنيو"
              width={220}
              height={220}
              className="rounded-xl border border-stone-100"
            />
          ) : (
            <div className="h-[220px] w-[220px] rounded-xl skeleton" />
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-xl bg-white p-1.5 shadow-md ring-2 ring-white">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-lg" />
            </div>
          </div>
        </div>

        <p className="font-serif font-bold text-brand-blue mt-4 text-lg">GO&apos;S MART</p>
        <p className="font-arabic text-sm text-stone-600 mt-1 text-center">امسح للاطلاع على المنيو</p>
        <p className="text-[11px] text-stone-400 mt-2 font-mono text-center break-all px-2">
          {menuUrl || "…"}
        </p>

        <div className="flex flex-col w-full gap-2 mt-5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-blue/90 transition"
          >
            <Printer className="h-4 w-4" />
            طباعة QR + اللوجو
          </button>
          <button
            type="button"
            onClick={downloadPng}
            disabled={downloading || !qrSrc}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloading ? "جاري التحميل…" : "تحميل PNG"}
          </button>
        </div>
      </div>
    </div>
  );
}
