import theme from "./aster-theme.module.css";
import { AsterHeader } from "./AsterHeader";
import { Hero } from "./sections/Hero";
import { Disclaimer } from "./sections/Disclaimer";
import { HowItWorks } from "./sections/HowItWorks";
import { MyRole } from "./sections/MyRole";
import { TheHardPart } from "./sections/TheHardPart";
import { DesignDecisions } from "./sections/DesignDecisions";
import { FunctionalPrototype } from "./sections/FunctionalPrototype";
import { CannotClaim } from "./sections/CannotClaim";
import { WhatILearned } from "./sections/WhatILearned";
import { Closing } from "./sections/Closing";

/**
 * Case completo do ASTER — só renderizado depois que page.tsx confirma a
 * sessão. Storyboard v2: narrativa em 8 partes organizada pela sequência
 * de perguntas de um recrutador (o que é / como funciona / quem fez /
 * qual o desafio / decisões / protótipo / limites / aprendizado), não
 * pela cronologia do processo de discovery.
 */
export function AsterCase() {
  return (
    <div className={theme.theme}>
      <AsterHeader />
      <main>
        <Hero />
        <Disclaimer />
        <HowItWorks />
        <MyRole />
        <TheHardPart />
        <DesignDecisions />
        <FunctionalPrototype />
        <CannotClaim />
        <WhatILearned />
      </main>
      <Closing />
    </div>
  );
}
