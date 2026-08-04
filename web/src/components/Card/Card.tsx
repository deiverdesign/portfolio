import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Card.module.css";

export type CardPadding = "compact" | "spacious";

export interface CardProps {
  children: ReactNode;
  /** Se informado, o card vira um link (mesmo comportamento do "next case" nos cases) — borda destaca no hover. */
  href?: string;
  /** "compact" = padding menor (usado em grades de vários cards lado a lado); "spacious" = padding maior (card único, mais respiro). */
  padding?: CardPadding;
  className?: string;
}

export function Card({ children, href, padding = "compact", className }: CardProps) {
  const classes = [styles.card, styles[padding], href && styles.interactive, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
