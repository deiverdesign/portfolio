import type { Metadata } from "next";

import { HpPageV3 } from "@/components/HpPageV3/HpPageV3";

export const metadata: Metadata = {
  title: "HP — Deiver Brito (Preview do portfólio V3)",
  description: "Rota privada de revisão da próxima versão do portfólio.",
  robots: { index: false, follow: false },
};

export default function PtHpV3Preview() {
  return <HpPageV3 locale="pt" />;
}
