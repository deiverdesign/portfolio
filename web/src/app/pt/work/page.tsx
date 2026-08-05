import type { Metadata } from "next";
import { WorkContent } from "../../_shared/WorkContent";

export const metadata: Metadata = {
  title: "Trabalho — Deiver Brito",
  description: "Uma seleção focada de trabalhos em product design envolvendo plataformas complexas, UX de serviços, acessibilidade, prototipação assistida por IA e discovery de produto.",
  alternates: { languages: { "pt-BR": "/pt/work", en: "/work" } },
};

export default function WorkPage() {
  return <WorkContent locale="pt" />;
}
