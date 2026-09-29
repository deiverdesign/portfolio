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
  // 300/500 cobriam --font-weight-editorial-light/medium, mas faltava o
  // 400 (--font-weight-editorial-regular) — usado em vários títulos
  // (Brands, Capabilities, etc.). Sem o peso 400 carregado, o navegador
  // sintetiza a partir do 300 mais próximo, deixando esses títulos mais
  // finos que o Figma (achado do Deiver comparando screenshots lado a
  // lado em 28/09/2026).
  weight: ["300", "400", "500"],
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
      {/* Extensões como Grammarly injetam atributos no <body> antes do
          React hidratar (data-gr-ext-installed, data-new-gr-c-s-check-
          loaded) — o React compara e reclama de "mismatch" mesmo não
          havendo bug nenhum nosso. suppressHydrationWarning aqui é o
          fix padrão do Next.js pra esse caso específico: só ignora
          diffs de ATRIBUTOS deste elemento, não afeta o conteúdo. */}
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
