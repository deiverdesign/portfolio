import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { Tabs } from "./Tabs";
import { StatusTag } from "./StatusTag";
import shared from "./shared.module.css";
import styles from "./DocumentationAndInsights.module.css";

const aiDraftPoints = [
  "Generated from consultation events",
  "Organizes the conversation",
  "Remains reviewable",
  "Resets with scenario playback",
];

const myNotesPoints = [
  "Authored by the physician",
  "Created immediately without categorization",
  "Edited inline",
  "Autosaved",
  "Soft-deleted with Undo",
  "Preserved across Restart and scenario changes",
  "Cleared only through confirmation",
];

export function DocumentationAndInsights() {
  return (
    <Section
      id="documentation-and-insights"
      number="08"
      eyebrow="Documentation and Insights"
      title="Two kinds of documentation, kept deliberately separate"
      tone="stone"
    >
      <StatusTag status="implemented" />

      <p>
        When something in the conversation seems worth a second look, ASTER can raise an
        Insight — a small, reviewable note inline in the transcript, not medical advice.
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
        <li>Raises a reviewable consideration, not a conclusion</li>
        <li>Waits to be noticed — it doesn&apos;t interrupt</li>
      </ul>

      <p>
        ASTER never merges what the AI generated with what the physician wrote. They live side
        by side, so it&apos;s always clear who authored what.
      </p>

      <Tabs
        label="Compare AI Draft and My Notes"
        items={[
          {
            id: "ai-draft",
            label: "AI Draft",
            content: (
              <>
                <AssetPlaceholder assetId="aster-ai-draft" />
                <ul className={shared.list}>
                  {aiDraftPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            id: "my-notes",
            label: "My Notes",
            content: (
              <>
                <AssetPlaceholder assetId="aster-my-notes" />
                <ul className={shared.list}>
                  {myNotesPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            ),
          },
        ]}
      />

      <p className={shared.keyStatement}>
        AI-generated documentation and physician-authored notes were intentionally separated to
        preserve authorship, accountability and reviewability.
      </p>

      <AssetPlaceholder assetId="aster-screen-miscellany" />
    </Section>
  );
}
