import theme from "./aster-theme.module.css";
import { AsterHeader } from "./AsterHeader";
import { Hero } from "./sections/Hero";
import { Disclaimer } from "./sections/Disclaimer";
import { StatusLegend } from "./sections/StatusLegend";
import { ProblemAndOpportunity } from "./sections/ProblemAndOpportunity";
import { ProductWalkthrough } from "./sections/ProductWalkthrough";
import { WhatIDrove } from "./sections/WhatIDrove";
import { Viability } from "./sections/Viability";
import { QuestionsAndSimulation } from "./sections/QuestionsAndSimulation";
import { PrinciplesAndBoundary } from "./sections/PrinciplesAndBoundary";
import { PatientIdentity } from "./sections/PatientIdentity";
import { DocumentationAndInsights } from "./sections/DocumentationAndInsights";
import { PlannedScenarios } from "./sections/PlannedScenarios";
import { DiscoveryToDecisions } from "./sections/DiscoveryToDecisions";
import { HardNoConditions } from "./sections/HardNoConditions";
import { OutcomeReflection } from "./sections/OutcomeReflection";
import { Closing } from "./sections/Closing";

/**
 * Case completo do ASTER — só renderizado depois que page.tsx confirma a
 * sessão. Arquitetura editorial de 12 capítulos (revisão 2), aprovada
 * depois da primeira versão de 16 — protótipo e contribuição pessoal
 * aparecem logo no início, discovery redistribuído depois do produto.
 */
export function AsterCase() {
  return (
    <div className={theme.theme}>
      <AsterHeader />
      <main>
        <Hero />
        <Disclaimer />
        <StatusLegend />
        <ProblemAndOpportunity />
        <ProductWalkthrough />
        <WhatIDrove />
        <Viability />
        <QuestionsAndSimulation />
        <PrinciplesAndBoundary />
        <PatientIdentity />
        <DocumentationAndInsights />
        <PlannedScenarios />
        <DiscoveryToDecisions />
        <HardNoConditions />
        <OutcomeReflection />
      </main>
      <Closing />
    </div>
  );
}
