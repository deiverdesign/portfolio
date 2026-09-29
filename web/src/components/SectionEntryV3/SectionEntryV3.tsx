"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { useInView } from "@/hooks/useInView";
import styles from "./SectionEntryV3.module.css";

export interface SectionEntryV3Props extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  /** Ativa o atraso de 160ms do título, reservado para composições com eyebrow. */
  hasEyebrow?: boolean;
}

/**
 * Trigger compartilhado da primitiva Section Entry.
 *
 * Os filhos diretos optam pela sequência com `data-motion-part`:
 * `eyebrow`, `title` ou `body`. O elemento permanece um `<header>` para
 * preservar a semântica dos agrupamentos que abre.
 */
export function SectionEntryV3({
  children,
  hasEyebrow = false,
  className,
  ...props
}: SectionEntryV3Props) {
  const { ref, isInView, isReady } = useInView<HTMLElement>();
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <header
      {...props}
      ref={ref}
      className={classes}
      data-motion-ready={isReady ? "true" : undefined}
      data-motion-visible={!isReady || isInView ? "true" : "false"}
      data-has-eyebrow={hasEyebrow ? "true" : "false"}
    >
      {children}
    </header>
  );
}
