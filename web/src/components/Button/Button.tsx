import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../icons/Icon";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonContext = "light" | "dark";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Qual papel visual o botão tem — mesma propriedade "Type" do componente no Figma. */
  variant?: ButtonVariant;
  /** Sobre qual fundo o botão está sendo colocado — mesma propriedade "Context" no Figma. */
  context?: ButtonContext;
  /** Ícone opcional depois do texto — mesmo slot "Icons" do componente no Figma. */
  icon?: IconName;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  context = "light",
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[context], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
      {icon && <Icon name={icon} size={variant === "tertiary" ? 24 : 14} className={styles.icon} />}
    </button>
  );
}
