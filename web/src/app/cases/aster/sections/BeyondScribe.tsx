import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import shared from "./shared.module.css";

const opportunities = [
  {
    number: "01",
    title: "Clinical memory",
    text: "Helping physicians recall relevant history without searching for it mid-consultation.",
  },
  {
    number: "02",
    title: "Documentation support",
    text: "Turning what was said into reviewable draft documentation, not a finished record.",
  },
  {
    number: "03",
    title: "Relevant evidence",
    text: "Surfacing supporting information tied to what's actually happening in the room.",
  },
  {
    number: "04",
    title: "Contextual insights",
    text: "Raising considerations worth a second look, without presenting them as conclusions.",
  },
];

export function BeyondScribe() {
  return (
    <Section
      id="beyond-scribe"
      number="02"
      eyebrow="Beyond the AI scribe"
      title="How might we reduce documentation burden without replacing physician judgment?"
    >
      <p>
        An ambient scribe that only transcribes solves one problem. ASTER explored a broader
        opportunity: could the same ambient capture also support memory, evidence, and insight —
        while leaving every clinical decision with the physician?
      </p>

      <div className={shared.grid4}>
        {opportunities.map((item) => (
          <div key={item.number} className={shared.card}>
            <span className={shared.cardNumber}>{item.number}</span>
            <span className={shared.cardTitle}>{item.title}</span>
            <p className={shared.cardText}>{item.text}</p>
          </div>
        ))}
      </div>

      <p className={shared.keyStatement}>The goal is not maximum automation. It is useful collaboration.</p>

      <div className={shared.grid2}>
        <AssetPlaceholder assetId="aster-physician-device-hero" />
        <AssetPlaceholder assetId="aster-prototype-hero" />
      </div>
    </Section>
  );
}
