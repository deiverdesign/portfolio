import { CaseContextV3 } from "@/components/CaseContextV3/CaseContextV3";
import { CaseDecisionsV3 } from "@/components/CaseDecisionsV3/CaseDecisionsV3";
import { CaseHeroV3 } from "@/components/CaseHeroV3/CaseHeroV3";
import { CaseMetaRowV3 } from "@/components/CaseMetaRowV3/CaseMetaRowV3";
import { CaseOutcomeV3 } from "@/components/CaseOutcomeV3/CaseOutcomeV3";
import { CaseTypeSpecimenCard } from "@/components/CaseOutcomeV3/CaseTypeSpecimenCard";
import { CaseReflectionV3 } from "@/components/CaseReflectionV3/CaseReflectionV3";
import { CaseValidationV3 } from "@/components/CaseValidationV3/CaseValidationV3";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import type { Locale } from "@/content/i18n";
import { getCopy, type CopyKey } from "@/content/site-copy";
import { SCRIOO_ASSETS } from "@/content/scrioo-assets";

export interface ScriooPageV3Props {
  locale: Locale;
}

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
// Mesmo texto usado no hover do card da Home (SelectedWorkV3 `TAGS.scrioo`)
// — precedente de manter esses rótulos em inglês nas duas línguas; ainda
// não são chaves do catálogo.
const SCRIOO_HERO_TAGS = ["Design Systems", "AI", "Data-heavy UX"];

function decision(locale: Locale, index: 1 | 2 | 3, media: { src: string; width: number; height: number }) {
  return {
    title: getCopy(locale, `scrioo.decisions.${index}.title` as CopyKey),
    problem: getCopy(locale, `scrioo.decisions.${index}.problem` as CopyKey),
    proposal: getCopy(locale, `scrioo.decisions.${index}.proposal` as CopyKey),
    argument: getCopy(locale, `scrioo.decisions.${index}.argument` as CopyKey),
    media,
  };
}

const VALIDATION_BANNERS = [
  SCRIOO_ASSETS.validation.banner1,
  SCRIOO_ASSETS.validation.banner2,
  SCRIOO_ASSETS.validation.banner3,
];

function validationCard(locale: Locale, index: 1 | 2 | 3) {
  return {
    banner: VALIDATION_BANNERS[index - 1],
    name: getCopy(locale, `scrioo.validation.${index}.name` as CopyKey),
    questionLabel: getCopy(locale, "shared.case.validation.question"),
    question: getCopy(locale, `scrioo.validation.${index}.question` as CopyKey),
    testLabel: getCopy(locale, "shared.case.validation.test"),
    test: getCopy(locale, `scrioo.validation.${index}.test` as CopyKey),
    changedLabel: getCopy(locale, "shared.case.validation.changed"),
    changed: getCopy(locale, `scrioo.validation.${index}.changed` as CopyKey),
  };
}

/**
 * Composição completa da página de case da SCRIOO — piloto do contrato
 * compartilhado dos 5 cases (V3-HANDOFF.md, seção 7). Isolada em rota de
 * preview até o cutover, mesmo padrão do HomeV3/AboutPageV3.
 */
export function ScriooPageV3({ locale }: ScriooPageV3Props) {
  const homeHref = locale === "pt" ? "/pt" : "/";
  const aboutHref = locale === "pt" ? "/pt/sobre" : "/about";
  const contactHref = `${homeHref}#contact`;
  const languageHref = locale === "pt" ? "/cases/scrioo" : "/pt/cases/scrioo";

  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: homeHref },
    { label: getCopy(locale, "shared.nav.about"), href: aboutHref },
    { label: getCopy(locale, "shared.nav.contact"), href: contactHref },
    { label: getCopy(locale, "shared.nav.resume"), href: RESUME_HREF[locale] },
  ];

  return (
    <>
      <NavBarV3
        locale={locale}
        identityHref={homeHref}
        languageHref={languageHref}
        context="light"
        links={links}
      />
      <main>
        <CaseHeroV3
          locale={locale}
          tags={SCRIOO_HERO_TAGS}
          title={getCopy(locale, "scrioo.hero.title")}
          summary={getCopy(locale, "scrioo.hero.summary")}
          backHref={`${homeHref}#selected-work`}
          prevCaseHref={locale === "pt" ? "/pt/cases/aster" : "/cases/aster"}
          nextCaseHref={locale === "pt" ? "/pt/cases/hp" : "/cases/hp"}
          devices={SCRIOO_ASSETS.hero.devices}
          backgroundDesktop={SCRIOO_ASSETS.hero.backgroundDesktop}
          backgroundTablet={SCRIOO_ASSETS.hero.backgroundTablet}
          backgroundMobile="var(--gradient-case-scrioo-hero-mobile)"
          noiseColor="var(--color-case-scrioo-accent)"
        />
        <CaseContextV3
          eyebrow={getCopy(locale, "shared.case.context.eyebrow")}
          title={getCopy(locale, "scrioo.context.title")}
          paragraphs={[
            getCopy(locale, "scrioo.context.p1"),
            getCopy(locale, "scrioo.context.p2"),
            getCopy(locale, "scrioo.context.p3"),
          ]}
          media={
            <img
              src={SCRIOO_ASSETS.context.beforeAfter.src}
              width={SCRIOO_ASSETS.context.beforeAfter.width}
              height={SCRIOO_ASSETS.context.beforeAfter.height}
              alt=""
            />
          }
        />
        <CaseMetaRowV3
          items={[
            {
              icon: "person-card",
              label: getCopy(locale, "shared.case.role.label"),
              value: getCopy(locale, "scrioo.context.role"),
            },
            {
              icon: "handshake-2",
              label: getCopy(locale, "shared.case.collab.label"),
              value: getCopy(locale, "scrioo.context.collab"),
            },
          ]}
        />
        <CaseDecisionsV3
          locale={locale}
          eyebrow={getCopy(locale, "shared.case.decisions.eyebrow")}
          title={getCopy(locale, "scrioo.decisions.title")}
          items={[
            decision(locale, 1, SCRIOO_ASSETS.decisions.phones),
            decision(locale, 2, SCRIOO_ASSETS.decisions.collage),
            decision(locale, 3, SCRIOO_ASSETS.decisions.tabletZoom),
          ]}
        />
        <CaseValidationV3
          eyebrow={getCopy(locale, "shared.case.validation.eyebrow")}
          title={getCopy(locale, "scrioo.validation.title")}
          body={getCopy(locale, "scrioo.validation.body")}
          media={SCRIOO_ASSETS.validation.darkModeTablet}
          cards={[validationCard(locale, 1), validationCard(locale, 2), validationCard(locale, 3)]}
          conclusion={getCopy(locale, "scrioo.validation.conclusion")}
        />
        <CaseOutcomeV3
          eyebrow={getCopy(locale, "shared.case.outcome.eyebrow")}
          title={getCopy(locale, "scrioo.outcome.title")}
          body={getCopy(locale, "scrioo.outcome.body")}
          checklist={[
            getCopy(locale, "scrioo.outcome.1"),
            getCopy(locale, "scrioo.outcome.2"),
            getCopy(locale, "scrioo.outcome.3"),
            getCopy(locale, "scrioo.outcome.4"),
          ]}
          primaryMedia={SCRIOO_ASSETS.outcome.accessibilityHandoff}
          secondaryMedia={SCRIOO_ASSETS.decisions.tabletMap}
          extra={
            <CaseTypeSpecimenCard
              labelSrc={SCRIOO_ASSETS.outcome.typeSpecimenLabel}
              glyphSrc={SCRIOO_ASSETS.outcome.typeSpecimenGlyph}
              surfaceColor="var(--color-case-scrioo-surface)"
            />
          }
        />
        <CaseReflectionV3
          eyebrow={getCopy(locale, "shared.case.reflection.eyebrow")}
          title={getCopy(locale, "scrioo.reflection.title")}
          lead={getCopy(locale, "scrioo.reflection.lead")}
          quote={getCopy(locale, "scrioo.reflection.quote")}
          close={getCopy(locale, "scrioo.reflection.close")}
          nextLabel={getCopy(locale, "shared.case.next")}
          next={{
            href: locale === "pt" ? "/pt/cases/hp" : "/cases/hp",
            // Figma usa um badge circular ("Brands/HP 1", 32px), não o
            // wordmark branco do card da Home — asset legado do v2 já
            // existente no repo, mesma marca.
            logoSrc: "/images/v3/home/brands/white/hp.svg",
            logoAlt: "HP",
            name: getCopy(locale, "shared.cases.hp.name"),
            summary: getCopy(locale, "shared.cases.hp.summary"),
            background: "var(--color-case-hp-surface)",
          }}
        />
        <div id="contact">
          <ContactCTA locale={locale} contactHref={`${homeHref}#contact`} />
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
