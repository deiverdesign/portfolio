import type { Metadata } from "next";

import { IntuitPageV3 } from "@/components/IntuitPageV3/IntuitPageV3";

export const metadata: Metadata = { title: "Intuit — Deiver Brito (Prévia V3)", description: "Rota privada de revisão da próxima versão do portfólio.", robots: { index: false, follow: false } };

export default function PtIntuitV3Preview() { return <IntuitPageV3 locale="pt" />; }
