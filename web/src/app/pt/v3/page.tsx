import type { Metadata } from "next";

import { HomeV3 } from "@/components/HomeV3/HomeV3";

export const metadata: Metadata = {
  title: "Deiver Brito — Preview do portfólio V3",
  description: "Rota privada de revisão da próxima versão do portfólio.",
  robots: { index: false, follow: false },
};

export default function PtHomeV3Preview() {
  return <HomeV3 locale="pt" />;
}
