import type { Metadata } from "next";

import { TheodoorPageV3 } from "@/components/TheodoorPageV3/TheodoorPageV3";

export const metadata: Metadata = { title: "Theodoor — Deiver Brito (Prévia V3)", description: "Rota privada de revisão da próxima versão do portfólio.", robots: { index: false, follow: false } };

export default function PtTheodoorV3Preview() { return <TheodoorPageV3 locale="pt" />; }
