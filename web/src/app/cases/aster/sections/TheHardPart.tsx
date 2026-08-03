import { Section } from "./Section";
import shared from "./shared.module.css";

export function TheHardPart() {
  return (
    <Section id="the-hard-part" eyebrow="The hard part" title="The hard part wasn't making the AI do more">
      <p className={shared.keyStatement}>It was deciding when &ldquo;more&rdquo; would become too much.</p>

      <p>
        Every useful capability created another risk. If ASTER could identify a patient, what
        happened when it identified the wrong one? If it surfaced an Insight, how would we stop a
        possibility from looking like medical advice? If it drafted notes, how would the
        physician know what the AI wrote and what they wrote themselves?
      </p>

      <p>
        Viability here was never just technical. It also meant workflow fit, clinical safety,
        day-to-day operation, and who would be accountable if something went wrong — and design
        could only speak directly to some of those.
      </p>
    </Section>
  );
}
