import QRCode from "qrcode";

type QrWithLogoOptions = {
  url: string;
  logoSrc: string;
  size?: number;
  logoRatio?: number;
};

/** High error-correction QR with small centered logo (scannable on mobile). */
export async function generateQrWithLogo({
  url,
  logoSrc,
  size = 480,
  logoRatio = 0.14,
}: QrWithLogoOptions): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  await QRCode.toCanvas(canvas, url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: size,
    color: { dark: "#1a3278", light: "#ffffff" },
  });

  const logo = await loadImage(logoSrc);
  const logoSize = Math.round(size * logoRatio);
  const x = (size - logoSize) / 2;
  const y = (size - logoSize) / 2;
  const pad = Math.round(logoSize * 0.12);

  ctx.fillStyle = "#ffffff";
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, pad);
    ctx.fill();
  } else {
    ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);
  }
  ctx.drawImage(logo, x, y, logoSize, logoSize);

  return canvas.toDataURL("image/png");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
