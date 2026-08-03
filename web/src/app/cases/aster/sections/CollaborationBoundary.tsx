import { Section } from "./Section";
import shared from "./shared.module.css";
import styles from "./CollaborationBoundary.module.css";

const flow = [
  "Patient conversation",
  "AI interpretation",
  "Possible insight",
  "Evidence and confidence",
  "Physician review",
  "Clinical decision",
  "Documentation",
];

export function CollaborationBoundary() {
  return (
    <Section
      id="boundary"
      number="06"
      eyebrow="Designing the collaboration boundary"
      title="Where AI's role ends and the physician's begins"
      tone="forestDeep"
    >
      <div className={styles.flow} role="img" aria-label={`Flow: ${flow.join(" → ")}.`}>
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

      <div className={shared.grid2}>
        <div className={shared.cardOnDark}>
          <span className={shared.cardTitle}>AI</span>
          <p className={shared.cardText}>Captures. Organizes. Suggests. Explains.</p>
        </div>
        <div className={shared.cardOnDark}>
          <span className={shared.cardTitle}>Physician</span>
          <p className={shared.cardText}>Interprets. Decides. Documents. Owns responsibility.</p>
        </div>
      </div>

      <p className={shared.keyStatementOnDark}>
        AI supports reasoning. The physician remains accountable.
      </p>
    </Section>
  );
}
