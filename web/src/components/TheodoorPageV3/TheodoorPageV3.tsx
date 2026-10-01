import { CaseContextV3 } from "@/components/CaseContextV3/CaseContextV3";
import { CaseDecisionsV3 } from "@/components/CaseDecisionsV3/CaseDecisionsV3";
import { CaseHeroV3 } from "@/components/CaseHeroV3/CaseHeroV3";
import { CaseMetaRowV3 } from "@/components/CaseMetaRowV3/CaseMetaRowV3";
import { CaseOutcomeV3 } from "@/components/CaseOutcomeV3/CaseOutcomeV3";
import { CaseReflectionV3 } from "@/components/CaseReflectionV3/CaseReflectionV3";
import { CaseValidationV3 } from "@/components/CaseValidationV3/CaseValidationV3";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import type { Locale } from "@/content/i18n";
import { getCopy, type CopyKey } from "@/content/site-copy";
import { THEODOOR_ASSETS } from "@/content/theodoor-assets";

export interface TheodoorPageV3Props { locale: Locale; }

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
const TAG_KEYS = ["shared.tags.accessibility", "shared.tags.physical-digital-ux", "shared.tags.motion"] as const;
const INTUIT_CARD_BACKGROUND = "linear-gradient(160.570626deg, rgb(35 108 255) 33.253%, rgb(30 6 167) 99.82%)";

/** Case Theodoor: conteúdo particular, composição construída apenas com os
 * blocos compartilhados que já passaram pelos refinamentos de SCRIOO e HP. */
export function TheodoorPageV3({ locale }: TheodoorPageV3Props) {
  const homeHref = locale === "pt" ? "/pt/v3" : "/v3";
  const aboutHref = locale === "pt" ? "/pt/v3/sobre" : "/v3/about";
  const languageHref = locale === "pt" ? "/v3/cases/theodoor" : "/pt/v3/cases/theodoor";
  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: homeHref },
    { label: getCopy(locale, "shared.nav.about"), href: aboutHref },
    { label: getCopy(locale, "shared.nav.contact"), href: `${homeHref}#contact` },
    { label: getCopy(locale, "shared.nav.resume"), href: RESUME_HREF[locale] },
  ];

  return <>
    <NavBarV3 locale={locale} identityHref={homeHref} languageHref={languageHref} context="light" links={links} />
    <main>
      <CaseHeroV3
        locale={locale}
        tags={TAG_KEYS.map((key) => getCopy(locale, key))}
        title={getCopy(locale, "theodoor.hero.title")}
        summary={getCopy(locale, "theodoor.hero.summary")}
        backHref={`${homeHref}#selected-work`}
        prevCaseHref={locale === "pt" ? "/pt/v3/cases/hp" : "/v3/cases/hp"}
        nextCaseHref={locale === "pt" ? "/pt/v3/cases/intuit" : "/v3/cases/intuit"}
        devices={THEODOOR_ASSETS.hero.devices}
        backgroundDesktop={THEODOOR_ASSETS.hero.backgroundDesktop}
        backgroundTablet={THEODOOR_ASSETS.hero.backgroundTablet}
        backgroundMobile={`url(${THEODOOR_ASSETS.hero.backgroundTablet.src})`}
        noiseColor="var(--color-case-theodoor-surface)"
      />
      <CaseContextV3
        eyebrow={getCopy(locale, "shared.case.context.eyebrow")}
        title={getCopy(locale, "theodoor.context.title")}
        paragraphs={([1, 2, 3] as const).map((index) => getCopy(locale, `theodoor.context.p${index}` as CopyKey))}
        media={<img src={THEODOOR_ASSETS.context.image.src} width={THEODOOR_ASSETS.context.image.width} height={THEODOOR_ASSETS.context.image.height} alt="" />}
      />
      <CaseMetaRowV3 items={[
        { icon: "person-card", label: getCopy(locale, "shared.case.role.label"), value: getCopy(locale, "theodoor.context.role") },
        { icon: "handshake-2", label: getCopy(locale, "shared.case.collab.label"), value: getCopy(locale, "theodoor.context.collab") },
      ]} />
      <CaseDecisionsV3
        locale={locale}
        eyebrow={getCopy(locale, "shared.case.decisions.eyebrow")}
        title={getCopy(locale, "theodoor.decisions.title")}
        items={([1, 2] as const).map((index) => ({
          title: getCopy(locale, `theodoor.decisions.${index}.title` as CopyKey),
          problem: getCopy(locale, `theodoor.decisions.${index}.problem` as CopyKey),
          proposal: getCopy(locale, `theodoor.decisions.${index}.proposal` as CopyKey),
          argument: getCopy(locale, `theodoor.decisions.${index}.argument` as CopyKey),
          media: index === 1 ? THEODOOR_ASSETS.decisions.primary : THEODOOR_ASSETS.decisions.secondary,
        }))}
        mediaThumbnails={[THEODOOR_ASSETS.decisions.secondary, THEODOOR_ASSETS.decisions.tertiary]}
      />
      <CaseValidationV3
        eyebrow={getCopy(locale, "theodoor.prototyping.eyebrow")}
        title={getCopy(locale, "theodoor.prototyping.title")}
        body={getCopy(locale, "theodoor.prototyping.body")}
        media={THEODOOR_ASSETS.prototyping.overview}
        cards={([1, 2, 3] as const).map((index) => ({
          banner: THEODOOR_ASSETS.prototyping.cards[index - 1],
          name: getCopy(locale, `theodoor.prototyping.${index}.name` as CopyKey),
          questionLabel: getCopy(locale, "shared.case.scenario.label"),
          question: getCopy(locale, `theodoor.prototyping.${index}.scenario` as CopyKey),
          testLabel: getCopy(locale, "shared.case.settle.label"),
          test: getCopy(locale, `theodoor.prototyping.${index}.settle` as CopyKey),
          changedLabel: getCopy(locale, "shared.case.became.label"),
          changed: getCopy(locale, `theodoor.prototyping.${index}.became` as CopyKey),
        }))}
        conclusion={getCopy(locale, "theodoor.prototyping.conclusion")}
      />
      <CaseOutcomeV3
        eyebrow={getCopy(locale, "shared.case.outcome.eyebrow")}
        title={getCopy(locale, "theodoor.outcome.title")}
        body={getCopy(locale, "theodoor.outcome.body")}
        checklist={([1, 2, 3, 4] as const).map((index) => getCopy(locale, `theodoor.outcome.${index}` as CopyKey))}
        primaryMedia={THEODOOR_ASSETS.outcome.image}
        secondaryContent={<video src={THEODOOR_ASSETS.outcome.video} autoPlay loop muted playsInline aria-hidden="true" />}
        stackedMedia
      />
      <CaseReflectionV3
        eyebrow={getCopy(locale, "shared.case.reflection.eyebrow")}
        title={getCopy(locale, "theodoor.reflection.title")}
        lead={getCopy(locale, "theodoor.reflection.lead")}
        quote={getCopy(locale, "theodoor.reflection.body")}
        nextLabel={getCopy(locale, "shared.case.next")}
        next={{
          href: locale === "pt" ? "/pt/v3/cases/intuit" : "/v3/cases/intuit",
          logoSrc: "/images/v3/home/brands/white/intuit.svg",
          logoAlt: "Intuit",
          logoWidth: 71,
          name: getCopy(locale, "shared.cases.intuit.name"),
          summary: getCopy(locale, "shared.cases.intuit.summary"),
          background: INTUIT_CARD_BACKGROUND,
        }}
      />
      <div id="contact"><ContactCTA locale={locale} contactHref={`${homeHref}#contact`} /></div>
    </main>
    <FooterV3 locale={locale} homeHref={homeHref} aboutHref={aboutHref} resumeHref={RESUME_HREF[locale]} linkedinHref={LINKEDIN_HREF} />
  </>;
}
