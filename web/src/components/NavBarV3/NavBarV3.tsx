"use client";

import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { RESUME_DOWNLOAD_NAME } from "@/components/NavBar/constants";
import { IconV3 } from "@/components/IconV3/IconV3";
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
  id?: string;
}

/**
 * Figma: componente "NavBar-V3", fileKey zpaQNzgjhG5ZKafe2cxnkm, frame
 * 1777:31162 (Desktop 1713:2170, Mobile 1777:31163).
 *
 * Menu mobile conferido nos frames 2320:75128 (inverse) e 2320:75068
 * (default): overlay de viewport, itens de 44px com divisórias e escolha de
 * idioma explícita. O controlo compacto EN continua exclusivo do desktop.
 */
export function NavBarV3({
  locale,
  identityHref = locale === "pt" ? "/pt" : "/",
  languageHref,
  context = "light",
  links,
  className,
  id,
}: NavBarV3Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = [styles.root, styles[context], className].filter(Boolean).join(" ");
  /* Versão clara de verdade no contexto escuro, não mais filtro CSS
     (invert+brightness) — achado do Deiver em 28/09/2026: o filtro
     deixava o logo serrilhado sobre o fundo escuro do hero. */
  const logo = context === "dark" ? HOME_ASSETS.identity.logoInverse : HOME_ASSETS.identity.logo;

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header id={id} className={classes}>
      <div className={styles.row}>
        <a href={identityHref} className={styles.identity}>
          <img src={logo} alt="Deiver Brito" className={styles.name} />
          <p className={styles.role}>{getCopy(locale, "shared.identity.job-title")}</p>
        </a>

        <nav className={styles.desktopNav} aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}>
          {links.map((link) => {
            const isResume = link.label === getCopy(locale, "shared.nav.resume");
            return <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              aria-current={link.active ? "page" : undefined}
              download={isResume ? RESUME_DOWNLOAD_NAME[locale] : undefined}
            >
              {link.label}
              {isResume && <IconV3 name="download" size={16} className={styles.navLinkIcon} />}
            </a>;
          })}
        </nav>

        <div className={styles.desktopLanguage}>
          <LanguageSwitcherV3
            locale={locale}
            href={languageHref}
            context={context === "dark" ? "inverted" : "default"}
            className={styles.languageSwitcher}
          />
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={mobileOpen}
          aria-label={locale === "pt" ? "Abrir menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {/* Era 3 spans desenhados via CSS — o Deiver apontou o ícone
              real do Figma (Icons/Menu2, node 836:10943), já baixado em
              menu2.svg. */}
          <IconV3 name="menu2" size={24} className={styles.menuIcon} />
        </button>
      </div>

      {mobileOpen && createPortal(
        <div className={`${styles.mobileOverlay} ${styles[context]}`} role="dialog" aria-modal="true" aria-label={locale === "pt" ? "Menu" : "Menu"}>
          <div className={styles.mobileHeader}>
            <a href={identityHref} className={styles.identity} onClick={() => setMobileOpen(false)}>
              <img src={logo} alt="Deiver Brito" className={styles.name} />
              <p className={styles.role}>{getCopy(locale, "shared.identity.job-title")}</p>
            </a>
            <button
              type="button"
              className={styles.mobileClose}
              aria-label={locale === "pt" ? "Fechar menu" : "Close menu"}
              onClick={() => setMobileOpen(false)}
            >
              <IconV3 name="close" size={24} className={styles.mobileCloseIcon} />
            </button>
          </div>

          <nav className={styles.mobileNav} aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}>
            {links.map((link, index) => {
              const isResume = index === links.length - 1;
              return (
                <Fragment key={link.href}>
                  <a
                    href={link.href}
                    className={styles.mobileNavLink}
                    aria-current={link.active ? "page" : undefined}
                    download={isResume ? RESUME_DOWNLOAD_NAME[locale] : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className={styles.mobileNavLabel}>{link.label}</span>
                    <IconV3 name={isResume ? "download" : "caret-right"} size={16} className={styles.mobileNavIcon} />
                  </a>
                  {/* Divisória como irmã do link no MESMO grid (não
                      border-bottom nele): no Figma ela é um elemento à
                      parte, recebendo o mesmo gap de 8px dos dois lados.
                      Como border-bottom, ela ficava "grudada" no texto de
                      cima e o gap inteiro sobrava só embaixo — achado do
                      Deiver em 29/09/2026, comparando com o Figma e vendo
                      que 9px em cima virava 17px embaixo. Precisa ser irmã
                      direta no grid, não filha de um wrapper por link,
                      senão o gap volta a ficar todo de um lado só. */}
                  {!isResume && <div className={styles.mobileNavDivider} aria-hidden="true" />}
                </Fragment>
              );
            })}
          </nav>

          <div className={styles.mobileLanguages} aria-label={locale === "pt" ? "Idioma" : "Language"}>
            {locale === "en" ? (
              <span className={styles.mobileLanguageActive}>English</span>
            ) : (
              <a href={languageHref} className={styles.mobileLanguage}>English</a>
            )}
            {locale === "pt" ? (
              <span className={styles.mobileLanguageActive}>Portuguese</span>
            ) : (
              <a href={languageHref} className={styles.mobileLanguage}>Portuguese</a>
            )}
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
