import type { Metadata } from "next";
import { PortaoExperience } from "./PortaoExperience";

export const metadata: Metadata = {
  title: "Enquanto durar a fé — Portão | POC",
  description: "Experimento de scroll para o romance Enquanto durar a fé, de Deiver Brito.",
  robots: { index: false, follow: false },
};

export default function EnquantoDurarAFePage() {
  return <PortaoExperience />;
}
