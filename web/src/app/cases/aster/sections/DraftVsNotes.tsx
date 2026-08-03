import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { Tabs } from "./Tabs";
import shared from "./shared.module.css";

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

export function DraftVsNotes() {
  return (
    <Section
      id="draft-vs-notes"
      number="11"
      eyebrow="AI Draft and My Notes"
      title="Two kinds of documentation, kept deliberately separate"
      tone="stone"
    >
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
