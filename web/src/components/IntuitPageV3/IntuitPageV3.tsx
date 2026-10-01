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
import { INTUIT_ASSETS } from "@/content/intuit-assets";

export interface IntuitPageV3Props {
  locale: Locale;
}

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
const TAG_KEYS = ["shared.tags.design-systems", "shared.tags.research", "shared.tags.financial-education"] as const;
// Mesmo gradiente usado no card "Next case" que já aponta pro Intuit (ver
// TheodoorPageV3) — token de superfície do Aster ainda não tem um par de
// stops de gradiente próprio verificado no Figma pra esse card pequeno,
// então uso os dois tokens de cor que já existem (`--color-case-aster-
// card-gradient-from/to`) num degradê simples, não um valor cravado.
const ASTER_CARD_BACKGROUND =
  "linear-gradient(160deg, var(--color-case-aster-card-gradient-from) 20%, var(--color-case-aster-card-gradient-to) 100%)";

/**
 * Case Intuit: mesmo padrão de composição de Theodoor/SCRIOO/HP, só com
 * blocos compartilhados. Particularidades da Intuit (node 2262:68921):
 * Decisions tem 2 itens (não 3), a mídia de Research já vem pronta como
 * uma imagem só (fundo + texto + fotos, não uma montagem em código), e
 * Reflection não tem a linha de abertura curta — só citação e fechamento.
 *
 * Restrição de publicação (NORTE.md, "Intuit — restrição de publicação"):
 * é o único case cujo produto não existe publicamente. Autorização da
 * liderança de design da ArcTouch confirmada pelo Deiver em 30/09/2026.
 */
export function IntuitPageV3({ locale }: IntuitPageV3Props) {
  const homeHref = locale === "pt" ? "/pt" : "/";
  const aboutHref = locale === "pt" ? "/pt/sobre" : "/about";
  const languageHref = locale === "pt" ? "/cases/intuit" : "/pt/cases/intuit";
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
          tags={TAG_KEYS.map((key) => getCopy(locale, key))}
          title={getCopy(locale, "intuit.hero.title")}
          summary={getCopy(locale, "intuit.hero.summary")}
          backHref={`${homeHref}#selected-work`}
          prevCaseHref={locale === "pt" ? "/pt/cases/theodoor" : "/cases/theodoor"}
          nextCaseHref={locale === "pt" ? "/pt/cases/aster" : "/cases/aster"}
          devices={INTUIT_ASSETS.hero.devices}
          devicesDesktop={INTUIT_ASSETS.hero.devicesDesktop}
          deviceAlignTablet="bottom"
          backgroundDesktop={INTUIT_ASSETS.hero.backgroundDesktop}
          backgroundTablet={INTUIT_ASSETS.hero.backgroundTablet}
          backgroundMobile={`url(${INTUIT_ASSETS.hero.backgroundMobile.src})`}
          noiseColor="var(--color-case-intuit-surface)"
        />
        <CaseContextV3
          eyebrow={getCopy(locale, "shared.case.context.eyebrow")}
          title={getCopy(locale, "intuit.context.title")}
          paragraphs={([1, 2, 3] as const).map((index) => getCopy(locale, `intuit.context.p${index}` as CopyKey))}
          media={
            <img
              src={INTUIT_ASSETS.decisions.phones.src}
              width={INTUIT_ASSETS.decisions.phones.width}
              height={INTUIT_ASSETS.decisions.phones.height}
              alt=""
            />
          }
        />
        <CaseMetaRowV3
          items={[
            {
              icon: "person-card",
              label: getCopy(locale, "shared.case.role.label"),
              value: getCopy(locale, "intuit.context.role"),
            },
            {
              icon: "handshake-2",
              label: getCopy(locale, "shared.case.collab.label"),
              value: getCopy(locale, "intuit.context.collab"),
            },
          ]}
        />
        <CaseDecisionsV3
          locale={locale}
          eyebrow={getCopy(locale, "shared.case.decisions.eyebrow")}
          title={getCopy(locale, "intuit.decisions.title")}
          items={([1, 2] as const).map((index) => ({
            title: getCopy(locale, `intuit.decisions.${index}.title` as CopyKey),
            problem: getCopy(locale, `intuit.decisions.${index}.problem` as CopyKey),
            proposal: getCopy(locale, `intuit.decisions.${index}.proposal` as CopyKey),
            argument: getCopy(locale, `intuit.decisions.${index}.argument` as CopyKey),
            media: index === 1 ? INTUIT_ASSETS.decisions.phones : INTUIT_ASSETS.decisions.typeScale,
          }))}
          mediaThumbnails={[INTUIT_ASSETS.decisions.tokens, INTUIT_ASSETS.decisions.typeScale]}
        />
        <CaseValidationV3
          eyebrow={getCopy(locale, "intuit.research.eyebrow")}
          title={getCopy(locale, "intuit.research.title")}
          body={getCopy(locale, "intuit.research.body")}
          media={INTUIT_ASSETS.research.interviews}
          cards={([1, 2, 3] as const).map((index) => ({
            banner: INTUIT_ASSETS.cards[index - 1],
            name: getCopy(locale, `intuit.research.${index}.name` as CopyKey),
            questionLabel: getCopy(locale, "shared.case.validation.question"),
            question: getCopy(locale, `intuit.research.${index}.question` as CopyKey),
            testLabel: getCopy(locale, "shared.case.validation.test"),
            test: getCopy(locale, `intuit.research.${index}.test` as CopyKey),
            changedLabel: getCopy(locale, "shared.case.validation.changed"),
            changed: getCopy(locale, `intuit.research.${index}.changed` as CopyKey),
          }))}
          conclusion={getCopy(locale, "intuit.research.conclusion")}
        />
        <CaseOutcomeV3
          eyebrow={getCopy(locale, "shared.case.outcome.eyebrow")}
          title={getCopy(locale, "intuit.outcome.title")}
          body={getCopy(locale, "intuit.outcome.body")}
          checklist={([1, 2, 3, 4] as const).map((index) => getCopy(locale, `intuit.outcome.${index}` as CopyKey))}
          primaryMedia={INTUIT_ASSETS.outcome.designSystem}
          secondaryMedia={INTUIT_ASSETS.outcome.bento}
          extra={
            <img
              src={INTUIT_ASSETS.outcome.lifestyle.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
            />
          }
        />
        <CaseReflectionV3
          eyebrow={getCopy(locale, "shared.case.reflection.eyebrow")}
          title={getCopy(locale, "intuit.reflection.title")}
          quote={getCopy(locale, "intuit.reflection.lead")}
          close={getCopy(locale, "intuit.reflection.body")}
          nextLabel={getCopy(locale, "shared.case.next")}
          next={{
            href: locale === "pt" ? "/pt/cases/aster" : "/cases/aster",
            logoSrc: "/images/v3/home/brands/white/aster.svg",
            logoAlt: "Aster",
            name: getCopy(locale, "shared.cases.aster.name"),
            summary: getCopy(locale, "shared.cases.aster.summary"),
            background: ASTER_CARD_BACKGROUND,
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
