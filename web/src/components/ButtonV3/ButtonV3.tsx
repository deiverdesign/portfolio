import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./ButtonV3.module.css";

export type ButtonV3Variant = "primary" | "secondary" | "tertiary";
export type ButtonV3Context = "default" | "inverted";
export type ButtonV3Size = "large" | "medium";

interface ButtonV3OwnProps {
  /** "Type" no Figma. */
  variant?: ButtonV3Variant;
  /** "Context" no Figma — qual fundo o botão está sobre. */
  context?: ButtonV3Context;
  /** "Size" no Figma. */
  size?: ButtonV3Size;
  children: ReactNode;
}

export type ButtonV3Props =
  | (ButtonV3OwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & { href?: undefined })
  | (ButtonV3OwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

/**
 * Botão compartilhado v3. Figma: componente "Button V3", fileKey
 * zpaQNzgjhG5ZKafe2cxnkm, section 1580:1910. Contrato verificado nó a nó
 * (não aproximado) em 27/09/2026 — ver web/src/styles/tokens-v3.css.
 *
 * Estados hover/pressed/focus do contexto "inverted" ainda não foram
 * conferidos individualmente no Figma; reaproveitam os mesmos overlays do
 * contexto "default" até isso ser confirmado.
 */
export function ButtonV3({
  variant = "primary",
  context = "default",
  size = "large",
  className,
  children,
  href,
  ...rest
}: ButtonV3Props) {
  const classes = [styles.button, styles[variant], styles[context], styles[size], className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
