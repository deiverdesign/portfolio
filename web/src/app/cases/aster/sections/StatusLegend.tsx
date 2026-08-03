import { STATUS_LABELS } from "./StatusTag";
import styles from "./StatusLegend.module.css";

const order: Array<keyof typeof STATUS_LABELS> = ["explored", "proposed", "implemented", "future"];

const descriptions: Record<keyof typeof STATUS_LABELS, string> = {
  explored:
    "Conceptual work from the original project — discovery, principles, mappings — not necessarily built as an interface.",
  proposed:
    "A method or threshold that was proposed as part of the original project, but never actually executed or validated.",
  implemented:
    "A real, working part of the prototype, independently rebuilt for this portfolio reconstruction.",
  future: "A planned behavior, not yet present in the live prototype.",
};

/**
 * Aparece uma vez, logo após o Disclaimer — os capítulos abaixo reaproveitam
 * esses mesmos 4 rótulos via <StatusTag />, sem repetir a explicação.
 */
export function StatusLegend() {
  return (
    <aside className={styles.legend} aria-label="How to read the labels used in this case">
      <p className={styles.intro}>
        Chapters below are marked with one of four labels, showing exactly how far each part of
        ASTER went:
      </p>
      <dl className={styles.list}>
        {order.map((key) => (
          <div key={key} className={styles.item}>
            <dt className={styles.term}>{STATUS_LABELS[key]}</dt>
            <dd className={styles.description}>{descriptions[key]}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
