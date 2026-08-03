import { Section } from "./Section";
import { StatusTag } from "./StatusTag";
import shared from "./shared.module.css";
import styles from "./PrinciplesAndBoundary.module.css";

const flow = [
  "Patient conversation",
  "AI interpretation",
  "Possible insight",
  "Evidence and confidence",
  "Physician review",
  "Clinical decision",
  "Documentation",
];

const principles = [
  {
    title: "Preserve attention",
    text: "The physician should focus on the patient, not another screen.",
  },
  {
    title: "Suggest, do not decide",
    text: "AI should surface considerations, not conclusions presented as authority.",
  },
  {
    title: "Make outputs traceable",
    text: "Every important insight should explain why it appeared.",
  },
  {
    title: "Preserve authorship",
    text: "AI-generated notes and physician-authored notes remain distinct.",
  },
];

export function PrinciplesAndBoundary() {
  return (
    <Section
      id="boundary"
      number="06"
      eyebrow="Principles and the collaboration boundary"
      title="Where AI's role ends and the physician's begins"
      tone="forestDeep"
    >
      <StatusTag status="explored" onDark />

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

      <p className={styles.bridge}>
        That boundary shows up as four concrete principles, expressed in the product itself:
      </p>

      <div className={styles.grid}>
        {principles.map((principle, index) => (
          <div key={principle.title} className={styles.principle}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={styles.title}>{principle.title}</h3>
            <p className={styles.text}>{principle.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
