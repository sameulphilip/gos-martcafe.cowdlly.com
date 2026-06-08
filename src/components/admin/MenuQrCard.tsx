"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Printer, QrCode } from "lucide-react";
import { getMenuPublicUrl } from "@/lib/menu-sync";
import { generateQrWithLogo } from "@/lib/qr-generator";
import {
  MART_INTRO_LEAD,
  MART_INTRO_PARAGRAPHS,
  MART_INTRO_SUMMARY,
  MART_INTRO_TITLE,
  MART_QUOTE,
  MART_SUBTITLE,
} from "@/lib/mart-intro";

function introHtml() {
  return [
    `<p class="lead">${MART_INTRO_LEAD}</p>`,
    ...MART_INTRO_PARAGRAPHS.map((p) => `<p class="para">${p.replace(/\n/g, "<br/>")}</p>`),
    `<p class="summary">${MART_INTRO_SUMMARY}</p>`,
  ].join("");
}

function openPrintWindow(menuUrl: string, qrDataUrl: string) {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>GO'S MART — QR Menu</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      background: #fff;
      padding: 1.5rem;
      color: #2c2825;
    }
    .card { max-width: 480px; margin: 0 auto; text-align: center; }
    .qr { width: 280px; height: 280px; display: block; margin: 0 auto 1rem; }
    h1 { color: #1a3278; font-family: Georgia, serif; font-size: 2rem; }
    .sub { color: #7a5234; font-size: 0.95rem; margin-top: 0.35rem; }
    .tagline { color: #57534e; font-size: 0.85rem; margin: 1rem 0; line-height: 1.6; }
    .intro {
      text-align: right;
      margin: 1.25rem 0;
      padding: 1rem;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      background: #faf9f7;
    }
    .intro h2 { color: #1a3278; font-size: 1.15rem; margin-bottom: 0.85rem; text-align: center; font-weight: 700; }
    .lead { font-size: 0.85rem; line-height: 1.65; color: #44403c; font-weight: 600; margin-bottom: 0.65rem; }
    .para { font-size: 0.8rem; line-height: 1.65; color: #57534e; margin-bottom: 0.55rem; }
    .summary { font-size: 0.82rem; line-height: 1.6; color: #1a3278; font-weight: 600; margin-top: 0.5rem; }
    .quote {
      font-family: Georgia, serif;
      color: #1a3278;
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.55;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px dashed #d6d3d1;
    }
    .scan { color: #1a3278; font-weight: 600; font-size: 0.9rem; margin-top: 1rem; }
    .url { color: #a8a29e; font-size: 0.75rem; margin-top: 0.35rem; font-family: monospace; word-break: break-all; }
    @media print { body { padding: 0.5rem; } }
  </style>
</head>
<body>
  <div class="card">
    <img class="qr" src="${qrDataUrl}" alt="QR Code" />
    <h1>GO'S MART</h1>
    <p class="tagline">${MART_SUBTITLE}</p>
    <div class="intro">
      <h2>${MART_INTRO_TITLE}</h2>
      ${introHtml()}
      <p class="quote">${MART_QUOTE}</p>
    </div>
    <p class="scan">امسح الكود للاطلاع على المنيو الرقمي</p>
    <p class="url">${menuUrl.replace(/^https?:\/\//, "")}</p>
  </div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=520,height=820");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

export function MenuQrCard() {
  const [menuUrl, setMenuUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = getMenuPublicUrl();
    setMenuUrl(url);
    generateQrWithLogo({
      url,
      logoSrc: `${window.location.origin}/logo.png`,
      size: 480,
      logoRatio: 0.14,
    })
      .then(setQrDataUrl)
      .catch(() => setError("تعذّر إنشاء QR — حدّث الصفحة"));
  }, []);

  const downloadPng = useCallback(async () => {
    if (!menuUrl || downloading || !qrDataUrl) return;
    setDownloading(true);
    try {
      const w = 520;
      const h = 1100;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      const qrImg = await loadImage(qrDataUrl);
      const qrSize = 280;
      ctx.drawImage(qrImg, (w - qrSize) / 2, 24, qrSize, qrSize);

      let y = qrSize + 48;
      ctx.fillStyle = "#1a3278";
      ctx.font = "bold 26px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("GO'S MART", w / 2, y);
      y += 28;
      ctx.fillStyle = "#7a5234";
      ctx.font = "14px sans-serif";
      ctx.fillText(MART_SUBTITLE, w / 2, y);
      y += 32;

      ctx.fillStyle = "#57534e";
      ctx.font = "12px sans-serif";
      y += wrapText(ctx, MART_INTRO_LEAD, w / 2, y, w - 48, 18) + 16;

      ctx.textAlign = "right";
      ctx.fillStyle = "#44403c";
      for (const para of MART_INTRO_PARAGRAPHS) {
        y += wrapText(ctx, para.replace(/\n/g, " "), w - 32, y, w - 64, 18) + 12;
      }

      ctx.textAlign = "center";
      ctx.fillStyle = "#1a3278";
      ctx.font = "600 12px sans-serif";
      y += wrapText(ctx, MART_INTRO_SUMMARY, w / 2, y, w - 48, 18) + 16;

      ctx.font = "600 13px Georgia, serif";
      y += wrapText(ctx, MART_QUOTE, w / 2, y, w - 48, 18) + 24;

      ctx.font = "600 13px sans-serif";
      ctx.fillStyle = "#1a3278";
      ctx.fillText("امسح للاطلاع على المنيو", w / 2, y);
      ctx.fillStyle = "#a8a29e";
      ctx.font = "11px monospace";
      ctx.fillText(menuUrl.replace(/^https?:\/\//, ""), w / 2, y + 22);

      const link = document.createElement("a");
      link.download = "gosmart-menu-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  }, [downloading, menuUrl, qrDataUrl]);

  return (
    <div className="rounded-2xl bg-white border border-stone-200 card-shadow overflow-hidden sticky top-6">
      <div className="bg-brand-blue px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          <h2 className="font-serif text-lg font-bold">QR Code المنيو</h2>
        </div>
        <p className="text-white/75 text-xs mt-1 font-arabic">اطبعه مع المقدمة — للطاولات أو الكاشير</p>
      </div>

      <div className="p-6 flex flex-col items-center">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt="QR Code للمنيو"
            width={240}
            height={240}
            className="rounded-xl border border-stone-100"
          />
        ) : (
          <div className="h-[240px] w-[240px] rounded-xl skeleton flex items-center justify-center text-xs text-stone-400 px-4 text-center">
            {error || "جاري إنشاء QR…"}
          </div>
        )}

        <p className="font-serif font-bold text-brand-blue mt-4 text-lg">GO&apos;S MART</p>
        <p className="font-arabic text-sm text-stone-600 mt-2 text-center leading-relaxed px-2">
          {MART_INTRO_LEAD}
        </p>
        <p className="text-[11px] text-stone-400 mt-2 font-mono text-center break-all px-2">
          {menuUrl || "…"}
        </p>

        <div className="flex flex-col w-full gap-2 mt-5">
          <button
            type="button"
            onClick={() => qrDataUrl && openPrintWindow(menuUrl, qrDataUrl)}
            disabled={!qrDataUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-blue/90 transition disabled:opacity-50"
          >
            <Printer className="h-4 w-4" />
            طباعة QR + المقدمة
          </button>
          <button
            type="button"
            onClick={downloadPng}
            disabled={downloading || !qrDataUrl}
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
      lines++;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cy);
    lines++;
  }
  return lines * lineHeight;
}
