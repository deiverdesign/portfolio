import { Section } from "./Section";
import shared from "./shared.module.css";
import styles from "./WhyItMatters.module.css";

const demands = ["Listen", "Reason", "Remember", "Search", "Document", "Maintain attention"];

const connections = ["Physician", "Consultation", "Fragmented records", "Evidence", "Documentation"];

export function WhyItMatters() {
  return (
    <Section id="why-it-matters" number="01" eyebrow="Why this problem matters" title="A physician does six things at once" tone="stone">
      <p>
        During a single consultation, a physician has to listen to the patient, reason about
        what they&apos;re hearing, remember relevant history, search for supporting evidence,
        document what happened, and maintain attention on the person in front of them — at the
        same time.
      </p>

      <div className={shared.pillRow}>
        {demands.map((demand) => (
          <span key={demand} className={shared.pill}>
            {demand}
          </span>
        ))}
      </div>

      <p className={shared.keyStatement}>
        The physician is simultaneously caring for the patient and maintaining the medical
        record.
      </p>

      <div className={styles.chain} role="img" aria-label="Physician, consultation, fragmented records, evidence, and documentation are all connected and compete for the same attention.">
        {connections.map((node, index) => (
          <span key={node} className={styles.chainStep}>
            <span className={styles.chainNode}>{node}</span>
            {index < connections.length - 1 && (
              <span className={styles.chainArrow} aria-hidden="true">
                →
              </span>
            )}
          </span>
        ))}
      </div>
    </Section>
  );
}
