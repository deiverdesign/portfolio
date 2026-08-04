"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { Icon } from "@/components/icons/Icon";
import styles from "./NavBar.module.css";

export type NavBarContext = "light" | "dark";
export type Locale = "pt" | "en";

/** Currículo é o mesmo PDF pra quem já fala português ou inglês — só o conteúdo do arquivo muda por idioma. */
export const RESUME_HREF: Record<Locale, string> = {
  pt: "/curriculo-deiver-brito.pdf",
  en: "/resume-deiver-brito.pdf",
};

export const HOME_HREF: Record<Locale, string> = {
  pt: "/",
  en: "/en",
};

export interface NavBarProps {
  /** Sobre qual fundo a NavBar está — mesma propriedade "Context" no Figma. */
  context?: NavBarContext;
  locale: Locale;
  /** URL da página equivalente no outro idioma — pra onde o seletor EN|PT leva. */
  otherLocaleHref: string;
}

const NAV_ITEMS: Record<Locale, Array<{ label: string; href: string }>> = {
  pt: [
    { label: "Trabalho", href: "/" },
    { label: "Competências", href: "/competencias" },
    { label: "Sobre", href: "/sobre" },
  ],
  en: [
    { label: "Work", href: "/en" },
    { label: "Capabilities", href: "/en/capabilities" },
    { label: "About", href: "/en/about" },
  ],
};

const STRINGS: Record<Locale, {
  resume: string;
  contact: string;
  contactHref: string;
  openMenu: string;
  closeMenu: string;
  currentLangLabel: string;
  switchLangLabel: string;
}> = {
  pt: {
    resume: "Currículo ↗",
    contact: "Contato",
    contactHref: "/sobre#contato",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    currentLangLabel: "Português (idioma atual)",
    switchLangLabel: "Mudar para inglês",
  },
  en: {
    resume: "Resume ↗",
    contact: "Contact",
    contactHref: "/en/about#contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    currentLangLabel: "English (current language)",
    switchLangLabel: "Switch to Portuguese",
  },
};

export function NavBar({ context = "light", locale, otherLocaleHref }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = STRINGS[locale];
  const items = NAV_ITEMS[locale];

  const links = (
    <div className={styles.navLinks}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={pathname === item.href ? styles.active : undefined}
        >
          {item.label}
        </a>
      ))}
      <a href={RESUME_HREF[locale]}>{t.resume}</a>
    </div>
  );

  const langSwitch = (
    <div className={styles.langSwitch}>
      <span aria-current="true" aria-label={t.currentLangLabel} className={styles.langCurrent}>
        {locale === "pt" ? "PT" : "EN"}
      </span>
      <a href={otherLocaleHref} aria-label={t.switchLangLabel}>
        {locale === "pt" ? "EN" : "PT"}
      </a>
    </div>
  );

  return (
    <nav className={`${styles.navbar} ${styles[context]}`}>
      <div className={styles.topRow}>
        <a href={HOME_HREF[locale]} className={styles.identity}>
          <strong>Deiver Brito</strong>
          <span>{locale === "pt" ? "Product Designer Sênior" : "Senior Product Designer"}</span>
        </a>

        {/* Desktop: tudo visível numa linha. Escondido via CSS abaixo de 1024px. */}
        <div className={styles.desktopNav}>
          {links}
          <Button variant="secondary" context={context} href={t.contactHref}>
            {t.contact}
          </Button>
          {langSwitch}
        </div>

        {/* Mobile/Tablet: botão hambúrguer que abre um painel — troca de estrutura, não reflow */}
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Icon name="close" size={20} /> : <Icon name="menu" size={20} />}
        </button>
      </div>

      <div className={styles.mobilePanel} data-open={open}>
        {links}
        <Button variant="secondary" context={context} href={t.contactHref}>
          {t.contact}
        </Button>
        {langSwitch}
      </div>
    </nav>
  );
}
