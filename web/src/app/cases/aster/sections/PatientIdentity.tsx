import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { StatusTag } from "./StatusTag";
import shared from "./shared.module.css";

const states = [
  { assetId: "aster-known-patient" as const, title: "Known patient" },
  { assetId: "aster-unknown-patient" as const, title: "Unknown patient" },
  { assetId: "aster-ambiguous-match" as const, title: "Ambiguous match" },
];

const rules = [
  "Identity is never inferred silently",
  "Ambiguous matches require explicit confirmation",
  "Historical context remains unavailable until confirmation",
  "Consultation capture may continue without attaching unverified records",
];

export function PatientIdentity() {
  return (
    <Section
      id="patient-identity"
      number="07"
      eyebrow="Patient identity and ambiguity"
      title="Getting identity wrong is worse than not knowing it yet"
    >
      <StatusTag status="implemented" />

      <p className={shared.keyStatement}>No patient context is safer than the wrong patient context.</p>

      <div className={shared.grid3}>
        {states.map((state) => (
          <div key={state.assetId}>
            <AssetPlaceholder assetId={state.assetId} />
            <p className={shared.caption}>{state.title}</p>
          </div>
        ))}
      </div>

      <ul className={shared.list}>
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </Section>
  );
}
