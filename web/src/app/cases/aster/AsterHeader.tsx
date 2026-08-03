import Link from "next/link";
import { LockButton } from "./LockButton";
import styles from "./AsterHeader.module.css";

export function AsterHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <Link href="/" className={styles.back}>
          <span aria-hidden="true">←</span> Back to portfolio
        </Link>
        <span className={styles.identity}>Deiver Brito</span>
      </div>
      <span className={styles.wordmark}>ASTER</span>
      <LockButton />
    </header>
  );
}
