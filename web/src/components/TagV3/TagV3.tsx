import type { ReactNode } from "react";
import styles from "./TagV3.module.css";

export interface TagV3Props {
  label: string;
  /** Marca decorativa opcional, alinhada à altura do rótulo. */
  icon?: ReactNode;
  className?: string;
  /**
   * O Figma usa a tag em dois contextos. O Hero é uma superfície escura:
   * overlay preto translúcido + texto claro (node 2262:68411).
   */
  context?: "default" | "inverted";
}

/**
 * Figma: componente "Tag", com variação de contexto para superfícies
 * claras e escuras. O contexto não deve ser inferido pela cor do asset.
 */
export function TagV3({ label, icon, className, context = "default" }: TagV3Props) {
  const baseClasses = context === "inverted" ? `${styles.tag} ${styles.inverted}` : styles.tag;
  const classes = className ? `${baseClasses} ${className}` : baseClasses;
  return (
    <span className={classes}>
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
      {label}
    </span>
  );
}
