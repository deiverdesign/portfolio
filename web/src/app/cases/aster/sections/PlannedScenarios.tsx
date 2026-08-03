import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { StatusTag } from "./StatusTag";
import shared from "./shared.module.css";

const pauseBehaviors = [
  "Recording paused",
  "No transcription while paused",
  "No generated insight during the missing interval",
  "Physician notes remain available",
  "Explicit gap marker after resuming",
];

const correctionSteps = [
  "Initial AI interpretation",
  "Physician correction",
  "Affected draft content updated",
  "Dependent insight updated or withdrawn",
  "Visible explanation of why it changed",
];

export function PlannedScenarios() {
  return (
    <Section
      id="planned-scenarios"
      number="09"
      eyebrow="Planned scenarios: pause and correction"
      title="Two scenarios planned, not yet built"
      tone="stone"
    >
      <StatusTag status="future" />

      <p>
        Two behaviors were designed but are not yet implemented in the live prototype: pausing
        recording, and correcting the AI mid-consultation.
      </p>

      <h3 className={shared.subheading}>Pausing capture</h3>
      <p>
        A physician needs to be able to pause capture — for a sensitive moment, an interruption,
        or simply because they want to. When they do, ASTER is designed to make that pause
        visible everywhere, not just on the record button.
      </p>

      <ul className={shared.list}>
        {pauseBehaviors.map((behavior) => (
          <li key={behavior}>{behavior}</li>
        ))}
      </ul>

      <AssetPlaceholder assetId="aster-recording-paused" />

      <p className={shared.keyStatement}>Missing information must remain visibly missing.</p>

      <h3 className={shared.subheading}>Correcting mid-consultation</h3>
      <p>
        Consultations get corrected mid-conversation — a name, a dose, a detail the AI
        misheard. The design question was how to let a physician fix that without quietly
        rewriting history.
      </p>

      <ol className={shared.list}>
        {correctionSteps.map((step) => (
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
