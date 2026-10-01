import { CaseContextV3 } from "@/components/CaseContextV3/CaseContextV3";
import { CaseDecisionsV3 } from "@/components/CaseDecisionsV3/CaseDecisionsV3";
import { CaseHeroV3 } from "@/components/CaseHeroV3/CaseHeroV3";
import { CaseLimitsV3 } from "@/components/CaseLimitsV3/CaseLimitsV3";
import { CaseMetaRowV3 } from "@/components/CaseMetaRowV3/CaseMetaRowV3";
import { CaseOutcomeV3 } from "@/components/CaseOutcomeV3/CaseOutcomeV3";
import { CaseReflectionV3 } from "@/components/CaseReflectionV3/CaseReflectionV3";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import { ASTER_ASSETS } from "@/content/aster-assets";
import type { Locale } from "@/content/i18n";
import { getCopy, type CopyKey } from "@/content/site-copy";

const LINKEDIN_HREF = "https://linkedin.com/in/deiverbrito";
const TAG_KEYS = ["shared.tags.ai-interaction", "shared.tags.healthcare", "shared.tags.trust-safety"] as const;
const SCRIOO_CARD_BACKGROUND = "linear-gradient(160deg, #5ed763 0%, #51ac55 100%)";

export function AsterPageV3({ locale }: { locale: Locale }) {
  const homeHref = locale === "pt" ? "/pt/v3" : "/v3";
  const aboutHref = locale === "pt" ? "/pt/v3/sobre" : "/v3/about";
  const languageHref = locale === "pt" ? "/v3/cases/aster" : "/pt/v3/cases/aster";
  const links: NavBarV3Link[] = [{ label:getCopy(locale,"shared.nav.home"),href:homeHref },{ label:getCopy(locale,"shared.nav.about"),href:aboutHref },{ label:getCopy(locale,"shared.nav.contact"),href:`${homeHref}#contact` },{ label:getCopy(locale,"shared.nav.resume"),href:RESUME_HREF[locale] }];
  const copy = (key: CopyKey) => getCopy(locale, key);
  return <><NavBarV3 locale={locale} identityHref={homeHref} languageHref={languageHref} context="light" links={links}/><main>
    <CaseHeroV3 locale={locale} tags={TAG_KEYS.map(copy)} title={copy("aster.hero.title")} summary={copy("aster.hero.summary")} disclaimer={copy("aster.hero.disclaimer")} disclaimerTooltip={copy("aster.hero.disclaimer.tooltip")} backHref={`${homeHref}#selected-work`} prevCaseHref={locale === "pt" ? "/pt/v3/cases/intuit" : "/v3/cases/intuit"} nextCaseHref={locale === "pt" ? "/pt/v3/cases/scrioo" : "/v3/cases/scrioo"} devices={ASTER_ASSETS.hero.devices} backgroundDesktop={ASTER_ASSETS.hero.backgroundDesktop} backgroundTablet={ASTER_ASSETS.hero.backgroundTablet} backgroundMobile={`url(${ASTER_ASSETS.hero.backgroundMobile.src})`} noiseColor="var(--color-case-aster-surface)" />
    <CaseContextV3 eyebrow={copy("shared.case.context.eyebrow")} title={copy("aster.context.title")} paragraphs={([1,2,3] as const).map(n=>copy(`aster.context.p${n}` as CopyKey))} media={<img src={ASTER_ASSETS.context.src} width={ASTER_ASSETS.context.width} height={ASTER_ASSETS.context.height} alt=""/>}/>
    <CaseMetaRowV3 items={[{icon:"person-card",label:copy("shared.case.role.label"),value:copy("aster.context.role")},{icon:"handshake-2",label:copy("shared.case.collab.label"),value:copy("aster.context.collab")}]} />
    <CaseDecisionsV3 locale={locale} eyebrow={copy("shared.case.decisions.eyebrow")} title={copy("aster.decisions.title")} items={([1,2,3] as const).map((n)=>({title:copy(`aster.decisions.${n}.title` as CopyKey),problem:copy(`aster.decisions.${n}.problem` as CopyKey),proposal:copy(`aster.decisions.${n}.proposal` as CopyKey),argument:copy(`aster.decisions.${n}.argument` as CopyKey),media:n===1?ASTER_ASSETS.decisions.primary:n===2?ASTER_ASSETS.decisions.secondary:ASTER_ASSETS.decisions.tertiary}))} mediaThumbnails={[ASTER_ASSETS.decisions.secondary,ASTER_ASSETS.decisions.tertiary]}/>
    <CaseLimitsV3 eyebrow={copy("aster.limits.eyebrow")} title={copy("aster.limits.title")} body={copy("aster.limits.body")} overview={ASTER_ASSETS.limits.overview} statement={copy("aster.limits.statement")} footnoteLead={copy("aster.limits.footnote.lead")} footnoteList={copy("aster.limits.footnote.list")} items={([1,2,3] as const).map((n)=>({name:copy(`aster.limits.${n}.name` as CopyKey),missing:copy(`aster.limits.${n}.missing` as CopyKey),why:copy(`aster.limits.${n}.why` as CopyKey),status:copy(`aster.limits.${n}.status` as CopyKey),banner:ASTER_ASSETS.limits.cards[n-1]})).reverse()}/>
    <CaseOutcomeV3 eyebrow={copy("shared.case.outcome.eyebrow")} title={copy("aster.outcome.title")} body={copy("aster.outcome.body")} checklist={([1,2,3,4] as const).map(n=>copy(`aster.outcome.${n}` as CopyKey))} primaryMedia={ASTER_ASSETS.outcome.primary} secondaryMedia={ASTER_ASSETS.outcome.secondary} extra={<img src={ASTER_ASSETS.outcome.extra.src} width={ASTER_ASSETS.outcome.extra.width} height={ASTER_ASSETS.outcome.extra.height} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}/>
    <CaseReflectionV3 eyebrow={copy("shared.case.reflection.eyebrow")} title={copy("aster.reflection.title")} lead={copy("aster.reflection.question")} quote={copy("aster.reflection.lead")} close={copy("aster.reflection.body")} nextLabel={copy("shared.case.next")} next={{href:locale==="pt"?"/pt/v3/cases/scrioo":"/v3/cases/scrioo",logoSrc:"/images/v3/home/brands/white/scrioo.svg",logoAlt:"SCRIOO",logoWidth:63,name:copy("shared.cases.scrioo.name"),summary:copy("shared.cases.scrioo.summary"),background:SCRIOO_CARD_BACKGROUND}}/>
    <div id="contact"><ContactCTA locale={locale} contactHref={`${homeHref}#contact`}/></div></main><FooterV3 locale={locale} homeHref={homeHref} aboutHref={aboutHref} resumeHref={RESUME_HREF[locale]} linkedinHref={LINKEDIN_HREF}/></>;
}
