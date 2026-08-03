import { Section } from "./Section";
import styles from "./ExperiencePrinciples.module.css";

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

export function ExperiencePrinciples() {
  return (
    <Section id="principles" number="07" eyebrow="Experience principles" title="Four principles guided every interaction decision">
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
