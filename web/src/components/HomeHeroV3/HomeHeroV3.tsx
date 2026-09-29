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

  return (
    <section
      className={styles.root}
      aria-labelledby="home-hero-title"
      data-content-visible={contentVisible}
      inert={contentVisible ? undefined : true}
    >
      <Image
        className={styles.graphism}
        src={HOME_ASSETS.hero.graphism.src}
        width={HOME_ASSETS.hero.graphism.width}
        height={HOME_ASSETS.hero.graphism.height}
        alt=""
        aria-hidden="true"
        priority
      />

      <NavBarV3 locale={locale} context="dark" links={links} className={styles.navigation} />

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
