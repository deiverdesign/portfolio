import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import { PortaoMaterial } from "./PortaoMaterial";

// Fonte dos títulos do hotsite (Figma: Newsreader 14pt Light). Só esta página carrega.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// Só as linhas de crédito dos bilhetes (— JOTA, CAPÍTULO 1 — A SUBIDA) usam a Plex Mono.
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "500", display: "swap" });

// URLs absolutas (não usa o metadataBase do layout, que aponta pro domínio
// genérico do portfólio) — o hotsite tem domínio próprio, enquantodurarafe.com.br.
const SITE_URL = "https://enquantodurarafe.com.br";
const TITLE = "Enquanto durar a fé — Um romance de Deiver Brito";
const DESCRIPTION = "Jota vende Bíblias de porta em porta. Enquanto sua mãe guarda um segredo, uma história volta no tempo para revelar o que o presente esconde.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Tirado o noindex/nofollow (herdado de quando isso era só um POC dentro
  // do portfólio) — agora é um site publicado com domínio próprio, deve
  // ser indexado e rastreado normalmente (Deiver, 16/10 — inscrito no CSS
  // Design Awards, que também depende de conseguir rastrear a página).
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    locale: "pt_BR",
    type: "website",
    images: [{ url: `${SITE_URL}/enquanto-durar-a-fe/og-cover.jpg`, width: 1200, height: 630, alt: "" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/enquanto-durar-a-fe/og-cover.jpg`],
  },
};

export default function PortaoMaterialPage() {
  return (
    <div className={newsreader.variable}>
      <PortaoMaterial creditFont={plexMono.style.fontFamily} />
    </div>
  );
}
