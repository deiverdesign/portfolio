import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { ASTER_PROTOTYPE_URL } from "./links";
import shared from "./shared.module.css";

const present = [
  "One complete Known Patient scenario, plus selectable representations of Unknown Patient and Ambiguous Match",
  "Live transcript playback",
  "Restrained Insights",
  "AI Draft",
  "Physician-authored notes",
  "Autosave",
  "Delete and Undo",
  "Notes preserved after Restart",
];

export function FunctionalPrototype() {
  return (
    <Section id="functional-prototype" eyebrow="The functional prototype" title="Is this real? Can I try it?">
      <p>
        I later rebuilt ASTER as a functional portfolio prototype so the interaction model could
        be experienced, not only described.
      </p>

      <AssetPlaceholder assetId="aster-walkthrough-video" />

      <p>What&apos;s actually there:</p>
      <ul className={shared.list}>
        {present.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p>
        What isn&apos;t: this uses fictional data, there&apos;s no clinical backend, and it
        doesn&apos;t reproduce the original client interface.
      </p>

      <p className={shared.keyStatement}>
        It can demonstrate interaction behavior. It cannot prove safety.
      </p>

      <ExternalLink href={ASTER_PROTOTYPE_URL}>Explore the interactive prototype</ExternalLink>
    </Section>
  );
}
