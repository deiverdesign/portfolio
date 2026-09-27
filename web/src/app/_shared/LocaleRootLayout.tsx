import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Newsreader } from "next/font/google";
import localFont from "next/font/local";

import type { Locale } from "@/content/i18n";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  weight: ["300", "500"],
  style: ["normal", "italic"],
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

const METADATA_BY_LOCALE = {
  en: {
    title: "Deiver Brito — Senior Product Designer",
    description: "Design to simplify complex products.",
  },
  pt: {
    title: "Deiver Brito — Product Designer Sênior",
    description: "Design para simplificar produtos complexos.",
  },
} as const;

export function buildLocaleMetadata(locale: Locale): Metadata {
  return {
    // Preservado nesta fundação. A troca para deiver.com.br depende da auditoria de domínio/Vercel.
    metadataBase: new URL("https://portfolio-deiver.vercel.app"),
    ...METADATA_BY_LOCALE[locale],
    alternates: {
      languages: { "pt-BR": "/pt", en: "/" },
    },
  };
}

export function LocaleRootLayout({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
}>) {
  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${dmSans.variable} ${dmMono.variable} ${renamor.variable} ${newsreader.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
