import type { Metadata } from "next";
import { isAsterUnlocked } from "@/app/_shared/aster/session";
import { PasswordGate } from "@/app/_shared/aster/PasswordGate";
import { AsterPageV3 } from "@/components/AsterPageV3/AsterPageV3";
export const metadata: Metadata = { title:"Aster — Deiver Brito (Prévia V3)", description:"Rota privada de revisão da próxima versão do portfólio.", robots:{index:false,follow:false} };
export default async function PtAsterV3Preview(){
  if (!await isAsterUnlocked()) return <PasswordGate locale="pt"/>;
  return <AsterPageV3 locale="pt"/>;
}
