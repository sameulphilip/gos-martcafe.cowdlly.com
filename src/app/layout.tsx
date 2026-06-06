import type { Metadata } from "next";
import { Playfair_Display, Inter, Cairo } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GO'S MART | Student Cafe & Gaming Zone",
  description:
    "GO'S MART - Your perfect spot for studying, coffee, snacks, and gaming. Made for students.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${playfair.variable} ${inter.variable} ${cairo.variable}`}
    >
      <body className="font-arabic">{children}</body>
    </html>
  );
}
