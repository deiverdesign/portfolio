"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Detecta quando um elemento entra no viewport, pra animações de entrada
 * (Fase 1 de motion). Dispara uma vez e desconecta — não fica observando
 * pra sempre, e o elemento não desaparece de novo ao rolar pra fora.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}
