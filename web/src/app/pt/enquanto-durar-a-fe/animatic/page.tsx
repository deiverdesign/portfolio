import type { Metadata } from "next";
import { PortaoAnimatic } from "./PortaoAnimatic";

export const metadata: Metadata = {
  title: "Enquanto durar a fé — Portão animatic | POC",
  description: "Animatic espacial de câmera para a cena Portão.",
  robots: { index: false, follow: false },
};

export default function PortaoAnimaticPage() {
  return <PortaoAnimatic />;
}
