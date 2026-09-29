import type { Metadata } from "next";

import { AboutPageV3 } from "@/components/AboutPageV3/AboutPageV3";

export const metadata: Metadata = {
  title: "Deiver Brito — Sobre (Preview do portfólio V3)",
  description: "Rota privada de revisão da próxima versão do portfólio.",
  robots: { index: false, follow: false },
};

export default function PtAboutV3Preview() {
  return <AboutPageV3 locale="pt" />;
}
