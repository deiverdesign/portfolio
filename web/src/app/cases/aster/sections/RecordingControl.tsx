import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";

const behaviors = [
  "Recording paused",
  "No transcription while paused",
  "No generated insight during the missing interval",
  "Physician notes remain available",
  "Explicit gap marker after resuming",
];

export function RecordingControl() {
  return (
    <Section id="recording-control" number="12" eyebrow="Control over recording" title="Pausing capture should pause everything downstream">
      <p className={`${shared.pill} ${shared.pillStandalone}`}>
        Planned scenario — not yet in the live prototype
      </p>

      <p>
        A physician needs to be able to pause capture — for a sensitive moment, an interruption,
        or simply because they want to. When they do, ASTER is designed to make that pause
        visible everywhere, not just on the record button.
      </p>

      <ul className={shared.list}>
        {behaviors.map((behavior) => (
          <li key={behavior}>{behavior}</li>
        ))}
      </ul>

      <AssetPlaceholder assetId="aster-recording-paused" />

      <p className={shared.keyStatement}>Missing information must remain visibly missing.</p>
    </Section>
  );
}
