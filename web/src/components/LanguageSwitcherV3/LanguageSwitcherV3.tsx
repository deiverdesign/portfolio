import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/content/i18n";
import { IconV3 } from "@/components/IconV3/IconV3";
import styles from "./LanguageSwitcherV3.module.css";

const OTHER_LOCALE: Record<Locale, Locale> = { en: "pt", pt: "en" };
const HREF_BY_LOCALE: Record<Locale, string> = { en: "/pt", pt: "/" };

export interface LanguageSwitcherV3Props {
  locale: Locale;
  href?: string;
  /** Contraste do controle contra a superfície onde ele é renderizado. */
  context?: "default" | "inverted";
  className?: string;
}

/**
 * Figma: componente "LanguageSwitcher", node 1590:1992.
 *
 * Divergência registrada em 27/09/2026: a descrição escrita do componente
 * no Figma diz "No caret: this is not a dropdown", mas o Deiver confirmou
 * visualmente que o header usa a seta (⌄). Seguindo a observação direta
 * dele em vez da nota escrita — vale confirmar se a nota do componente
 * também deveria ser atualizada no Figma.
 *
 * Estados Pressed/Focus ainda não foram conferidos individualmente — hover
 * usa surface/brand/subtle real; pressed/focus reaproveitam o mesmo padrão
 * do ButtonV3 (anel border/brand/default) até serem confirmados.
 */
export function LanguageSwitcherV3({
  locale,
  href = HREF_BY_LOCALE[locale],
  context = "default",
  className,
}: LanguageSwitcherV3Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const target = OTHER_LOCALE[locale];
  const classes = [styles.root, styles[context], className].filter(Boolean).join(" ");

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={classes}>
      <button
        type="button"
        className={styles.button}
        aria-label={locale === "pt" ? "Mudar para inglês" : "Switch to Portuguese"}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {locale.toUpperCase()}
        <IconV3 name="caret-down" size={16} className={styles.caret} />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu" aria-label={locale === "pt" ? "Idioma" : "Language"}>
          <div className={styles.dropdownRule} aria-hidden="true" />
          {(["en", "pt"] as const).map((option) => {
            const isCurrent = option === locale;
            const label = option === "en" ? "English" : "Português";

            return isCurrent ? (
              <span key={option} className={styles.dropdownItem} role="menuitem" aria-current="true">
                {label}
                <IconV3 name="check-2" size={14} className={styles.check} />
              </span>
            ) : (
              <a key={option} href={href} className={styles.dropdownItem} role="menuitem" lang={option} onClick={() => setIsOpen(false)}>
                {label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
