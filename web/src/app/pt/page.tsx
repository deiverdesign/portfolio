import type { Metadata } from "next";
import { HomeContent } from "../_shared/HomeContent";

export const metadata: Metadata = {
  title: "Deiver Brito — Product Designer Sênior",
  description: "Design para simplificar produtos complexos.",
  alternates: { languages: { "pt-BR": "/pt", en: "/" } },
};

export default function Home() {
  return <HomeContent locale="pt" />;
}
