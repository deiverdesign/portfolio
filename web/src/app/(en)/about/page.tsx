import type { Metadata } from "next";
import { AboutPageV3 } from "@/components/AboutPageV3/AboutPageV3";

export const metadata: Metadata = {
  title: "About — Deiver Brito",
  description: "Senior Product Designer based in Brazil, with experience in enterprise products, legal tech and design systems.",
  alternates: { languages: { "pt-BR": "/pt/sobre", en: "/about" } },
};

export default function EnAboutPage() {
  return <AboutPageV3 locale="en" />;
}
