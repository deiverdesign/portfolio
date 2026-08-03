import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { ASTER_PROTOTYPE_URL } from "./links";
import shared from "./shared.module.css";

const zones = [
  {
    title: "Patient Context",
    text: "What's known about the patient — and, just as importantly, what isn't confirmed yet.",
  },
  {
    title: "Live Consultation",
    text: "The transcript as it happens, with AI Draft content and Insights appearing inline.",
  },
  {
    title: "Consultation Notes",
    text: "The physician's own notes — written, edited, and saved independently of the AI Draft.",
  },
];

export function ProductWalkthrough() {
  return (
    <Section
      id="walkthrough"
      number="08"
      eyebrow="Product walkthrough"
      title="Inside the ASTER workspace"
      tone="stone"
    >
      <AssetPlaceholder assetId="aster-macbook-mockup" />

      <p>
        The workspace is organized into three zones that stay visible together, so the physician
        never has to switch context to see the full picture of a consultation.
      </p>

      <div className={shared.grid3}>
        {zones.map((zone) => (
          <div key={zone.title} className={shared.card}>
            <span className={shared.cardTitle}>{zone.title}</span>
            <p className={shared.cardText}>{zone.text}</p>
          </div>
        ))}
      </div>

      <p>
        Capture happens through a small ambient device, designed for low-attention use — the
        physician isn&apos;t expected to look at a screen to know the consultation is being
        captured.
      </p>

      <ExternalLink href={ASTER_PROTOTYPE_URL}>Explore the interactive prototype</ExternalLink>
      <p className={shared.caption}>
        The prototype is the best way to explore ASTER hands-on. Everything below also stands on
        its own through static imagery and copy, in case the live prototype is ever unavailable.
      </p>
    </Section>
  );
}
