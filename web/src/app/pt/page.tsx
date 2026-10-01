import type { Metadata } from "next";
import { HomeV3 } from "@/components/HomeV3/HomeV3";

export const metadata: Metadata = {
  title: "Deiver Brito — Product Designer Sênior",
  description: "Clareza de design para produtos digitais complexos.",
  alternates: { languages: { "pt-BR": "/pt", en: "/" } },
};

export default function Home() {
  return <HomeV3 locale="pt" />;
}
