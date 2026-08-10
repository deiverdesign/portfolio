import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Boldonse } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Fonte usada no Figma pra números/labels pequenos (eyebrow, "01", legendas).
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: "400",
  subsets: ["latin"],
});

// Fonte de título/destaque usada no Figma (Case Study Title, headings de seção).
const boldonse = Boldonse({
  variable: "--font-boldonse",
  weight: "400",
  subsets: ["latin"],
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
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable} ${boldonse.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
