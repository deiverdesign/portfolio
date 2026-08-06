"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import styles from "./RevealMask.module.css";

export interface RevealMaskProps {
  children: ReactNode;
  /** Atraso (ms) em relação a outro RevealMask vizinho — usado pro título de seção entrar 80ms depois do eyebrow. */
  delayMs?: number;
  /** Classes do elemento de fora (que já existia antes — ex: styles.eyebrow) — RevealMask não troca a tag, só entra como wrapper do texto. */
  className?: string;
}

/**
 * Reveal por máscara (Passo 6, itens 1 e 2 do motion-fase1): um span de
 * fora fica parado com overflow:hidden, o de dentro entra com
 * translateY(100%) -> 0. Sem opacity — só o texto "sobe" de dentro da
 * própria caixa.
 */
export function RevealMask({ children, delayMs = 0, className }: RevealMaskProps) {
  const { ref, isInView } = useInView<HTMLSpanElement>();
  const outerClasses = [styles.mask, className].filter(Boolean).join(" ");
  const innerClasses = [styles.inner, isInView && styles.isVisible].filter(Boolean).join(" ");

  return (
    <span ref={ref} className={outerClasses}>
      <span className={innerClasses} style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}>
        {children}
      </span>
    </span>
  );
}
