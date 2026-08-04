import type { ReactNode } from "react";
import styles from "./Quote.module.css";

export interface QuoteProps {
  children: ReactNode;
  className?: string;
}

/** Citação com barra lateral — usada em reflexões de case e prévias de bio. Largura própria (720px) pra continuar legível mesmo dentro de uma seção mais larga. */
export function Quote({ children, className }: QuoteProps) {
  return <blockquote className={[styles.quote, className].filter(Boolean).join(" ")}>{children}</blockquote>;
}
