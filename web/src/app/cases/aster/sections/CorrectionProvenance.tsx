import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";

const steps = [
  "Initial AI interpretation",
  "Physician correction",
  "Affected draft content updated",
  "Dependent insight updated or withdrawn",
  "Visible explanation of why it changed",
];

export function CorrectionProvenance() {
  return (
    <Section
      id="correction"
      number="13"
      eyebrow="Correction and provenance"
      title="Fixing an AI mistake shouldn't erase how it happened"
      tone="stone"
    >
      <p className={`${shared.pill} ${shared.pillStandalone}`}>
        Planned scenario — not yet in the live prototype
      </p>

      <p>
        Consultations get corrected mid-conversation — a name, a dose, a detail the AI
        misheard. The design question was how to let a physician fix that without quietly
        rewriting history.
      </p>

      <ol className={shared.list}>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <AssetPlaceholder assetId="aster-correction-needed" />

      <p className={shared.keyStatement}>
        AI errors must be correctable without erasing their provenance.
      </p>
    </Section>
  );
}
