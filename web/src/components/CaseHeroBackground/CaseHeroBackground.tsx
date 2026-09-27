import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { CaseHeroNoise } from "./CaseHeroNoise";
import styles from "./CaseHeroBackground.module.css";

type HeroStyle = CSSProperties & {
  "--case-hero-background": string;
};

export interface CaseHeroBackgroundProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  background: string;
  children: ReactNode;
  noiseColor: string;
}

export function CaseHeroBackground({
  background,
  children,
  className,
  noiseColor,
  style,
  ...props
}: CaseHeroBackgroundProps) {
  const classes = className ? `${styles.root} ${className}` : styles.root;

  return (
    <div
      {...props}
      className={classes}
      style={{ ...style, "--case-hero-background": background } as HeroStyle}
    >
      <CaseHeroNoise color={noiseColor} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
