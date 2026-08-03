import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { ASTER_FIGJAM_URL } from "./links";
import shared from "./shared.module.css";

const questions = [
  "When should AI interrupt?",
  "What happens when AI disagrees with the physician?",
  "How should uncertainty be communicated?",
  "What sources support each insight?",
  "Should AI update its reasoning when the physician adds information?",
  "How do we prevent the wrong patient context from being loaded?",
  "Who owns the final decision?",
  "What happens when the AI is wrong?",
];

export function QuestionsBeforeInterfaces() {
  return (
    <Section
      id="questions"
      number="04"
      eyebrow="Questions before interfaces"
      title="Before any screen, a set of hard questions"
      tone="stone"
    >
      <AssetPlaceholder assetId="aster-figjam-overview" />

      <ul className={shared.list}>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>

      <p>
        These questions did not produce definitive clinical answers. They shaped the boundaries
        and behavior of the concept.
      </p>

      <AssetPlaceholder assetId="aster-figjam-critical-questions" />

      <ExternalLink href={ASTER_FIGJAM_URL}>Explore the discovery board</ExternalLink>
    </Section>
  );
}
