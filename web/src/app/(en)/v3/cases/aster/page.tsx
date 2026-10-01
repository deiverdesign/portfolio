import type { Metadata } from "next";
import { isAsterUnlocked } from "@/app/_shared/aster/session";
import { PasswordGate } from "@/app/_shared/aster/PasswordGate";
import { AsterPageV3 } from "@/components/AsterPageV3/AsterPageV3";
export const metadata: Metadata = { title:"Aster — Deiver Brito (Portfolio V3 preview)", description:"Private review route for the next portfolio version.", robots:{index:false,follow:false} };
export default async function EnAsterV3Preview(){
  if (!await isAsterUnlocked()) return <PasswordGate locale="en"/>;
  return <AsterPageV3 locale="en"/>;
}
