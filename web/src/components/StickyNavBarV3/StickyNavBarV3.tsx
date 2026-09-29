"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import styles from "./StickyNavBarV3.module.css";

export interface StickyNavBarV3Props {
  locale: Locale;
  homeHref?: string;
  aboutHref?: string;
  languageHref?: string;
  contactHref?: string;
  resumeHref?: string;
}

/**
 * Header fixo que aparece assim que o header original (dentro do
 * HomeHeroV3) sai da tela ao rolar — Figma: NavBar-V3, variante
 * "Breakpoint=Breakpoint3" (node 2282:36153), contexto claro, com a
 * mesma linha divisória do header original. Sem esse componente, depois
 * que o hero rolava pra fora não sobrava nenhum jeito de navegar sem
 * voltar ao topo (achado do Deiver em 28/09/2026).
 *
 * Detecta a saída do hero via IntersectionObserver observando a seção
 * que contém `#home-hero-title` — evita precisar repassar uma ref entre
 * HomeIntroV3 → HomeHeroV3 → aqui só pra esse fim.
 */
export function StickyNavBarV3({
  locale,
  homeHref = locale === "pt" ? "/pt" : "/",
  aboutHref = locale === "pt" ? "/pt/sobre" : "/about",
  languageHref,
  contactHref = "#contact",
  resumeHref = RESUME_HREF[locale],
}: StickyNavBarV3Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Observa o <header> do NavBarV3 original (dentro do hero), não o
       hero inteiro — o hero tem 650-960px de altura (clamp dinâmico), e
       esperar ele sumir por completo deixaria um vão enorme sem nenhum
       header visível. Observando só a faixa do nav (72-88px no topo),
       o header fixo aparece exatamente quando o original sai da tela. */
    const heroNav = document.getElementById("home-hero-title")?.closest("section")?.querySelector("header");
    if (!heroNav) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(heroNav);
    return () => observer.disconnect();
  }, []);

  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: homeHref, active: true },
    { label: getCopy(locale, "shared.nav.about"), href: aboutHref },
    { label: getCopy(locale, "shared.nav.contact"), href: contactHref },
    { label: getCopy(locale, "shared.nav.resume"), href: resumeHref },
  ];

  return (
    <div className={styles.root} data-visible={visible} inert={visible ? undefined : true}>
      <NavBarV3
        locale={locale}
        identityHref={homeHref}
        languageHref={languageHref}
        context="light"
        links={links}
      />
    </div>
  );
}
