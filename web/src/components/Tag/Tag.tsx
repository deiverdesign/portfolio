import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Tag.module.css";

export type TagContext = "light" | "dark";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Sobre qual fundo a tag está sendo colocada — mesma propriedade "Context" no Figma. */
  context?: TagContext;
  children: ReactNode;
}

export function Tag({ context = "light", className, children, ...rest }: TagProps) {
  const classes = [styles.tag, styles[context], className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
