import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

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
  title: "Deiver Brito — Senior Product Designer",
  description: "Design to simplify complex products.",
  alternates: {
    languages: { "pt-BR": "/pt", en: "/" },
  },
};

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${renamor.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
