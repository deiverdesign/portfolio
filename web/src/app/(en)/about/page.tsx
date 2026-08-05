import type { Metadata } from "next";
import { AboutContent } from "../../_shared/AboutContent";

export const metadata: Metadata = {
  title: "About — Deiver Brito",
  description: "Senior Product Designer based in Brazil, with experience in enterprise products, legal tech and design systems.",
  alternates: { languages: { "pt-BR": "/pt/sobre", en: "/about" } },
};

export default function EnAboutPage() {
  return <AboutContent locale="en" />;
}
