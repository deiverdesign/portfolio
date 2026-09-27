"use client";

import { useState } from "react";

import type { Locale } from "@/content/i18n";
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
  context = "light",
  links,
  className,
}: NavBarV3Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = [styles.root, styles[context], className].filter(Boolean).join(" ");
  const { logo, jobTitle } = HOME_ASSETS.identity;

  return (
    <header className={classes}>
      <div className={styles.row}>
        <a href={locale === "pt" ? "/pt" : "/"} className={styles.identity}>
          <img src={logo} alt="Deiver Brito" className={styles.name} />
          <img
            src={jobTitle}
            alt={locale === "pt" ? "Product Designer Sênior" : "Sr. Product Designer"}
            className={styles.role}
          />
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
          <LanguageSwitcherV3 locale={locale} />
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
          <LanguageSwitcherV3 locale={locale} />
        </nav>
      )}
    </header>
  );
}
