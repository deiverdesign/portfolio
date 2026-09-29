"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./HexagonBracket.module.css";

/**
 * Portado da branch isolada `codex/hexagon-intro-step14` (commit
 * `15b1e6e`) em 28/09/2026 — mesmo hexágono que o HexagonIntro corta ao
 * meio, aqui desenhado como traço aberto (currentColor, sem cor
 * cravada). Passa de "fechado" (hexágono) pra "aberto" (dois colchetes
 * emoldurando o conteúdo). Único ajuste sobre o original: a curva de
 * easing agora é uma CSS var (`--hexagon-bracket-ease`) além da duração,
 * pra dar pro EyebrowV3 usar o token --ease-out-expo do contrato de
 * motion (web/docs/motion-v3.md) em vez da curva default deste
 * componente — ver HexagonBracket.module.css.
 */

export interface HexagonBracketProps {
  /** Content the brackets open around. */
  children: ReactNode;
  /** Closed draws the hexagon; open spreads the two halves apart. */
  open?: boolean;
  /** Space left between each bracket and the content, in px. */
  gap?: number;
  /** Espessura do traço; o eyebrow compacto usa 1.5px. */
  strokeWidth?: number;
  className?: string;
}

/* Same hexagon the intro splits at Step 04B: flat left and right sides, pointed
   top and bottom, half-width 27 and half-height 31. Each bracket is one half
   drawn as an open path — the seam the two of them share when closed is exactly
   what is missing from each. */
const HALF_WIDTH = 27;
const HALF_HEIGHT = 31;
const LEFT_BRACKET = `M0 -${HALF_HEIGHT} -${HALF_WIDTH} -15.5V15.5L0 ${HALF_HEIGHT}`;
const RIGHT_BRACKET = `M0 -${HALF_HEIGHT} ${HALF_WIDTH} -15.5V15.5L0 ${HALF_HEIGHT}`;
const VIEW_BOX = `-${HALF_WIDTH + 2} -${HALF_HEIGHT + 2} ${(HALF_WIDTH + 2) * 2} ${(HALF_HEIGHT + 2) * 2}`;

export function HexagonBracket({
  children,
  open = true,
  gap = 24,
  strokeWidth = 3,
  className,
}: HexagonBracketProps) {
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const [shift, setShift] = useState(0);

  /* The brackets travel far enough to clear whatever they are framing, so the
     same component works for a two-letter tag and a full sentence. */
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setShift(node.offsetWidth / 2 + gap);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [gap]);

  const travel = open ? shift : 0;
  const classes = [styles.frame, className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-open={open}>
      <svg
        className={styles.bracket}
        style={{ "--shift": `${-travel}px` } as CSSProperties}
        viewBox={VIEW_BOX}
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={LEFT_BRACKET}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        className={styles.bracket}
        style={{ "--shift": `${travel}px` } as CSSProperties}
        viewBox={VIEW_BOX}
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={RIGHT_BRACKET}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span ref={contentRef} className={styles.content}>
        {children}
      </span>
    </span>
  );
}
