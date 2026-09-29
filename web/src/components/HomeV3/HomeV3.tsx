import type { Locale } from "@/content/i18n";
import { AboutV3 } from "@/components/AboutV3/AboutV3";
import { BrandsSectionV3 } from "@/components/BrandsSectionV3/BrandsSectionV3";
import { CapabilitiesV3 } from "@/components/CapabilitiesV3/CapabilitiesV3";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { HomeIntroV3 } from "@/components/HomeIntroV3/HomeIntroV3";
import { SelectedWorkV3 } from "@/components/SelectedWorkV3/SelectedWorkV3";
import { StickyNavBarV3 } from "@/components/StickyNavBarV3/StickyNavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";

export interface HomeV3Props {
  locale: Locale;
  introEnabled?: boolean;
  introSessionKey?: string | null;
}

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
const CONTACT_HREF = "mailto:hello@deiver.com.br";

/** Composição completa da Home V3. Continua isolada da Home pública até o
 * cutover: Storybook e as rotas de preview `/v3` e `/pt/v3`. */
export function HomeV3({ locale, introEnabled = true, introSessionKey }: HomeV3Props) {
  const homeHref = locale === "pt" ? "/pt/v3" : "/v3";
  const aboutHref = locale === "pt" ? "/pt/v3/sobre" : "/v3/about";
  const languageHref = locale === "pt" ? "/v3" : "/pt/v3";

  return (
    <>
      <StickyNavBarV3
        locale={locale}
        homeHref={homeHref}
        aboutHref={aboutHref}
        languageHref={languageHref}
      />
      <main>
        <HomeIntroV3
          locale={locale}
          homeHref={homeHref}
          aboutHref={aboutHref}
          languageHref={languageHref}
          introEnabled={introEnabled}
          sessionKey={introSessionKey}
        />
        <SelectedWorkV3 locale={locale} />
        <BrandsSectionV3 locale={locale} />
        <CapabilitiesV3 locale={locale} />
        <AboutV3 locale={locale} />
        <div id="contact">
          <ContactCTA locale={locale} contactHref={CONTACT_HREF} />
        </div>
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
