import { Section } from "./Section";
import shared from "./shared.module.css";

const dimensions = [
  {
    name: "Technical",
    note: "Explored directly through design and prototyping.",
    inScope: true,
  },
  {
    name: "Workflow",
    note: "Explored directly through design and prototyping.",
    inScope: true,
  },
  {
    name: "Clinical",
    note: "Would require multidisciplinary validation — outside my direct scope.",
    inScope: false,
  },
  {
    name: "Operational",
    note: "Would require multidisciplinary validation — outside my direct scope.",
    inScope: false,
  },
  {
    name: "Ethical and regulatory",
    note: "Would require multidisciplinary validation — outside my direct scope.",
    inScope: false,
  },
];

export function Viability() {
  return (
    <Section
      id="viability"
      number="03"
      eyebrow="Viability is multidimensional"
      title="A promising interaction model is not the same as a viable product"
      tone="stone"
    >
      <p>
        A concept like ASTER can only move forward responsibly if it holds up across five
        different dimensions — and design can speak directly to some of them, but not all.
      </p>

      <div className={shared.grid3}>
        {dimensions.map((dimension) => (
          <div key={dimension.name} className={shared.card}>
            <span className={shared.cardTitle}>{dimension.name}</span>
            <p className={shared.cardText}>{dimension.note}</p>
            {!dimension.inScope && <span className={shared.pill}>Outside direct scope</span>}
          </div>
        ))}
      </div>
    </Section>
  );
}
