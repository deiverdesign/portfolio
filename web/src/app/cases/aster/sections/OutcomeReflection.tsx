import { Section } from "./Section";
import shared from "./shared.module.css";
import styles from "./OutcomeReflection.module.css";

const outcomes = [
  "A clearer model of AI–physician collaboration",
  "Explicit interaction boundaries",
  "A discovery framework for high-risk questions",
  "A scenario-based testing proposal",
  "A functional interactive prototype",
  "Separation between AI-generated and physician-authored content",
  "Recovery and control behaviors",
  "Clearly documented areas requiring further validation",
];

export function OutcomeReflection() {
  return (
    <Section id="outcome" number="12" eyebrow="Outcome and reflection" title="What this exploration actually produced">
      <ul className={shared.list}>
        {outcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>

      <blockquote className={styles.reflection}>
        <p>
          The most valuable outcome was not a claim that the problem had been solved. It was a
          clearer understanding of where the system could provide value, where it could fail,
          and which decisions could not responsibly be made by design or engineering alone.
        </p>
      </blockquote>
    </Section>
  );
}
