import type { Metadata } from "next";
import { JotaModelo } from "./JotaModelo";

export const metadata: Metadata = {
  title: "Enquanto durar a fé — Jota 3D | POC",
  description: "O modelo 3D do Jota na luz do Portão, para girar e aproximar.",
  robots: { index: false, follow: false },
};

export default function Jota3DPage() {
  return <JotaModelo />;
}
