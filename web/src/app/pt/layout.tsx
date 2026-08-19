import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Fonte usada no Figma pra números/labels pequenos (eyebrow, "01", legendas).
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

// Fonte display licenciada pela Envato para títulos de maior expressão.
const renamor = localFont({
  src: "../fonts/Renamor.otf",
  variable: "--font-renamor",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-deiver.vercel.app"),
  title: "Deiver Brito — Product Designer Sênior",
  description: "Design para simplificar produtos complexos.",
  alternates: {
    languages: { "pt-BR": "/pt", en: "/" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable} ${renamor.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
