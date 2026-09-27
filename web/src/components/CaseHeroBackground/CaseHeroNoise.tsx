import type { CSSProperties } from "react";

import styles from "./CaseHeroBackground.module.css";

type NoiseStyle = CSSProperties & {
  "--case-hero-noise-color": string;
};

export interface CaseHeroNoiseProps {
  color: string;
}

export function CaseHeroNoise({ color }: CaseHeroNoiseProps) {
  return (
    <div
      className={styles.noiseReveal}
      style={{ "--case-hero-noise-color": color } as NoiseStyle}
      aria-hidden="true"
    >
      <span className={styles.noiseTexture} />
      <span className={styles.noiseBoost}>
        <span className={styles.noiseTexture} />
      </span>
    </div>
  );
}
