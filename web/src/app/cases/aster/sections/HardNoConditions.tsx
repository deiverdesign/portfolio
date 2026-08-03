import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { StatusTag } from "./StatusTag";
import shared from "./shared.module.css";

const illustrativeConditions = [
  "Wrong-patient context can influence an output without explicit confirmation",
  "Clinically consequential suggestions cannot be traced to evidence and patient context",
  "Reviewing and correcting AI creates more work than it removes",
  "There is no credible path to responsible operation across safety, privacy, and workflow",
];

export function HardNoConditions() {
  return (
    <Section
      id="hard-no"
      number="11"
      eyebrow="Defining what would make us stop"
      title="Deciding what would make us stop, before momentum makes it hard to"
      tone="forestDeep"
    >
      <StatusTag status="proposed" onDark />

      <p>
        The business needed one of two useful outcomes: evidence that the concept could work, or
        an early and inexpensive signal that it should not continue.
      </p>

      <p>
        Stop conditions — a Hard No — only work if they&apos;re defined before optimism, sunk
        cost, or technical momentum make stopping harder.
      </p>

      <div className={shared.grid2}>
        {illustrativeConditions.map((condition) => (
          <div key={condition} className={shared.cardOnDark}>
            <p className={shared.cardText}>{condition}</p>
          </div>
        ))}
      </div>

      <p className={shared.captionOnDark}>
        Illustrative possibilities, not approved clinical thresholds.
      </p>

      <AssetPlaceholder assetId="aster-figjam-hard-no" />

      <p className={shared.keyStatementOnDark}>
        This exploration identified the need for stop conditions, but did not reach the
        multidisciplinary work required to define or validate formal go / no-go thresholds.
      </p>
    </Section>
  );
}
