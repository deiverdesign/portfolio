import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Section } from "./Section";
import { StatusTag } from "./StatusTag";
import styles from "./DiscoveryToDecisions.module.css";

const mappings = [
  { finding: "Wrong patient risk", decision: "Patient identification and ambiguity flows" },
  { finding: "Too much interruption", decision: "Restrained Insight behavior" },
  { finding: "Need for human control", decision: "Pause and review states" },
  { finding: "Need for authorship", decision: "AI Draft / My Notes" },
  { finding: "Need for traceability", decision: "Sources and confidence direction" },
  { finding: "Need for safe recovery", decision: "Autosave and Undo" },
  { finding: "High attention cost", decision: "Ambient device and post-consultation review" },
];

export function DiscoveryToDecisions() {
  return (
    <Section id="discovery-to-decisions" number="10" eyebrow="From discovery to decisions" title="Every design decision traces back to a discovery finding">
      <StatusTag status="explored" />

      <AssetPlaceholder assetId="aster-figjam-decisions" />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            Mapping between discovery findings and the prototype decisions they informed
          </caption>
          <thead>
            <tr>
              <th scope="col">Discovery finding / risk</th>
              <th scope="col">Prototype response / design decision</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((row) => (
              <tr key={row.finding}>
                <td>{row.finding}</td>
                <td>
                  <span aria-hidden="true" className={styles.arrow}>
                    →{" "}
                  </span>
                  {row.decision}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
