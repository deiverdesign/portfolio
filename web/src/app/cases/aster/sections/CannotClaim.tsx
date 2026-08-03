import { Section } from "./Section";
import shared from "./shared.module.css";

const hardNoExamples = [
  "A wrong-patient context influencing an output without confirmation",
  "A clinically consequential suggestion no one can trace back to its source",
  "Correcting the AI taking more effort than it saves",
];

export function CannotClaim() {
  return (
    <Section
      id="cannot-claim"
      eyebrow="What this case cannot claim"
      title="What wasn't proven here"
      tone="forestDeep"
    >
      <p>
        During my involvement, this work did not reach testing with physicians or other end
        users. I did not participate in, and did not receive evidence of, any clinical
        validation.
      </p>

      <p>
        Before the physical device arrived, I proposed scripted internal simulations to expose
        interaction failures early. They were not executed during my involvement.
      </p>

      <p>Pause and correction-provenance behavior remained design directions, not built features.</p>

      <p className={shared.keyStatementOnDark}>
        The business needed two useful outcomes: evidence that the concept could work, or an
        early and inexpensive reason to stop.
      </p>

      <p>
        Getting there responsibly would have required clear Hard No criteria — conditions that,
        if met, meant stopping regardless of momentum or sunk cost. During my involvement, those
        criteria were never formally defined or tested. A few illustrative examples:
      </p>

      <ul className={shared.list}>
        {hardNoExamples.map((example) => (
          <li key={example}>{example}</li>
        ))}
      </ul>

      <p className={shared.captionOnDark}>
        These are illustrations of the kind of criteria that were missing, not validated
        thresholds.
      </p>

      <p>These aren&apos;t hidden footnotes. They&apos;re the limits of what this exploration can responsibly claim.</p>
    </Section>
  );
}
