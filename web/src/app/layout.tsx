import type { Metadata } from "next";
import { DM_Sans, Boldonse } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
  title: "Deiver Brito — Product Designer Sênior",
  description: "Design para simplificar produtos complexos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${boldonse.variable}`}>
      <body>{children}</body>
    </html>
  );
}
