import type { ReactNode } from "react";
import { LinkTertiary } from "@/components/LinkTertiary/LinkTertiary";
import shared from "./shared.module.css";

export interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  /** Sobre qual fundo o link está — o LinkTertiary já lê a paleta do ASTER
      via os tokens sobrescritos em aster-theme.module.css. */
  context?: "light" | "dark";
  className?: string;
}

/**
 * Link externo (protótipo, FigJam) — sempre nova aba, sempre anunciado pra
 * leitor de tela. Reaproveita o LinkTertiary do design system principal
 * (mesmo componente, ícone de seta e comportamento) em vez de duplicar um
 * link com seta só pro ASTER.
 */
export function ExternalLink({ href, children, context = "light", className }: ExternalLinkProps) {
  return (
    <LinkTertiary
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      context={context}
      className={className}
    >
      {children}
      <span className={shared.visuallyHidden}> (opens in a new tab)</span>
    </LinkTertiary>
  );
}
