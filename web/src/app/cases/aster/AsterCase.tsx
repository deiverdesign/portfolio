import theme from "./aster-theme.module.css";
import { AsterHeader } from "./AsterHeader";
import { Hero } from "./sections/Hero";
import { Disclaimer } from "./sections/Disclaimer";
import { WhyItMatters } from "./sections/WhyItMatters";
import { BeyondScribe } from "./sections/BeyondScribe";
import { Viability } from "./sections/Viability";
import { QuestionsBeforeInterfaces } from "./sections/QuestionsBeforeInterfaces";
import { InternalSimulation } from "./sections/InternalSimulation";
import { CollaborationBoundary } from "./sections/CollaborationBoundary";
import { ExperiencePrinciples } from "./sections/ExperiencePrinciples";
import { ProductWalkthrough } from "./sections/ProductWalkthrough";
import { PatientIdentity } from "./sections/PatientIdentity";
import { RestrainedInsights } from "./sections/RestrainedInsights";
import { DraftVsNotes } from "./sections/DraftVsNotes";
import { RecordingControl } from "./sections/RecordingControl";
import { CorrectionProvenance } from "./sections/CorrectionProvenance";
import { DiscoveryToDecisions } from "./sections/DiscoveryToDecisions";
import { HardNoConditions } from "./sections/HardNoConditions";
import { OutcomeReflection } from "./sections/OutcomeReflection";
import { Closing } from "./sections/Closing";

/** Case completo do ASTER — só renderizado depois que page.tsx confirma a sessão. */
export function AsterCase() {
  return (
    <div className={theme.theme}>
      <AsterHeader />
      <main>
        <Hero />
        <Disclaimer />
        <WhyItMatters />
        <BeyondScribe />
        <Viability />
        <QuestionsBeforeInterfaces />
        <InternalSimulation />
        <CollaborationBoundary />
        <ExperiencePrinciples />
        <ProductWalkthrough />
        <PatientIdentity />
        <RestrainedInsights />
        <DraftVsNotes />
        <RecordingControl />
        <CorrectionProvenance />
        <DiscoveryToDecisions />
        <HardNoConditions />
        <OutcomeReflection />
      </main>
      <Closing />
    </div>
  );
}
