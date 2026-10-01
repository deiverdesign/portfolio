"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** Dispara logo no carregamento se qualquer parte do elemento já estiver visível. */
  triggerIfInitiallyVisible?: boolean;
}

/**
 * Detecta quando um elemento entra no viewport, pra animações de entrada
 * (Fase 1 de motion). Dispara uma vez e desconecta — não fica observando
 * pra sempre, e o elemento não desaparece de novo ao rolar pra fora.
 */
export function useInView<T extends HTMLElement>(
  {
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    triggerIfInitiallyVisible = false,
  }: UseInViewOptions = {},
) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Um rootMargin negativo é útil para retardar entradas futuras, mas pode
       excluir um elemento que já esteja visível no primeiro paint. Nesse
       caso, ele precisa animar agora — não só depois de um scroll mínimo. */
    if (triggerIfInitiallyVisible) {
      const bounds = node.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
        /* Preparar o estado oculto e revelar no frame seguinte. Antes os
           dois estados eram atualizados juntos; o browser só via o estado
           final e MotionReveal parecia surgir como um booleano, sem
           transição — especialmente em cards já visíveis no primeiro
           viewport ou após hot reload. */
        setIsReady(true);
        const frame = window.requestAnimationFrame(() => setIsInView(true));
        return () => window.cancelAnimationFrame(frame);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReady(true);
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerIfInitiallyVisible]);

  return { ref, isInView, isReady };
}
