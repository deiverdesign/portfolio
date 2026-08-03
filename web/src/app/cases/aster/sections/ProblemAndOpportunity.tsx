import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { StatusTag } from "./StatusTag";
import shared from "./shared.module.css";
import styles from "./ProblemAndOpportunity.module.css";

const demands = ["Listen", "Reason", "Remember", "Search", "Document", "Maintain attention"];

const connections = ["Physician", "Consultation", "Fragmented records", "Evidence", "Documentation"];

const opportunities = [
  {
    number: "01",
    title: "Clinical memory",
    text: "Helping physicians recall relevant history without searching for it mid-consultation.",
  },
  {
    number: "02",
    title: "Documentation support",
    text: "Turning what was said into reviewable draft documentation, not a finished record.",
  },
  {
    number: "03",
    title: "Relevant evidence",
    text: "Surfacing supporting information tied to what's actually happening in the room.",
  },
  {
    number: "04",
    title: "Contextual insights",
    text: "Raising considerations worth a second look, without presenting them as conclusions.",
  },
];

export function ProblemAndOpportunity() {
  return (
    <Section
      id="problem-and-opportunity"
      number="01"
      eyebrow="The problem and the opportunity"
      title="A physician does six things at once"
      tone="stone"
    >
      <StatusTag status="explored" />

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

      <div
        className={styles.chain}
        role="img"
        aria-label="Physician, consultation, fragmented records, evidence, and documentation are all connected and compete for the same attention."
      >
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

      <p>
        That tension is the starting point for ASTER. An ambient scribe that only transcribes
        solves one problem. ASTER explored a broader opportunity: could the same ambient capture
        also support memory, evidence, and insight — while leaving every clinical decision with
        the physician?
      </p>

      <div className={shared.grid4}>
        {opportunities.map((item) => (
          <div key={item.number} className={shared.card}>
            <span className={shared.cardNumber}>{item.number}</span>
            <span className={shared.cardTitle}>{item.title}</span>
            <p className={shared.cardText}>{item.text}</p>
          </div>
        ))}
      </div>

      <p className={shared.keyStatement}>The goal is not maximum automation. It is useful collaboration.</p>

      <AssetPlaceholder assetId="aster-physician-device-hero" />
    </Section>
  );
}
