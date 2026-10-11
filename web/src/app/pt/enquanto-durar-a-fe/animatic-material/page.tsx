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
  description: "Jota bate de porta em porta vendendo Bíblias. A fé alheia, ele conhece de cor.",
  robots: { index: false, follow: false },
};

export default function PortaoMaterialPage() {
  return (
    <div className={newsreader.variable}>
      <PortaoMaterial />
    </div>
  );
}
