import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { PortaoMaterial } from "./PortaoMaterial";

// Fonte dos títulos do hotsite (Figma: Newsreader 14pt Light). Só esta página carrega.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enquanto durar a fé — Um romance de Deiver Brito",
  description: "Jota vende Bíblias de porta em porta. Enquanto sua mãe guarda um segredo, uma história volta no tempo para revelar o que o presente esconde.",
  robots: { index: false, follow: false },
};

export default function PortaoMaterialPage() {
  return (
    <div className={newsreader.variable}>
      <PortaoMaterial />
    </div>
  );
}
