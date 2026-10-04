"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { AsterAccessModal } from "@/components/AsterAccessModal/AsterAccessModal";
import { CarouselIndicatorsV3 } from "@/components/CarouselIndicatorsV3/CarouselIndicatorsV3";
import { CaseCardLargeV3, type CaseCardLargeV3Props } from "@/components/CaseCardLargeV3/CaseCardLargeV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import { SectionEntryV3 } from "@/components/SectionEntryV3/SectionEntryV3";
import { HOME_ASSETS, getHomeBrandLogo, getHomeBrandLogoSize, type HomeBrand } from "@/content/home-assets";
import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import styles from "./SelectedWorkV3.module.css";

type CaseCardDefinition = Omit<CaseCardLargeV3Props, "href"> & { slug: string };

/** Escala sobre `HOME_BRAND_LOGO_SIZE` (componente raiz do Figma) medida
 * em 28/09/2026 comparando o raiz com os 5 cases reais da Home no Figma
 * (node 1104:4476): HP e Intuit bateram os dois em ×1.2. */
const CASE_LOGO_SCALE = 1.2;

function caseLogoSize(brand: HomeBrand) {
  const { width, height } = getHomeBrandLogoSize(brand, CASE_LOGO_SCALE);
  return { logoWidth: width, logoHeight: height };
}

const TAGS = {
  scrioo: ["Design Systems", "AI", "Data-heavy UX"],
  hp: ["Subscription UX", "Service UX"],
  theodoor: ["A11y", "Physical-digital UX"],
  intuit: ["Design Systems", "Research"],
  aster: ["AI Interaction", "Healthcare"],
} as const;

function descriptionLines(locale: Locale, slug: "scrioo" | "hp" | "theodoor" | "intuit" | "aster") {
  if (locale === "en") {
    return {
      scrioo: ["AI-powered", "supply chain", "risk intelligence", "platform."],
      hp: ["Guided setup for a", "printer-included", "subscription."],
      theodoor: ["Accessible app", "for smart door", "automation."],
      intuit: ["Financial education", "for everyday", "student life."],
      aster: ["Ambient AI for", "clinical", "consultations."],
    }[slug];
  }

  return {
    scrioo: ["Plataforma de", "inteligência de riscos", "em supply chain", "com IA."],
    hp: ["Configuração guiada", "para uma assinatura", "com impressora incluída."],
    theodoor: ["App acessível para", "automação de portas", "inteligentes."],
    intuit: ["Educação financeira", "para o dia a dia", "do estudante."],
    aster: ["IA ambiente para", "consultas clínicas."],
  }[slug];
}

function getCards(locale: Locale): CaseCardDefinition[] {
  return [
    {
      slug: "scrioo",
      size: "large",
      titleLines: descriptionLines(locale, "scrioo"),
      logoSrc: getHomeBrandLogo("scrioo", "original"),
      logoAlt: "SCRIOO",
      ...caseLogoSize("scrioo"),
      devices: HOME_ASSETS.cases.scrioo.devices,
      devicesStyle: { right: 0, top: 62, width: 498 },
      mobileDevicesStyle: { left: 16, top: 100, width: 290 },
      decorative: HOME_ASSETS.cases.scrioo.container,
      decorativeOpacity: 0.6,
      gradientFrom: "var(--color-case-scrioo-card-gradient-from)",
      gradientTo: "var(--color-case-scrioo-card-gradient-to)",
      noiseColor: "var(--color-case-scrioo-card-gradient-from)",
      hoverTitle: getCopy(locale, "home.work.scrioo.card-title"),
      hoverQuote: getCopy(locale, "home.work.scrioo.contribution"),
      mobileTitle: getCopy(locale, "home.work.scrioo.contribution-mobile"),
      hoverTags: [...TAGS.scrioo],
    },
    {
      slug: "hp",
      size: "small",
      titleLines: descriptionLines(locale, "hp"),
      logoSrc: getHomeBrandLogo("hp", "white"),
      logoAlt: "HP",
      ...caseLogoSize("hp"),
      devices: HOME_ASSETS.cases.hp.devices,
      mobileDevices: HOME_ASSETS.cases.hp.devicesMobile,
      devicesStyle: { left: 42, top: 71, width: 391 },
      mobileDevicesStyle: { left: 32, top: 116, width: 241 },
      background: "var(--color-case-hp-surface)",
      noiseColor: "var(--color-case-hp-surface)",
      titleColor: "var(--color-foreground-neutral-inverse-strong)",
      hoverTitle: getCopy(locale, "home.work.hp.card-title"),
      hoverQuote: getCopy(locale, "home.work.hp.contribution"),
      mobileTitle: getCopy(locale, "home.work.hp.contribution-mobile"),
      hoverTags: [...TAGS.hp],
    },
    {
      slug: "theodoor",
      size: "small",
      titleLines: descriptionLines(locale, "theodoor"),
      logoSrc: getHomeBrandLogo("theodoor", "white"),
      logoAlt: "Theodoor",
      ...caseLogoSize("theodoor"),
      devices: HOME_ASSETS.cases.theodoor.device,
      mobileDevices: HOME_ASSETS.cases.theodoor.deviceMobile,
      devicesStyle: { left: 50, top: 91, width: 367 },
      mobileDevicesStyle: { left: 29, top: 101, width: 264 },
      background: "var(--gradient-case-theodoor-card)",
      noiseColor: "var(--color-case-theodoor-surface)",
      titleColor: "var(--color-foreground-neutral-inverse-strong)",
      hoverTitle: getCopy(locale, "home.work.theodoor.card-title"),
      hoverQuote: getCopy(locale, "home.work.theodoor.contribution"),
      mobileTitle: getCopy(locale, "home.work.theodoor.contribution-mobile"),
      hoverTags: [...TAGS.theodoor],
    },
    {
      slug: "intuit",
      size: "small",
      titleLines: descriptionLines(locale, "intuit"),
      logoSrc: getHomeBrandLogo("intuit", "white"),
      logoAlt: "Intuit",
      ...caseLogoSize("intuit"),
      devices: HOME_ASSETS.cases.intuit.device,
      mobileDevices: HOME_ASSETS.cases.intuit.deviceMobile,
      devicesStyle: { left: 173, top: 69, width: 299, height: 411, objectFit: "cover" },
      /* O PNG termina na própria base visual da foto. Ancorar pelo rodapé
         evita a faixa azul de 14px que surgia ao posicioná-lo pelo topo. */
      mobileDevicesStyle: { left: 17, bottom: 0, width: 271 },
      background: "var(--gradient-case-intuit-card)",
      noiseColor: "var(--color-case-intuit-surface)",
      titleColor: "var(--color-foreground-neutral-inverse-strong)",
      hoverTitle: getCopy(locale, "home.work.intuit.card-title"),
      hoverQuote: getCopy(locale, "home.work.intuit.contribution"),
      mobileTitle: getCopy(locale, "home.work.intuit.contribution-mobile"),
      hoverTags: [...TAGS.intuit],
    },
    {
      slug: "aster",
      size: "small",
      titleLines: descriptionLines(locale, "aster"),
      logoSrc: getHomeBrandLogo("aster", "white"),
      logoAlt: "Aster",
      ...caseLogoSize("aster"),
      secondDevice: HOME_ASSETS.cases.aster.background,
      secondDeviceStyle: { inset: 0, width: "100%", height: "100%", objectFit: "cover" },
      devices: HOME_ASSETS.cases.aster.foreground,
      devicesStyle: { left: 36, top: 40, width: 401 },
      mobileDevicesStyle: { left: -7, top: 99, width: 334 },
      background: "var(--color-case-aster-card-gradient-from)",
      noiseColor: "var(--color-case-aster-card-gradient-from)",
      titleColor: "var(--color-foreground-neutral-inverse-strong)",
      hoverTitle: getCopy(locale, "home.work.aster.card-title"),
      hoverQuote: getCopy(locale, "home.work.aster.contribution"),
      mobileTitle: getCopy(locale, "home.work.aster.contribution-mobile"),
      hoverTags: [...TAGS.aster],
      locked: true,
    },
  ];
}

function caseHref(locale: Locale, slug: string) {
  return locale === "pt" ? `/pt/cases/${slug}` : `/cases/${slug}`;
}

export interface SelectedWorkV3Props {
  locale: Locale;
}

/** Horizontal case rail: Figma nodes 2262:61769, 2262:61910,
 * 2262:62051 and 2262:62192. */
export function SelectedWorkV3({ locale }: SelectedWorkV3Props) {
  const cards = getCards(locale);
  const asterCaseHref = locale === "pt" ? "/pt/cases/aster" : "/cases/aster";
  const railRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  /* Estado de scroll de verdade, não só índice — achado do Deiver em
     28/09/2026: em telas largas, sobrando espaço no rail, o card "líder"
     pode já revelar TODOS os cards seguintes de uma vez (ex.: com o HP
     como líder, Theodoor/Intuit/Aster já cabem inteiros). Nesse caso não
     faz sentido o botão "Next" continuar clicável até o índice literal
     do último card — ele precisa desabilitar assim que não sobrar mais
     nada de novo pra revelar, mesmo que o índice "ativo" ainda não seja
     o último. Por isso `atEnd`/`atStart` vêm da posição real de scroll
     (`rail.scrollLeft` vs. o máximo possível), não de um índice de card. */
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /* Substituiu o contador "01/05" (Figma, 28/09/2026, node 2299:71180):
     bullets por PÁGINA de scroll, não por card — 5 cases cabem em 3
     páginas de rolagem no desktop, então são 3 pontos, não 5. Mesma
     conta usada pelos botões Prev/Next (rail.clientWidth por "página"). */
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [asterModalOpen, setAsterModalOpen] = useState(false);

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= maxScrollLeft - 1);

    const pages = Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth));
    setPageCount(pages);
    setActivePage(
      maxScrollLeft > 0 ? Math.round((rail.scrollLeft / maxScrollLeft) * (pages - 1)) : 0,
    );
  }, []);

  useEffect(() => {
    /* Achado do Deiver em 28/09/2026: em reloads da mesma URL, o Chrome
       às vezes restaura sozinho o scrollLeft de um <div> com overflow
       (não é scroll de página, é "scroll anchoring" nativo do browser
       pra elementos roláveis) — o rail abria já num card "líder"
       diferente de SCRIOO, com um vão em branco à esquerda do card
       visível, mas o contador ainda mostrava "01/05" porque esse reset
       nativo acontece DEPOIS do primeiro render. Zerar explicitamente
       aqui garante que a Home sempre abre com o primeiro case (SCRIOO)
       de verdade, current independe do que o navegador guardou. */
    const rail = railRef.current;
    if (rail) rail.scrollLeft = 0;
    updateScrollState();
  }, [updateScrollState]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const handleScroll = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateScrollState);
  };

  /* Rola por PÁGINA (a própria largura do rail), não card a card —
     achado do Deiver em 28/09/2026 revendo o vídeo de referência quadro
     a quadro: depois de 1 clique em "next", o SCRIOO não desaparece —
     fica cortado, vazando pela borda esquerda real da tela. Isso só
     acontece se o clique rolar exatamente `rail.clientWidth`, pousando
     onde calhar (não necessariamente alinhado ao início de um card).
     Por isso não usa `scrollIntoView` num card específico nem
     `scroll-snap` — é um scroll de posição livre, tipo carrossel
     paginado clássico. */
  const scrollByPage = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      left: direction * rail.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  /* Clique direto num bullet: mesma matemática de scrollByPage (rail.
     clientWidth por página), só que pulando pra posição absoluta da
     página em vez de somar/subtrair — mesmo padrão do moveToDot em
     BrandsSectionV3. */
  const goToPage = (pageIndex: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({
      left: maxScrollLeft * (pageIndex / Math.max(1, pageCount - 1)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section id="selected-work" className={styles.section} aria-labelledby="selected-work-title">
      <div className={styles.container}>
        <SectionEntryV3 className={styles.header}>
          <h2 id="selected-work-title" className={styles.title} data-motion-part="title">
            {getCopy(locale, "home.work.title")}
          </h2>
        </SectionEntryV3>

        <div
          ref={railRef}
          className={styles.rail}
          role="region"
          aria-roledescription="carousel"
          aria-label={locale === "pt" ? "Projetos selecionados" : "Selected projects"}
          onScroll={handleScroll}
        >
          <div className={styles.track}>
            {cards.map(({ slug, ...card }, index) => (
              <MotionReveal
                as="div"
                key={slug}
                className={styles.cardSlot}
                role="group"
                aria-label={`${index + 1} / ${cards.length}`}
                delayMs={160 + index * 80}
                offsetPx={40}
              >
                <CaseCardLargeV3
                  {...card}
                  href={slug === "aster" ? asterCaseHref : caseHref(locale, slug)}
                  ariaHasPopup={slug === "aster" ? "dialog" : undefined}
                  onClick={slug === "aster" ? (event) => {
                    event.preventDefault();
                    setAsterModalOpen(true);
                  } : undefined}
                />
              </MotionReveal>
            ))}
          </div>
        </div>

        {/* Substitui o contador "01/05" que ficava no header (Figma,
            28/09/2026, node 2299:71172 "Navigation - Case navigation"):
            agora é uma linha própria abaixo do rail, com bullets por
            página à esquerda e os botões Prev/Next à direita. */}
        <MotionReveal as="div" className={styles.footerNav} delayMs={400}>
          <CarouselIndicatorsV3
            count={pageCount}
            activeIndex={activePage}
            onSelect={goToPage}
            getLabel={(index) =>
              `${locale === "pt" ? "Página" : "Page"} ${index + 1}`
            }
          />
          <div className={styles.controls}>
            <ButtonV3
              variant="secondary"
              className={styles.control}
              aria-label={locale === "pt" ? "Projeto anterior" : "Previous project"}
              disabled={atStart}
              onClick={() => scrollByPage(-1)}
            >
              <IconV3 name="arrow-left" size={16} />
            </ButtonV3>
            <ButtonV3
              variant="secondary"
              className={styles.control}
              aria-label={locale === "pt" ? "Próximo projeto" : "Next project"}
              disabled={atEnd}
              onClick={() => scrollByPage(1)}
            >
              <IconV3 name="arrow-right" size={16} />
            </ButtonV3>
          </div>
        </MotionReveal>
      </div>
      {asterModalOpen && (
        <AsterAccessModal
          locale={locale}
          caseHref={asterCaseHref}
          onClose={() => setAsterModalOpen(false)}
        />
      )}
    </section>
  );
}
