import Link from "next/link";
import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { ExternalLink } from "./ExternalLink";
import { ASTER_FIGJAM_URL, ASTER_PROTOTYPE_URL } from "./links";
import styles from "./Closing.module.css";

export function Closing() {
  return (
    <section className={styles.closing} aria-labelledby="closing-heading">
      <div className={styles.inner}>
        <div className={styles.visual}>
          <AssetPlaceholder assetId="aster-closing-workspace" />
        </div>

        <div className={styles.text}>
          <p id="closing-heading" className={styles.statement}>
            Designing clinical AI is not only about what the system can do. It is about defining
            when it should act, when it should wait, and how people remain in control.
          </p>

          <div className={styles.links}>
            <ExternalLink href={ASTER_PROTOTYPE_URL} className={styles.primaryLink}>
              Explore the interactive prototype
            </ExternalLink>
            <ExternalLink href={ASTER_FIGJAM_URL} className={styles.secondaryLink}>
              Explore the discovery board
            </ExternalLink>
          </div>

          <Link href="/" className={styles.backLink}>
            <span aria-hidden="true">←</span> Back to portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
