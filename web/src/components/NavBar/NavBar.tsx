"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { Icon } from "@/components/icons/Icon";
import { HOME_HREF, RESUME_DOWNLOAD_NAME, RESUME_HREF, type Locale } from "./constants";
import styles from "./NavBar.module.css";

export type NavBarContext = "light" | "dark";
/**
 * Re-exportado só como TIPO (apagado em tempo de build, não cruza a
 * fronteira client/server) — pra quem já importa `Locale` daqui não
 * quebrar. Valores (RESUME_HREF etc.) NÃO são re-exportados por este
 * arquivo: Server Components precisam importar de "./constants"
 * diretamente, nunca de um módulo "use client".
 */
export type { Locale } from "./constants";

export interface NavBarProps {
  /** Sobre qual fundo a NavBar está — mesma propriedade "Context" no Figma. */
  context?: NavBarContext;
  locale: Locale;
  /** URL da página equivalente no outro idioma — pra onde o seletor EN|PT leva. */
  otherLocaleHref: string;
}

const NAV_ITEMS: Record<Locale, Array<{ label: string; href: string }>> = {
  pt: [
    { label: "Trabalho", href: "/pt/work" },
    { label: "Competências", href: "/pt/competencias" },
    { label: "Sobre", href: "/pt/sobre" },
  ],
  en: [
    { label: "Work", href: "/work" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "About", href: "/about" },
  ],
};

/** "short" é o que sempre apareceu (desktop, e mobile fechado): PT/EN.
    "full" só aparece no menu mobile aberto (nome completo, estilo aba —
    Figma node 548-6585). Nome sempre no idioma nativo (Português/English),
    não traduzido pro idioma atual da página. */
const LANG_LABELS: Record<Locale, { short: string; full: string }> = {
  pt: { short: "PT", full: "Português" },
  en: { short: "EN", full: "English" },
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
    resume: "Currículo ↓",
    contact: "Contato",
    contactHref: "/pt/sobre#contato",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    currentLangLabel: "Português (idioma atual)",
    switchLangLabel: "Mudar para inglês",
  },
  en: {
    resume: "Resume ↓",
    contact: "Contact",
    contactHref: "/about#contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    currentLangLabel: "English (current language)",
    switchLangLabel: "Switch to Portuguese",
  },
};

interface NavBarBodyProps {
  context: NavBarContext;
  locale: Locale;
  otherLocaleHref: string;
  open: boolean;
  onToggle: () => void;
}

/**
 * Conteúdo de dentro do `<nav>` — extraído pra ser renderizado duas vezes
 * (header original no fluxo + duplicata fixa que aparece ao rolar) sem
 * duplicar JSX/lógica de links, idioma, menu mobile etc. As duas instâncias
 * têm seu próprio estado `open` (painéis mobile independentes).
 */
function NavBarBody({ context, locale, otherLocaleHref, open, onToggle }: NavBarBodyProps) {
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
      <a href={RESUME_HREF[locale]} download={RESUME_DOWNLOAD_NAME[locale]}>
        {t.resume}
      </a>
    </div>
  );

  const currentLang = LANG_LABELS[locale];
  const otherLang = LANG_LABELS[locale === "pt" ? "en" : "pt"];

  const langSwitch = (
    <div className={styles.langSwitch}>
      <span aria-current="true" aria-label={t.currentLangLabel} className={styles.langCurrent}>
        <span className={styles.langShort}>{currentLang.short}</span>
        <span className={styles.langFull}>{currentLang.full}</span>
      </span>
      <a href={otherLocaleHref} aria-label={t.switchLangLabel}>
        <span className={styles.langShort}>{otherLang.short}</span>
        <span className={styles.langFull}>{otherLang.full}</span>
      </a>
    </div>
  );

  return (
    <>
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
          onClick={onToggle}
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
    </>
  );
}

export function NavBar({ context = "light", locale, otherLocaleHref }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const [fixedOpen, setFixedOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fixedNavRef = useRef<HTMLElement>(null);

  /* Expõe a altura real do header fixo como uma CSS var global
     (--sticky-header-height), pra qualquer outro componente com conteúdo
     sticky (hoje: CapabilitySection) poder abrir espaço suficiente pra
     não ficar embaixo dele. Medido via ResizeObserver em vez de um valor
     fixo porque essa altura muda de breakpoint pra breakpoint (nav
     desktop vs. o toggle mobile têm alturas diferentes) e com font
     loading. useLayoutEffect (não useEffect) pra medir antes do
     navegador pintar a primeira vez, evitando um salto visível. */
  useLayoutEffect(() => {
    const node = fixedNavRef.current;
    if (!node) return;

    const setHeightVar = (height: number) => {
      document.documentElement.style.setProperty("--sticky-header-height", `${height}px`);
    };
    setHeightVar(node.getBoundingClientRect().height);

    const observer = new ResizeObserver(([entry]) => setHeightVar(entry.borderBoxSize[0].blockSize));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* Sentinela em vez de observar a nav em si: fica sempre exatamente na
     borda de baixo do header original (último filho dele), então o
     header fixo verde aparece assim que essa borda passa do topo da
     viewport — funciona igual mesmo se o header original mudar de
     altura (menu mobile aberto, por exemplo), sem precisar de um valor
     de distância de scroll fixo. */
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isRevealed = !entry.isIntersecting;
        setRevealed(isRevealed);
        /* Se o menu mobile da duplicata ficou aberto e o header original
           volta a aparecer (duplicata some), fecha o painel — evita
           reabrir "sujo" da próxima vez que ela reaparecer. */
        if (!isRevealed) setFixedOpen(false);
      },
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav ref={navRef} className={`${styles.navbar} ${styles[context]}`}>
        <NavBarBody
          context={context}
          locale={locale}
          otherLocaleHref={otherLocaleHref}
          open={open}
          onToggle={() => setOpen((v) => !v)}
        />
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      </nav>

      {/* Duplicata fixa — sempre no estilo "dark" (verde) da Home, em
          qualquer página, independente do context do header original.
          inert some ela de vez (teclado + leitor de tela) enquanto
          escondida; aria-hidden é redundante com inert mas mantido por
          compatibilidade mais ampla. */}
      <nav
        ref={fixedNavRef}
        className={`${styles.navbar} ${styles.dark} ${styles.fixedReveal} ${revealed ? styles.fixedRevealVisible : ""}`}
        aria-hidden={!revealed}
        inert={!revealed}
      >
        <NavBarBody
          context="dark"
          locale={locale}
          otherLocaleHref={otherLocaleHref}
          open={fixedOpen}
          onToggle={() => setFixedOpen((v) => !v)}
        />
      </nav>
    </>
  );
}
