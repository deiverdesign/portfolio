import type { Locale } from "@/content/i18n";
import styles from "./LanguageSwitcherV3.module.css";

const OTHER_LOCALE: Record<Locale, Locale> = { en: "pt", pt: "en" };
const HREF_BY_LOCALE: Record<Locale, string> = { en: "/pt", pt: "/" };

export interface LanguageSwitcherV3Props {
  locale: Locale;
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
export function LanguageSwitcherV3({ locale, className }: LanguageSwitcherV3Props) {
  const target = OTHER_LOCALE[locale];
  const classes = className ? `${styles.button} ${className}` : styles.button;

  return (
    <a
      href={HREF_BY_LOCALE[locale]}
      className={classes}
      aria-label={target === "pt" ? "Mudar para português" : "Switch to English"}
      lang={target}
    >
      {target.toUpperCase()}
      <span aria-hidden="true" className={styles.caret}>⌄</span>
    </a>
  );
}
