import type { ReactNode } from "react";
import shared from "./shared.module.css";

export interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** Link externo (protótipo, FigJam) — sempre nova aba, sempre anunciado pra leitor de tela. */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className ?? shared.ctaLink}>
      {children} <span aria-hidden="true">↗</span>
      <span className={shared.visuallyHidden}> (opens in a new tab)</span>
    </a>
  );
}
