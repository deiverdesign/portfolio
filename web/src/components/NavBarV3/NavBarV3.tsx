"use client";

import { useState } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { LanguageSwitcherV3 } from "@/components/LanguageSwitcherV3/LanguageSwitcherV3";
import styles from "./NavBarV3.module.css";

export interface NavBarV3Link {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavBarV3Props {
  locale: Locale;
  identityHref?: string;
  languageHref?: string;
  /** "Context" no Figma — sobre qual fundo a NavBar está. */
  context?: "light" | "dark";
  links: NavBarV3Link[];
  className?: string;
}

/**
 * Figma: componente "NavBar-V3", fileKey zpaQNzgjhG5ZKafe2cxnkm, frame
 * 1777:31162 (Desktop 1713:2170, Mobile 1777:31163).
 *
 * Simplificação assumida: o painel mobile (o que o hambúrguer abre) ainda
 * não tem especificação própria conferida no Figma — aqui ele só
 * mostra/esconde os mesmos links em coluna. Revisar contra o Figma antes de
 * integrar numa página real.
 */
export function NavBarV3({
  locale,
  identityHref = locale === "pt" ? "/pt" : "/",
  languageHref,
  context = "light",
  links,
  className,
}: NavBarV3Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = [styles.root, styles[context], className].filter(Boolean).join(" ");
  /* Versão clara de verdade no contexto escuro, não mais filtro CSS
     (invert+brightness) — achado do Deiver em 28/09/2026: o filtro
     deixava o logo serrilhado sobre o fundo escuro do hero. */
  const logo = context === "dark" ? HOME_ASSETS.identity.logoInverse : HOME_ASSETS.identity.logo;

  return (
    <header className={classes}>
      <div className={styles.row}>
        <a href={identityHref} className={styles.identity}>
          <img src={logo} alt="Deiver Brito" className={styles.name} />
          <p className={styles.role}>{getCopy(locale, "shared.identity.job-title")}</p>
        </a>

        <nav className={styles.desktopNav} aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              aria-current={link.active ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcherV3
            locale={locale}
            href={languageHref}
            context={context === "dark" ? "inverted" : "default"}
            className={styles.languageSwitcher}
          />
        </nav>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={mobileOpen}
          aria-label={locale === "pt" ? "Abrir menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {mobileOpen && (
        <nav
          className={styles.mobileNav}
          aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              aria-current={link.active ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcherV3
            locale={locale}
            href={languageHref}
            context={context === "dark" ? "inverted" : "default"}
          />
        </nav>
      )}
    </header>
  );
}
