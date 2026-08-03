import styles from "./Disclaimer.module.css";

export function Disclaimer() {
  return (
    <aside className={styles.disclaimer} aria-label="Disclaimer">
      <p>
        <strong>ASTER is a portfolio reconstruction using fictional data.</strong> The interface
        and interactions were independently recreated to communicate the concept and do not
        reproduce a confidential client system. Clinical, legal, regulatory and ethical
        validation would require broader multidisciplinary work.
      </p>
    </aside>
  );
}
