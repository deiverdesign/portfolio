import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../icons/Icon";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonContext = "light" | "dark";

interface ButtonOwnProps {
  /** Qual papel visual o botão tem — mesma propriedade "Type" do componente no Figma. */
  variant?: ButtonVariant;
  /** Sobre qual fundo o botão está sendo colocado — mesma propriedade "Context" no Figma. */
  context?: ButtonContext;
  /** Ícone opcional depois do texto — mesmo slot "Icons" do componente no Figma. */
  icon?: IconName;
  children: ReactNode;
}

export type ButtonProps =
  | (ButtonOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & { href?: undefined })
  | (ButtonOwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

export function Button({
  variant = "primary",
  context = "light",
  icon,
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[context], className]
    .filter(Boolean)
    .join(" ");
  const iconEl = icon && (
    <Icon name={icon} size={variant === "tertiary" ? 24 : 14} className={styles.icon} />
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
        {iconEl}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {iconEl}
    </button>
  );
}
