import { Children, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

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
 * Estados dos dois contextos conferidos no frame Button-V3 (1580:2063).
 * O hover do primary usa um preenchimento vertical tom-sobre-tom; a label
 * permanece com a mesma cor durante toda a transição.
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

  /* Distingue "label + ícone à direita" (View cases, Resume...) de
     "só ícone" (Previous/Next): :only-child em CSS ignora nós de texto,
     então um <img> depois de um texto solto também "parece" filho único
     pro seletor — não dá pra diferenciar só com CSS. Contamos os filhos
     aqui e marcamos via data-attribute pro CSS usar. */
  const isMultiPart = Children.count(children) > 1;
  const content = (
    <span className={styles.content} data-multi-part={isMultiPart ? "true" : undefined}>
      {children}
    </span>
  );

  if (href) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
