import type { Metadata } from "next";
import { HomeContent } from "../_shared/HomeContent";

export const metadata: Metadata = {
  title: "Deiver Brito — Senior Product Designer",
  description: "Design to simplify complex products.",
  alternates: { languages: { "pt-BR": "/", en: "/en" } },
};

export default function EnHome() {
  return <HomeContent locale="en" />;
}
