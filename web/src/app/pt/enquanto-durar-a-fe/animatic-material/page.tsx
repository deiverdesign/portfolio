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

export const metadata: Metadata = {
  title: "Enquanto durar a fé — Um romance de Deiver Brito",
  description: "Jota vende Bíblias de porta em porta. Enquanto sua mãe guarda um segredo, uma história volta no tempo para revelar o que o presente esconde.",
  robots: { index: false, follow: false },
};

export default function PortaoMaterialPage() {
  return (
    <div className={newsreader.variable}>
      <PortaoMaterial creditFont={plexMono.style.fontFamily} />
    </div>
  );
}
