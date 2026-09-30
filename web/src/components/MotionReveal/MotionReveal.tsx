"use client";

import type { AllHTMLAttributes, CSSProperties, ElementType, ReactNode } from "react";

import { useInView } from "@/hooks/useInView";
import styles from "./MotionReveal.module.css";

export interface MotionRevealProps extends Omit<AllHTMLAttributes<HTMLElement>, "children" | "className" | "style" | "as"> {
  children: ReactNode;
  /** Tag do elemento renderizado — default "div". Use "header" só quando for mesmo um cabeçalho. */
  as?: ElementType;
  /** Atraso (ms) — usado pra escalonar itens lado a lado (mídia, cards). */
  delayMs?: number;
  /** Anima já ao carregar, se o elemento já estiver visível (Hero, sem scroll-trigger). */
  triggerIfInitiallyVisible?: boolean;
  /** Distância (px) do translateY de entrada. Default 14 (texto). Mídia/cards usam um valor maior — ver `--motion-reveal-offset`. */
  offsetPx?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Mesma curva do `SectionEntryV3` (fade + sobe 14px, --dur-hero-reveal /
 * --ease-out-quart), mas sem a tag `<header>` fixa — pra poder animar
 * parágrafos, mídia e cards, não só título/eyebrow. Ver mapeamento de
 * motion da SCRIOO (29/09/2026): reaproveita a mesma curva em vez de criar
 * uma linguagem nova pra mídia.
 */
export function MotionReveal({
  children,
  as: Tag = "div",
  delayMs = 0,
  triggerIfInitiallyVisible = false,
  offsetPx,
  className,
  style,
  ...rest
}: MotionRevealProps) {
  const { ref, isInView, isReady } = useInView<HTMLElement>({ triggerIfInitiallyVisible });
  const classes = [styles.root, className].filter(Boolean).join(" ");

  const mergedStyle: CSSProperties = { ...style };
  if (delayMs) mergedStyle.transitionDelay = `${delayMs}ms`;
  if (offsetPx !== undefined) {
    (mergedStyle as CSSProperties & { "--motion-reveal-offset"?: string })["--motion-reveal-offset"] =
      `${offsetPx}px`;
  }

  return (
    <Tag
      {...rest}
      ref={ref}
      className={classes}
      data-motion-ready={isReady ? "true" : undefined}
      data-motion-visible={!isReady || isInView ? "true" : "false"}
      style={mergedStyle}
    >
      {children}
    </Tag>
  );
}
