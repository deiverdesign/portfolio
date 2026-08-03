import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";
import styles from "./RestrainedInsights.module.css";

export function RestrainedInsights() {
  return (
    <Section
      id="insights"
      number="10"
      eyebrow="Restrained Insights"
      title="A consideration to review, not a conclusion to accept"
      tone="stone"
    >
      <p>
        When something in the conversation seems worth a second look, ASTER can raise an
        Insight — a small, reviewable note inline in the transcript. It is not medical advice,
        and it is not designed to look like one.
      </p>

      <div className={styles.mock}>
        <p className={styles.mockLabel}>Insight · fictional example</p>
        <p className={styles.mockContext}>
          &ldquo;Patient mentioned a change in their medication routine earlier in the
          conversation.&rdquo;
        </p>
        <p className={styles.mockReason}>
          Why it appeared: the AI Draft flagged a topic shift involving medication.
        </p>
        <div className={styles.mockFooter}>
          <span className={styles.mockStatus}>Not yet reviewed</span>
          <span className={styles.mockDirection}>Sources &amp; confidence — planned direction</span>
        </div>
      </div>

      <ul className={shared.list}>
        <li>Context: what in the conversation triggered it</li>
        <li>Reason for appearance: why the AI raised it now</li>
        <li>Physician-review status: reviewed or not yet reviewed</li>
        <li>Future direction: sources and a confidence indicator, not yet in the live prototype</li>
        <li>Restrained interruption: Insights wait to be noticed, they don&apos;t interrupt</li>
      </ul>

      <AssetPlaceholder assetId="aster-insight-detail" />
    </Section>
  );
}
