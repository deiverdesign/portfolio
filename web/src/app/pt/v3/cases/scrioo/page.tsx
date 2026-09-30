import type { Metadata } from "next";

import { ScriooPageV3 } from "@/components/ScriooPageV3/ScriooPageV3";

export const metadata: Metadata = {
  title: "SCRIOO — Deiver Brito (Preview do portfólio V3)",
  description: "Rota privada de revisão da próxima versão do portfólio.",
  robots: { index: false, follow: false },
};

export default function PtScriooV3Preview() {
  return <ScriooPageV3 locale="pt" />;
}
