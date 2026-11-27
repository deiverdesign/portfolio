import type { Metadata } from "next";
import { JotaCorpo } from "./JotaCorpo";

export const metadata: Metadata = {
  title: "Enquanto durar a fé — Jota / corpo | POC",
  description: "Teste de proporção do corpo do Jota: três graus de estiramento com 1,83 m, na luz do Portão.",
  robots: { index: false, follow: false },
};

export default function JotaCorpoPage() {
  return <JotaCorpo />;
}
