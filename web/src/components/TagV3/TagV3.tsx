import styles from "./TagV3.module.css";

export interface TagV3Props {
  label: string;
  className?: string;
}

/**
 * Figma: componente "Tag", node 169:132 ("Context=Default"). Fundo
 * overlay/neutral/default (translúcido), texto Meta/Label.
 */
export function TagV3({ label, className }: TagV3Props) {
  const classes = className ? `${styles.tag} ${className}` : styles.tag;
  return <span className={classes}>{label}</span>;
}
