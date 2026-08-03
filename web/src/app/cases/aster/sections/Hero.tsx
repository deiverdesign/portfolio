import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { ExternalLink } from "./ExternalLink";
import { ASTER_PROTOTYPE_URL } from "./links";
import styles from "./Hero.module.css";

const meta = [
  { term: "Role", detail: "Product Design" },
  { term: "Focus", detail: "AI interaction, clinical workflows, safety and trust" },
  { term: "Output", detail: "Discovery framework and interactive prototype" },
  { term: "Status", detail: "Concept exploration / portfolio reconstruction" },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="aster-hero-heading">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.wordmark}>ASTER</p>
          <p className={styles.eyebrow}>AMBIENT AI FOR CLINICAL CONSULTATIONS</p>
          <h1 id="aster-hero-heading" className={styles.title}>
            ASTER HELPS PHYSICIANS LISTEN, REMEMBER AND DOCUMENT — WITHOUT DECIDING FOR THEM.
          </h1>
          <p className={styles.subtitle}>
            A small device worn by the physician captures the consultation. The workspace
            identifies the patient, builds a live transcript, brings relevant context into view
            and prepares draft notes for review.
          </p>

          <dl className={styles.meta}>
            {meta.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.ctaRow}>
            <a href="#how-it-works" className={styles.cta}>
              See how it works <span aria-hidden="true">↓</span>
            </a>
            <ExternalLink href={ASTER_PROTOTYPE_URL} context="dark">
              Explore the interactive prototype
            </ExternalLink>
          </div>
        </div>

        <div className={styles.visual}>
          <AssetPlaceholder assetId="aster-physician-device-hero" variant="device" />
        </div>
      </div>
    </section>
  );
}
