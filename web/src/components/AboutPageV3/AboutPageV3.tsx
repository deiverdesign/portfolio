import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { AboutPageBeliefsV3 } from "@/components/AboutPageBeliefsV3/AboutPageBeliefsV3";
import { AboutPageFactsV3 } from "@/components/AboutPageFactsV3/AboutPageFactsV3";
import { AboutPageHeroV3 } from "@/components/AboutPageHeroV3/AboutPageHeroV3";
import { AboutPageProcessV3 } from "@/components/AboutPageProcessV3/AboutPageProcessV3";
import { CapabilitiesV3 } from "@/components/CapabilitiesV3/CapabilitiesV3";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";

export interface AboutPageV3Props {
  locale: Locale;
}

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
const CONTACT_HREF = "mailto:hello@deiver.com.br";

/** Composição completa da página About V3. Figma: "Portfolio-Deiver-
 * About", node 2262:64510. Isolada em rota de preview até o cutover,
 * mesmo padrão do HomeV3. */
export function AboutPageV3({ locale }: AboutPageV3Props) {
  const homeHref = locale === "pt" ? "/pt/v3" : "/v3";
  const aboutHref = locale === "pt" ? "/pt/v3/sobre" : "/v3/about";
  const contactHref = `${homeHref}#contact`;

  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: homeHref },
    { label: getCopy(locale, "shared.nav.about"), href: aboutHref, active: true },
    { label: getCopy(locale, "shared.nav.contact"), href: contactHref },
    { label: getCopy(locale, "shared.nav.resume"), href: RESUME_HREF[locale] },
  ];

  return (
    <>
      <NavBarV3 locale={locale} context="light" links={links} />
      <main>
        <AboutPageHeroV3 locale={locale} />
        <AboutPageFactsV3 locale={locale} />
        <AboutPageProcessV3 locale={locale} />
        <CapabilitiesV3 locale={locale} />
        <AboutPageBeliefsV3 locale={locale} />
      </main>
      <FooterV3
        locale={locale}
        homeHref={homeHref}
        aboutHref={aboutHref}
        resumeHref={RESUME_HREF[locale]}
        linkedinHref={LINKEDIN_HREF}
      />
    </>
  );
}
