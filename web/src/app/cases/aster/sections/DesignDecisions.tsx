import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Tag } from "@/components/Tag/Tag";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { Tabs } from "./Tabs";
import { ASTER_FIGJAM_URL } from "./links";
import shared from "./shared.module.css";
import styles from "./DesignDecisions.module.css";

const patientStates = [
  { assetId: "aster-known-patient" as const, title: "Known Patient", tagLabel: "Functional prototype scenario" },
  { assetId: "aster-unknown-patient" as const, title: "Unknown Patient", tagLabel: "Selectable representation" },
  { assetId: "aster-ambiguous-match" as const, title: "Ambiguous Match", tagLabel: "Selectable representation" },
];

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

const correctionSteps = [
  "Initial AI interpretation",
  "Physician correction",
  "Affected draft content updated",
  "Dependent insight updated or withdrawn",
  "Visible explanation of why it changed",
];

const discoveryMappings = [
  { finding: "Wrong patient risk", decision: "Patient identification and ambiguity flows" },
  { finding: "Too much interruption", decision: "Restrained Insight behavior" },
  { finding: "Need for human control", decision: "Pause and review states" },
  { finding: "Need for authorship", decision: "AI Draft / My Notes" },
  { finding: "Need for traceability", decision: "Sources and confidence direction" },
  { finding: "Need for safe recovery", decision: "Autosave and Undo" },
  { finding: "High attention cost", decision: "Ambient device and post-consultation review" },
];

export function DesignDecisions() {
  return (
    <Section id="design-decisions" eyebrow="Four design decisions" title="Show me an actual decision" tone="stone">
      {/* 5a — Patient identity */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>Better no patient than the wrong patient</h3>
        <p className={shared.caption}>
          Risk: identifying the wrong patient is worse than not identifying one at all.
        </p>

        <div className={shared.grid3}>
          {patientStates.map((state) => (
            <div key={state.assetId} className={styles.patientCard}>
              <AssetPlaceholder assetId={state.assetId} />
              <div className={styles.patientMeta}>
                <span className={styles.patientName}>{state.title}</span>
                <Tag>{state.tagLabel}</Tag>
              </div>
            </div>
          ))}
        </div>

        <p className={shared.keyStatement}>
          When identity is uncertain, ASTER should withhold patient history rather than risk
          presenting the wrong record. The physician can continue the consultation without
          patient context and resolve the identity separately.
        </p>

        <p className={styles.factualCaption}>
          Known Patient is the only complete scenario in the portfolio prototype. Unknown
          Patient and Ambiguous Match are selectable representations of the intended states, not
          fully implemented scenarios.
        </p>

        <p className={shared.caption}>
          Remaining limitation: real identification would depend on integration and operational
          validation this project didn&apos;t reach.
        </p>
      </div>

      {/* 5b — Insight */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>A suggestion should look like a suggestion</h3>
        <p className={shared.caption}>
          Risk: a surfaced possibility can look like a diagnosis if it&apos;s not handled
          carefully.
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

        <p>
          Design decision: Insights are reviewable, not authoritative. They don&apos;t interrupt
          the consultation, they explain why they appeared, and they wait for physician review.
        </p>

        <p className={styles.plainCaption}>
          Restrained Insight behavior, shown above, is implemented in the portfolio prototype. A
          sources-and-confidence indicator remains a planned direction, not something built yet.
        </p>
      </div>

      {/* 5c — AI Draft vs My Notes */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>AI Draft is not My Notes</h3>
        <p className={shared.caption}>
          Risk: merging AI-generated and physician-authored content would blur who&apos;s
          accountable for what.
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
          AI-generated documentation and physician-authored notes remain visibly separate.
          Nothing is combined automatically.
        </p>

        <p className={styles.plainCaption}>
          Both panels shown above are implemented in the portfolio prototype. Combining the notes
          would be simpler to build, but authorship would be less clear.
        </p>
      </div>

      {/* 5d — Correction provenance */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>An error should be corrected, not erased</h3>
        <p className={shared.caption}>Risk: silently rewriting a mistake erases how it happened.</p>

        <ol className={shared.list}>
          {correctionSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <div className={styles.sketchWrap}>
          <AssetPlaceholder assetId="aster-correction-needed" />
          <Tag className={styles.sketchTag}>Planned, not built</Tag>
        </div>

        <p>
          Design decision: a correction should update dependent content, not delete the trail —
          the previous interpretation stays visible, with an explanation of what changed.
        </p>

        <p className={shared.caption}>I designed this direction, but it was never tested.</p>
      </div>

      {/* Conteúdo secundário — não interrompe a narrativa principal */}
      <details className={styles.disclosure}>
        <summary className={styles.disclosureSummary}>See the discovery behind these decisions</summary>
        <div className={styles.disclosureBody}>
          <AssetPlaceholder assetId="aster-figjam-overview" />
          <ExternalLink href={ASTER_FIGJAM_URL}>Explore the discovery board</ExternalLink>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.tableCaption}>
                Mapping between discovery findings and the prototype decisions they informed
              </caption>
              <thead>
                <tr>
                  <th scope="col">Discovery finding / risk</th>
                  <th scope="col">Prototype response / design decision</th>
                </tr>
              </thead>
              <tbody>
                {discoveryMappings.map((row) => (
                  <tr key={row.finding}>
                    <td>{row.finding}</td>
                    <td>
                      <span aria-hidden="true" className={styles.arrow}>
                        →{" "}
                      </span>
                      {row.decision}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </Section>
  );
}
