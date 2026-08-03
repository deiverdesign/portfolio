import { AssetPlaceholder } from "../assets/AssetPlaceholder";
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
          <h1 id="aster-hero-heading" className={styles.title}>
            Designing trust between physicians and AI
          </h1>
          <p className={styles.subtitle}>
            Exploring the interaction boundaries of an AI clinical collaborator in a high-risk
            domain.
          </p>

          <dl className={styles.meta}>
            {meta.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>

          <a href="#why-it-matters" className={styles.cta}>
            Start reading <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className={styles.visual}>
          <AssetPlaceholder assetId="aster-physician-device-hero" variant="device" />
        </div>
      </div>
    </section>
  );
}
