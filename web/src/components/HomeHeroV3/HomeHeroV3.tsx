"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import styles from "./HomeHeroV3.module.css";

export interface HomeHeroV3Props {
  locale: Locale;
  homeHref?: string;
  aboutHref?: string;
  languageHref?: string;
  contactHref?: string;
  resumeHref?: string;
  casesHref?: string;
  /** Mantém o campo visual e oculta os grupos durante o handoff da intro. */
  contentVisible?: boolean;
}

/**
 * Estado final estático do hero da Home V3.
 *
 * Contrato desktop: Figma 2262:61722 (1993×790) e 2262:61863
 * (1327×790). O HexagonIntro deve terminar neste estado, mas não faz parte
 * deste componente. Tablet e mobile aguardam frames de referência próprios.
 */
export function HomeHeroV3({
  locale,
  homeHref = locale === "pt" ? "/pt" : "/",
  aboutHref = locale === "pt" ? "/pt/sobre" : "/about",
  languageHref,
  contactHref = "#contact",
  resumeHref = RESUME_HREF[locale],
  casesHref = "#selected-work",
  contentVisible = true,
}: HomeHeroV3Props) {
  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: homeHref, active: true },
    { label: getCopy(locale, "shared.nav.about"), href: aboutHref },
    { label: getCopy(locale, "shared.nav.contact"), href: contactHref },
    { label: getCopy(locale, "shared.nav.resume"), href: resumeHref },
  ];
  const titleLines = getCopy(locale, "home.hero.title").split("\n");
  const graphismRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const graphism = graphismRef.current;
    if (!graphism) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId: number | null = null;

    const updateOffset = () => {
      frameId = null;
      if (!contentVisible || reducedMotion.matches) {
        graphism.style.setProperty("--home-hero-graphism-offset", "0px");
        return;
      }

      const hero = graphism.closest("section");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, ((window.innerHeight / 2) - (rect.top + rect.height / 2)) / window.innerHeight));
      /* Contramovimento: ao descer a página, o fundo sobe ainda mais rápido
         que o conteúdo. A amplitude é reduzida no toque para não expor
         bordas do asset, mas continua claramente perceptível. */
      const amplitude = window.innerWidth <= 599 ? 110 : window.innerWidth <= 1023 ? 180 : 360;
      graphism.style.setProperty("--home-hero-graphism-offset", `${(-progress * amplitude).toFixed(2)}px`);
    };

    const requestUpdate = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateOffset);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [contentVisible]);

  return (
    <section
      className={styles.root}
      aria-labelledby="home-hero-title"
      data-content-visible={contentVisible}
      inert={contentVisible ? undefined : true}
    >
      <Image
        ref={graphismRef}
        className={styles.graphism}
        src={HOME_ASSETS.hero.graphism.src}
        width={HOME_ASSETS.hero.graphism.width}
        height={HOME_ASSETS.hero.graphism.height}
        alt=""
        aria-hidden="true"
        priority
        unoptimized
      />

      <NavBarV3
        id="home-nav"
        locale={locale}
        identityHref={homeHref}
        languageHref={languageHref}
        context="dark"
        links={links}
        className={styles.navigation}
      />

      <div className={styles.content}>
        <div className={styles.intro}>
          <p className={styles.location}>
            {/* <img> simples, não next/image — o otimizador de imagens do
                Next bloqueia SVG por padrão (pode conter script), o que
                quebrava silenciosamente esse ícone (achado do Deiver em
                28/09/2026: ícone de imagem quebrada no lugar do coqueiro,
                arquivo em si estava correto). Mesmo padrão já usado em
                todo o resto do site pra SVG (NavBarV3, BrandsSectionV3,
                etc.) — só a foto grande do grafismo (PNG, linha acima)
                usa next/image de verdade. */}
            <img
              src={HOME_ASSETS.identity.locationTree}
              width={14}
              height={15}
              alt=""
              aria-hidden="true"
            />
            <span>{getCopy(locale, "home.hero.location.city")}</span>
            <span className={styles.separator} aria-hidden="true" />
            <span>{getCopy(locale, "home.hero.location.state")}</span>
            <span className={styles.separator} aria-hidden="true" />
            <span>{getCopy(locale, "home.hero.location.country")}</span>
          </p>

          <h1 id="home-hero-title" className={styles.title}>
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </div>

        <div className={styles.summary}>
          <p>{getCopy(locale, "home.hero.subtitle")}</p>
          <ButtonV3
            href={casesHref}
            variant="secondary"
            context="inverted"
            size="large"
            className={styles.cta}
          >
            {getCopy(locale, "home.hero.cta")}
            <IconV3 name="arrow-down" size={16} className={styles.ctaIcon} />
          </ButtonV3>
        </div>
      </div>
    </section>
  );
}
