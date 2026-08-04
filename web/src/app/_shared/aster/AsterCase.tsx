import theme from "./aster-theme.module.css";
import { AsterHeader } from "./AsterHeader";
import { Hero } from "./sections/Hero";
import { HeroBanner } from "./sections/HeroBanner";
import { Disclaimer } from "./sections/Disclaimer";
import { HowItWorks } from "./sections/HowItWorks";
import { MyRole } from "./sections/MyRole";
import { TheHardPart } from "./sections/TheHardPart";
import { DesignDecisions } from "./sections/DesignDecisions";
import { FunctionalPrototype } from "./sections/FunctionalPrototype";
import { CannotClaim } from "./sections/CannotClaim";
import { WhatILearned } from "./sections/WhatILearned";
import { Closing } from "./sections/Closing";
import type { Locale } from "@/components/NavBar/NavBar";

/**
 * Case completo do ASTER — só renderizado depois que page.tsx confirma a
 * sessão. Storyboard v2: narrativa em 8 partes organizada pela sequência
 * de perguntas de um recrutador (o que é / como funciona / quem fez /
 * qual o desafio / decisões / protótipo / limites / aprendizado), não
 * pela cronologia do processo de discovery. Compartilhado pelas rotas PT
 * (/cases/aster) e EN (/en/cases/aster) via prop `locale`.
 */
export function AsterCase({ locale }: { locale: Locale }) {
  return (
    <div className={theme.theme}>
      <AsterHeader locale={locale} />
      <main>
        <Hero locale={locale} />
        <HeroBanner />
        <Disclaimer locale={locale} />
        <HowItWorks locale={locale} />
        <MyRole locale={locale} />
        <TheHardPart locale={locale} />
        <DesignDecisions locale={locale} />
        <FunctionalPrototype locale={locale} />
        <CannotClaim locale={locale} />
        <WhatILearned locale={locale} />
      </main>
      <Closing locale={locale} />
    </div>
  );
}
