import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";
import styles from "./HowItWorks.module.css";

const flow = [
  "Device captures",
  "Patient is confirmed",
  "Transcript builds",
  "Context and Insights appear",
  "Physician reviews the notes",
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow="How it works" title="Three things stay visible together" tone="stone">
      <div className={styles.macro}>
        <AssetPlaceholder assetId="aster-device-control-macro" />
        <p className={shared.caption}>Designed for quick, discreet control during the consultation.</p>
      </div>

      <AssetPlaceholder assetId="aster-macbook-mockup" />

      <p className={styles.reconstructionCaption}>
        Functional portfolio reconstruction based on the interaction model I designed. Fictional
        data; not the original client interface.
      </p>

      <p>
        During the consultation, ASTER keeps three things visible together: what is known about
        the patient, what is being said, and what is being documented.
      </p>

      <div className={styles.flow} role="img" aria-label={`Flow: ${flow.join(" → ")}`}>
        {flow.map((step, index) => (
          <span key={step} className={styles.flowStep}>
            <span className={styles.flowNode}>{step}</span>
            {index < flow.length - 1 && (
              <span className={styles.flowArrow} aria-hidden="true">
                →
              </span>
            )}
          </span>
        ))}
      </div>
    </Section>
  );
}
