"use client";

import { useLayoutEffect, useState, type HTMLAttributes, type ReactNode } from "react";

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
  const [hasMounted, setHasMounted] = useState(false);
  const { ref, isInView } = useInView<HTMLSpanElement>({
    threshold: 0.6,
    rootMargin: "0px 0px -20% 0px",
    triggerIfInitiallyVisible: true,
  });
  /* Fecha antes do primeiro paint do cliente. Assim, um eyebrow já na tela
     pode fazer a transição de verdade em vez de começar aberto e só reagir
     quando o usuário rola alguns pixels. Sem JavaScript, o HTML do servidor
     preserva o estado aberto e legível. */
  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const open = !hasMounted || isInView;

  return (
    <span {...props} ref={ref} className={classes}>
      <HexagonBracket
        open={open}
        gap={gap}
        strokeWidth={1.5}
        anchorLeft
        className={styles.frame}
      >
        {children}
      </HexagonBracket>
    </span>
  );
}
