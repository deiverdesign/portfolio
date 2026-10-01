import type { Metadata } from "next";
import { HomeV3 } from "@/components/HomeV3/HomeV3";

export const metadata: Metadata = {
  title: "Deiver Brito — Senior Product Designer",
  description: "Designing clarity for complex digital products.",
  alternates: { languages: { "pt-BR": "/pt", en: "/" } },
};

export default function EnHome() {
  return <HomeV3 locale="en" />;
}
