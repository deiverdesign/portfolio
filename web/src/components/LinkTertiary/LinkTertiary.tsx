import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./LinkTertiary.module.css";

export type LinkTertiaryContext = "light" | "dark";

export interface LinkTertiaryProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Sobre qual fundo o link está sendo colocado — mesma propriedade "Context" no Figma. */
  context?: LinkTertiaryContext;
  children: ReactNode;
}

export function LinkTertiary({ context = "light", className, children, ...rest }: LinkTertiaryProps) {
  const classes = [styles.link, styles[context], className].filter(Boolean).join(" ");
  return (
    <a className={classes} {...rest}>
      <span>{children}</span>
      <svg
        width="9"
        height="7"
        viewBox="0 0 9.17 7.17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.17"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M0.585 3.585H8.585M5.585 6.585L8.585 3.585L5.585 0.585" />
      </svg>
    </a>
  );
}
