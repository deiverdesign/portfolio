"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { HexagonBracket } from "@/components/HexagonBracket/HexagonBracket";
import { useInView } from "@/hooks/useInView";
import styles from "./EyebrowV3.module.css";

export interface EyebrowV3Props extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: ReactNode;
  /** Distância final entre cada bracket e o label, em px. */
  gap?: number;
  className?: string;
}

/**
 * Eyebrow animado reutilizável do V3.
 *
 * Os dois lados começam com leitura de hexágono e se afastam ao entrar no
 * viewport. A entrada executa uma vez por montagem. Sem JavaScript e em
 * movimento reduzido, o estado final permanece legível.
 */
export function EyebrowV3({ children, gap = 8, className, ...props }: EyebrowV3Props) {
  const { ref, isInView, isReady } = useInView<HTMLSpanElement>();
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const open = !isReady || isInView;

  return (
    <span {...props} ref={ref} className={classes}>
      <HexagonBracket open={open} gap={gap} strokeWidth={1.5} className={styles.frame}>
        {children}
      </HexagonBracket>
    </span>
  );
}
