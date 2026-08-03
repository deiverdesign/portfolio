import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { StatusTag } from "./StatusTag";
import { ASTER_FIGJAM_URL } from "./links";
import shared from "./shared.module.css";
import styles from "./QuestionsAndSimulation.module.css";

const questions = [
  "When should AI interrupt?",
  "What happens when AI disagrees with the physician?",
  "How should uncertainty be communicated?",
  "What sources support each insight?",
  "Should AI update its reasoning when the physician adds information?",
  "How do we prevent the wrong patient context from being loaded?",
  "Who owns the final decision?",
  "What happens when the AI is wrong?",
];

const structure = [
  "Internal participant acting as physician",
  "Internal participant acting as patient",
  "Scripted consultation",
  "Controlled variations and deliberate edge cases",
  "Observation of breakdowns",
  "Documentation of missing safeguards and interaction rules",
];

const scenarios = [
  "Similar voices",
  "Ambiguous names",
  "Wrong-patient risk",
  "Unconventional medication",
  "Multiple speakers",
  "Contradictory information",
  "Noisy audio",
  "Inappropriate interruption",
  "Information corrected during the consultation",
];

export function QuestionsAndSimulation() {
  return (
    <Section
      id="questions"
      number="05"
      eyebrow="Questions that shaped the concept"
      title="Before any screen, a set of hard questions"
      tone="stone"
    >
      <StatusTag status="explored" />

      <AssetPlaceholder assetId="aster-figjam-overview" />

      <ul className={shared.list}>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>

      <p>
        These questions did not produce definitive clinical answers. They shaped the boundaries
        and behavior of the concept.
      </p>

      <AssetPlaceholder assetId="aster-figjam-critical-questions" />

      <p>
        Before any clinical validation could happen, the concept needed a way to find its own
        breaking points — testing these questions, not just answering them.
      </p>

      <h3 className={shared.subheading}>A proposed internal simulation</h3>
      <StatusTag status="proposed" />

      <p>The proposal: a scripted, internally-run simulation, not a real patient interaction.</p>

      <ol className={shared.list}>
        {structure.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className={styles.compare}>
        <div className={shared.card}>
          <span className={shared.cardTitle}>QA</span>
          <p className={shared.cardText}>Tests whether a system meets its requirements.</p>
        </div>
        <div className={shared.card}>
          <span className={shared.cardTitle}>Design-led simulation</span>
          <p className={shared.cardText}>
            Helps discover which requirements, safeguards and interaction rules are still
            missing.
          </p>
        </div>
      </div>

      <p>Potential simulations considered:</p>
      <div className={shared.pillRow}>
        {scenarios.map((scenario) => (
          <span key={scenario} className={shared.pill}>
            {scenario}
          </span>
        ))}
      </div>

      <AssetPlaceholder assetId="aster-figjam-simulation" />

      <p className={shared.keyStatement}>
        The purpose was not to prove that the system was safe. It was to discover where the
        interaction model could fail.
      </p>

      <ExternalLink href={ASTER_FIGJAM_URL}>Explore the discovery board</ExternalLink>
    </Section>
  );
}
