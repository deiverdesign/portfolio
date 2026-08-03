import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";
import styles from "./InternalSimulation.module.css";

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

export function InternalSimulation() {
  return (
    <Section
      id="simulation"
      number="05"
      eyebrow="Proposed internal simulation"
      title="A design-led way to test before clinical validation"
    >
      <p>
        Before any clinical validation could happen, the concept needed a way to find its own
        breaking points. The proposal: a scripted, internally-run simulation, not a real patient
        interaction.
      </p>

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
    </Section>
  );
}
