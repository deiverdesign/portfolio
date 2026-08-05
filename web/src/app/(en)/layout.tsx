import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Boldonse } from "next/font/google";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: "400",
  subsets: ["latin"],
});

const boldonse = Boldonse({
  variable: "--font-boldonse",
  weight: "400",
  subsets: ["latin"],
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
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${boldonse.variable}`}>
      <body>{children}</body>
    </html>
  );
}
