import { CaseContextV3 } from "@/components/CaseContextV3/CaseContextV3";
import { CaseDecisionsV3 } from "@/components/CaseDecisionsV3/CaseDecisionsV3";
import { CaseHeroV3 } from "@/components/CaseHeroV3/CaseHeroV3";
import { CaseMetaRowV3 } from "@/components/CaseMetaRowV3/CaseMetaRowV3";
import { CaseOutcomeV3 } from "@/components/CaseOutcomeV3/CaseOutcomeV3";
import { CaseTypeSpecimenCard } from "@/components/CaseOutcomeV3/CaseTypeSpecimenCard";
import { CaseReflectionV3 } from "@/components/CaseReflectionV3/CaseReflectionV3";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { HpOpenQuestionsV3 } from "@/components/HpOpenQuestionsV3/HpOpenQuestionsV3";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import { HP_ASSETS } from "@/content/hp-assets";
import type { Locale } from "@/content/i18n";
import { getCopy, type CopyKey } from "@/content/site-copy";

export interface HpPageV3Props {
  locale: Locale;
}

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
/* Tags conferidas no Hero do Figma (2262:67796). Mantidas em inglês como
   nomes de disciplina, tal como as tags da SCRIOO. */
const HP_HERO_TAGS = ["Service UX", "Subscription UX", "Connected Products"];
/* Figma 2311:72750, HERO-HP-img-bg-Mobile. O export é um radial com
   viewBox 463×702.48; os raios e o centro foram normalizados abaixo para
   conservar a mesma composição em qualquer largura de celular. */
const HP_HERO_MOBILE_BACKGROUND = `radial-gradient(
  ellipse 31.896328% 8.888794% at 51.885529% 88.88794%,
  #84a6e9 0%,
  #6891e3 4.5252%,
  #4b7cdd 9.0504%,
  #2f67d7 13.576%,
  #1353d2 18.101%,
  #0149d5 35.649%,
  #0139a8 59.781%,
  #00297b 83.912%,
  #0039ac 100%
)`;

/**
 * Fundação do case HP: mesma composição aprovada na SCRIOO, alimentada por
 * conteúdo e assets do frame 2262:67793. As seções que diferem (Open
 * questions e Outcome de design system) entram como extensões próprias,
 * sem forçar uma abstração errada no contrato compartilhado.
 */
export function HpPageV3({ locale }: HpPageV3Props) {
  const homeHref = locale === "pt" ? "/pt/v3" : "/v3";
  const aboutHref = locale === "pt" ? "/pt/v3/sobre" : "/v3/about";
  const languageHref = locale === "pt" ? "/v3/cases/hp" : "/pt/v3/cases/hp";
  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: homeHref },
    { label: getCopy(locale, "shared.nav.about"), href: aboutHref },
    { label: getCopy(locale, "shared.nav.contact"), href: `${homeHref}#contact` },
    { label: getCopy(locale, "shared.nav.resume"), href: RESUME_HREF[locale] },
  ];

  return (
    <>
      <NavBarV3 locale={locale} identityHref={homeHref} languageHref={languageHref} context="light" links={links} />
      <main>
        <CaseHeroV3
          locale={locale}
          tags={HP_HERO_TAGS}
          title={getCopy(locale, "hp.hero.title")}
          summary={getCopy(locale, "hp.hero.summary")}
          backHref={`${homeHref}#selected-work`}
          devices={HP_ASSETS.hero.devices}
          backgroundDesktop={HP_ASSETS.hero.backgroundDesktop}
          backgroundTablet={HP_ASSETS.hero.backgroundTablet}
          backgroundMobile={HP_HERO_MOBILE_BACKGROUND}
          noiseColor="var(--color-case-hp-surface)"
        />
        <CaseContextV3
          eyebrow={getCopy(locale, "shared.case.context.eyebrow")}
          title={getCopy(locale, "hp.context.title")}
          paragraphs={([1, 2, 3, 4] as const).map((index) => getCopy(locale, `hp.context.p${index}` as CopyKey))}
          media={<img src={HP_ASSETS.context.account.src} width={HP_ASSETS.context.account.width} height={HP_ASSETS.context.account.height} alt="" />}
          compactAfter
        />
        <CaseMetaRowV3
          compactBefore
          items={[
            { icon: "person-card", label: getCopy(locale, "shared.case.role.label"), value: getCopy(locale, "hp.context.role") },
            { icon: "handshake-2", label: getCopy(locale, "shared.case.collab.label"), value: getCopy(locale, "hp.context.collab") },
          ]}
        />
        <CaseDecisionsV3
          locale={locale}
          eyebrow={getCopy(locale, "shared.case.decisions.eyebrow")}
          title={getCopy(locale, "hp.decisions.title")}
          items={([1, 2] as const).map((index) => ({
            title: getCopy(locale, `hp.decisions.${index}.title` as CopyKey),
            problem: getCopy(locale, `hp.decisions.${index}.problem` as CopyKey),
            proposal: getCopy(locale, `hp.decisions.${index}.proposal` as CopyKey),
            argument: getCopy(locale, `hp.decisions.${index}.argument` as CopyKey),
            media: HP_ASSETS.decisions.devices,
          }))}
          showThumbnails={false}
        />
        <HpOpenQuestionsV3
          eyebrow={getCopy(locale, "shared.case.open-questions.eyebrow")}
          title={getCopy(locale, "hp.questions.title")}
          body={getCopy(locale, "hp.questions.body")}
          media={HP_ASSETS.openQuestions.overview}
          labels={{
            question: getCopy(locale, "shared.case.validation.question"),
            why: getCopy(locale, "shared.case.validation.why"),
            changed: getCopy(locale, "shared.case.validation.changed"),
          }}
          cards={([1, 2, 3] as const).map((index) => ({
            banner: HP_ASSETS.openQuestions.cards[index - 1],
            name: getCopy(locale, `hp.questions.${index}.name` as CopyKey),
            question: getCopy(locale, `hp.questions.${index}.question` as CopyKey),
            why: getCopy(locale, `hp.questions.${index}.why` as CopyKey),
            changed: getCopy(locale, `hp.questions.${index}.changed` as CopyKey),
          }))}
          conclusion={getCopy(locale, "hp.questions.conclusion")}
        />
        <CaseOutcomeV3
          eyebrow={getCopy(locale, "shared.case.outcome.eyebrow")}
          title={getCopy(locale, "hp.outcome.title")}
          body={getCopy(locale, "hp.outcome.body")}
          checklist={([1, 2, 3, 4] as const).map((index) => getCopy(locale, `hp.outcome.${index}` as CopyKey))}
          primaryMedia={HP_ASSETS.outcome.system}
          secondaryMedia={HP_ASSETS.outcome.brand}
          extra={
            <CaseTypeSpecimenCard
              labelSrc={HP_ASSETS.outcome.typeLabel}
              labelAlt="Forma DJR Micro"
              glyphSrc={HP_ASSETS.outcome.typeGlyph}
              surfaceColor="var(--color-case-hp-surface)"
              labelSize={{ width: 79, height: 33 }}
            />
          }
        />
        <CaseReflectionV3
          eyebrow={getCopy(locale, "shared.case.reflection.eyebrow")}
          title={getCopy(locale, "hp.reflection.title")}
          lead={getCopy(locale, "hp.reflection.lead")}
          quote={getCopy(locale, "hp.reflection.body")}
          nextLabel={getCopy(locale, "shared.case.next")}
          next={{
            href: locale === "pt" ? "/pt/v3/cases/theodoor" : "/v3/cases/theodoor",
            logoSrc: "/images/v3/home/brands/white/theodoor.svg",
            logoAlt: "Theodoor",
            logoWidth: 104,
            name: "Theodoor",
            summary: locale === "pt" ? "App acessível para automação de portas inteligentes." : "Accessible app for smart door automation.",
            background: "var(--color-case-theodoor-accent)",
          }}
        />
        <div id="contact">
          <ContactCTA locale={locale} contactHref={`${homeHref}#contact`} />
        </div>
      </main>
      <FooterV3 locale={locale} homeHref={homeHref} aboutHref={aboutHref} resumeHref={RESUME_HREF[locale]} linkedinHref={LINKEDIN_HREF} />
    </>
  );
}
