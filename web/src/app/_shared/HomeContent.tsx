import { Fragment, type CSSProperties } from "react";
import { NavBar } from "@/components/NavBar/NavBar";
import { RESUME_DOWNLOAD_NAME, RESUME_HREF, type Locale } from "@/components/NavBar/constants";
import { Button } from "@/components/Button/Button";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { CapabilityCard } from "@/components/CapabilityCard/CapabilityCard";
import { LinkTertiary } from "@/components/LinkTertiary/LinkTertiary";
import { RevealMask } from "@/components/RevealMask/RevealMask";
import { BrandsSection, type Brand } from "@/components/BrandsSection/BrandsSection";
import { LensBlurGlow } from "@/components/LensBlurGlow/LensBlurGlow";
import { Footer } from "@/components/Footer/Footer";
import { DisplayText } from "@/components/DisplayText/DisplayText";
import { buildCapabilitiesCopy } from "./CapabilitiesContent";
import { ABOUT_COPY } from "./AboutContent";
import styles from "./home.module.css";

export interface CaseCopy {
  number: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  href: string;
  imageSrc: string;
  imageAlt?: string;
  locked?: boolean;
  maxWidth?: number;
  imagePosition?: "top" | "center";
  /** Logo do cliente — aparece no lugar do número quando existe.
      Sem isso, o card continua mostrando o número normal. */
  logoSrc?: string;
  logoAlt?: string;
  /** Ajuste manual de tamanho pra esse logo específico (1 = tamanho normal). */
  logoScale?: number;
}

interface HomeCopy {
  heroPhotoAlt: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  workHeading: string;
  viewAllCasesLabel: string;
  brands: {
    eyebrow: string;
    caption: string;
    playLabel: string;
    pauseLabel: string;
  };
  capabilitiesPreview: {
    eyebrow: string;
    title: string;
    cardLinkLabel: string;
    viewAllLabel: string;
  };
  aboutPreview: {
    eyebrow: string;
    linkLabel: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    contactLabel: string;
  };
}

const COPY: Record<Locale, HomeCopy> = {
  pt: {
    heroPhotoAlt: "Foto de Deiver Brito",
    eyebrow: "PRODUCT DESIGNER SÊNIOR · FLORIPA · BRASIL",
    title: "Design para simplificar produtos complexos.",
    intro:
      "Ajudo times a transformar ambiguidade, restrições técnicas e jornadas fragmentadas em lógica de produto clara, interfaces escaláveis e experiências construíveis.",
    ctaPrimary: "Ver trabalhos selecionados",
    ctaSecondary: "Baixar currículo",
    workHeading: "Trabalho",
    viewAllCasesLabel: "Ver todos os trabalhos",
    brands: {
      eyebrow: "MARCAS COM QUE JÁ TRABALHEI",
      caption: "Trabalho entregue em atuação de agência e in-house.",
      playLabel: "Retomar a rolagem dos logos",
      pauseLabel: "Pausar a rolagem dos logos",
    },
    capabilitiesPreview: {
      eyebrow: "COMPETÊNCIAS",
      title: "Explore o trabalho por competência",
      cardLinkLabel: "Ver trabalhos relacionados",
      viewAllLabel: "Ver todas as competências",
    },
    aboutPreview: {
      eyebrow: "SOBRE",
      linkLabel: "Leia mais sobre mim",
    },
    finalCta: {
      eyebrow: "VAMOS TRABALHAR JUNTOS",
      title: "Vamos construir produtos mais claros.",
      contactLabel: "Fale comigo",
    },
  },
  en: {
    heroPhotoAlt: "Photo of Deiver Brito",
    eyebrow: "SENIOR PRODUCT DESIGNER · FLORIPA · BRAZIL",
    title: "Designing clarity for complex digital products.",
    intro:
      "I help teams turn ambiguity, technical constraints, and fragmented user journeys into clear product logic, scalable interfaces, and buildable experiences.",
    ctaPrimary: "View selected work",
    ctaSecondary: "Download resume",
    workHeading: "Work",
    viewAllCasesLabel: "See all work",
    brands: {
      eyebrow: "BRANDS I'VE WORKED WITH",
      caption: "Work delivered across agency and in-house product design roles.",
      playLabel: "Resume logo scroll",
      pauseLabel: "Pause logo scroll",
    },
    capabilitiesPreview: {
      eyebrow: "CAPABILITIES",
      title: "Explore the work by capability",
      cardLinkLabel: "View related work",
      viewAllLabel: "See all capabilities",
    },
    aboutPreview: {
      eyebrow: "ABOUT",
      linkLabel: "Read more about me",
    },
    finalCta: {
      eyebrow: "LET'S WORK TOGETHER",
      title: "Let's build clearer products.",
      contactLabel: "Contact me",
    },
  },
};

/**
 * Marcas com quem já trabalhei (agência + in-house) — nomes/logos não mudam
 * por idioma. Dimensões = viewBox real de cada SVG exportado do Figma
 * (/ExportLogosPortfolio), pra manter a proporção correta em altura fixa.
 */
const BRANDS: Brand[] = [
  { name: "HP", src: "/images/brands/hp.svg", width: 38, height: 38 },
  { name: "Intuit", src: "/images/brands/intuit.svg", width: 94, height: 18, scale: 0.56 },
  { name: "McCormick", src: "/images/brands/mccormick.svg", width: 47, height: 39 },
  { name: "Softplan", src: "/images/brands/softplan.svg", width: 117, height: 26, scale: 0.7 },
  { name: "Unimed", src: "/images/brands/unimed.svg", width: 110, height: 16, scale: 0.7 },
  { name: "Track & Field", src: "/images/brands/track-and-field.svg", width: 55, height: 30 },
  { name: "CURE", src: "/images/brands/cure.svg", width: 60, height: 32 },
  { name: "Theodoor", src: "/images/brands/theodoor.svg", width: 114, height: 36 },
  { name: "Cirrus", src: "/images/brands/cirrus.svg", width: 134, height: 26 },
  { name: "HSS", src: "/images/brands/hss.svg", width: 41, height: 41 },
  { name: "Lightship", src: "/images/brands/lightship.svg", width: 122, height: 48 },
  { name: "NSC", src: "/images/brands/nsc.svg", width: 46, height: 38 },
];

/**
 * Todos os 5 cases — fonte única compartilhada pela Home (mostra só os 2
 * primeiros, ver `featuredCases` abaixo) e pela página /work (mostra os 5).
 */
export function buildCasesCopy(locale: Locale): CaseCopy[] {
  const prefix = locale === "pt" ? "/pt/cases" : "/cases";

  if (locale === "en") {
    return [
      {
        number: "01",
        title: "Cure Intelligence / SCRIOO",
        summary: "AI-powered supply chain risk intelligence platform.",
        description:
          "Redesign of a data-heavy platform to help users understand risk signals, suppliers, filters, dashboards, and operational decisions.",
        tags: ["Complex systems", "AI", "Data-heavy UX", "Enterprise"],
        href: `${prefix}/cure`,
        imageSrc: "/images/cure.png",
        imagePosition: "center" as const,
        logoSrc: "/images/brands/cure.svg",
        logoAlt: "CURE",
      },
      {
        number: "02",
        title: "HP Subscription Onboarding",
        summary: "Guided setup for a printer-inclusive subscription model.",
        description:
          "Helping turn a printer-inclusive subscription model into a clearer setup and account experience, through UX/UI, design system application, and handoff for implementation.",
        tags: ["Subscription UX", "Connected products", "Hardware service"],
        href: `${prefix}/hp`,
        imageSrc: "/images/hp.png",
        logoSrc: "/images/brands/hp.svg",
        logoAlt: "HP",
      },
      {
        number: "03",
        title: "Theodoor",
        summary: "Accessible app for smart door automation.",
        description:
          "Designing an accessible mobile experience with multimodal feedback, real constraints, edge cases, and AI-assisted behavioral prototyping.",
        tags: ["Accessibility", "Mobile", "Physical-digital UX"],
        href: `${prefix}/theodoor`,
        imageSrc: "/images/theodoor.png",
        logoSrc: "/images/brands/theodoor.svg",
        logoAlt: "Theodoor",
      },
      {
        number: "04",
        title: "Intuit for Education",
        summary: "Financial education experience for students.",
        description:
          "Helping students track the present, plan the future, and learn about money in context, through a mobile product with rich visual language and a design system I helped build from the ground up.",
        tags: ["Product Discovery", "Financial education", "Design Systems"],
        href: `${prefix}/intuit`,
        imageSrc: "/images/intuit.png",
        logoSrc: "/images/brands/intuit.svg",
        logoAlt: "Intuit",
        logoScale: 0.595, /* 30% menor (0.7) + mais 15% em cima = 0.7*0.85 */
      },
      {
        number: "05",
        title: "ASTER",
        summary: "Exploring AI as a clinical collaborator in high-risk consultations.",
        description:
          "A password-protected case study about trust, interaction boundaries, and shared accountability between physicians and a clinical AI collaborator.",
        tags: ["AI interaction", "Healthcare", "Trust and safety"],
        href: `${prefix}/aster`,
        imageSrc: "/images/aster/aster-cover.png",
        imageAlt: "Illustration of a locked folder, representing the password-protected case.",
        locked: true,
        maxWidth: 600,
        imagePosition: "center" as const,
        logoSrc: "/images/brands/aster.svg",
        logoAlt: "ASTER",
      },
    ];
  }

  return [
    {
      number: "01",
      title: "Cure Intelligence / SCRIOO",
      summary: "Plataforma de inteligência de riscos em supply chain com IA.",
      description:
        "Redesign de uma plataforma densa em dados para ajudar usuários a entender sinais de risco, fornecedores, filtros, dashboards e decisões operacionais.",
      tags: ["Sistemas complexos", "UX denso em dados", "IA", "Dashboards"],
      href: `${prefix}/cure`,
      imageSrc: "/images/cure.png",
      imagePosition: "center" as const,
      logoSrc: "/images/brands/cure.svg",
      logoAlt: "CURE",
    },
    {
      number: "02",
      title: "HP Subscription Onboarding",
      summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
      description:
        "Ajudando a transformar um modelo de assinatura incluída em uma experiência mais clara de configuração e conta.",
      tags: ["UX de assinatura", "Produtos conectados", "Serviço com hardware"],
      href: `${prefix}/hp`,
      imageSrc: "/images/hp.png",
      logoSrc: "/images/brands/hp.svg",
      logoAlt: "HP",
    },
    {
      number: "03",
      title: "Theodoor",
      summary: "App acessível para automação de portas inteligentes.",
      description:
        "Design de uma experiência mobile acessível com feedback multimodal, restrições reais e edge cases.",
      tags: ["Acessibilidade", "Mobile", "UX físico-digital"],
      href: `${prefix}/theodoor`,
      imageSrc: "/images/theodoor.png",
      logoSrc: "/images/brands/theodoor.svg",
      logoAlt: "Theodoor",
    },
    {
      number: "04",
      title: "Intuit for Education",
      summary: "Experiência de educação financeira para estudantes.",
      description:
        "Ajudando estudantes a acompanhar o presente, planejar o futuro e aprender sobre dinheiro em contexto.",
      tags: ["Discovery de produto", "Educação financeira", "Design Systems"],
      href: `${prefix}/intuit`,
      imageSrc: "/images/intuit.png",
      logoSrc: "/images/brands/intuit.svg",
      logoAlt: "Intuit",
      logoScale: 0.7,
    },
    {
      number: "05",
      title: "ASTER",
      summary: "Explorando IA como colaboradora clínica em consultas de alto risco.",
      description:
        "Um estudo de caso protegido por senha sobre confiança, limites de atuação e responsabilidade compartilhada entre médicos e uma IA colaboradora clínica.",
      tags: ["Interação com IA", "Saúde", "Confiança e segurança"],
      href: `${prefix}/aster`,
      imageSrc: "/images/aster/aster-cover.png",
      imageAlt: "Ilustração de uma pasta trancada, representando o case protegido por senha.",
      locked: true,
      maxWidth: 600,
      imagePosition: "center" as const,
      logoSrc: "/images/brands/aster.svg",
      logoAlt: "ASTER",
    },
  ];
}

/**
 * Próximo case na sequência de /work, pulando os bloqueados (ex: ASTER) e
 * voltando pro início depois do último — assim, cases novos adicionados em
 * `buildCasesCopy` entram automaticamente na sequência sem editar cada
 * página individualmente.
 */
export function getNextCase(locale: Locale, currentHref: string): CaseCopy {
  const openCases = buildCasesCopy(locale).filter((c) => !c.locked);
  const currentIndex = openCases.findIndex((c) => c.href === currentHref);
  return openCases[(currentIndex + 1) % openCases.length];
}

/**
 * Par anterior/próximo pro paginador no topo de cada case (diferente do
 * card "Next case" no rodapé, que dá loop de propósito) — aqui as pontas
 * não dão loop: no primeiro case, previous vem null (botão desabilitado);
 * no último, next vem null. Mesma lista de `getNextCase`, então um case
 * novo em `buildCasesCopy` já entra na sequência automaticamente.
 */
export function getCaseNavigation(
  locale: Locale,
  currentHref: string
): { previous: CaseCopy | null; next: CaseCopy | null } {
  const openCases = buildCasesCopy(locale).filter((c) => !c.locked);
  const currentIndex = openCases.findIndex((c) => c.href === currentHref);
  return {
    previous: currentIndex > 0 ? openCases[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < openCases.length - 1 ? openCases[currentIndex + 1] : null,
  };
}

export function HomeContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const otherLocaleHref = locale === "pt" ? "/" : "/pt";
  const about = ABOUT_COPY[locale];
  const aboutHref = locale === "pt" ? "/pt/sobre" : "/about";
  const capabilities = buildCapabilitiesCopy(locale);
  const capabilitiesHref = locale === "pt" ? "/pt/competencias" : "/capabilities";
  const previewCapabilities = capabilities.capabilities.slice(0, 3);
  const featuredCases = buildCasesCopy(locale).slice(0, 2);
  const workHref = locale === "pt" ? "/pt/work" : "/work";

  /* Entrada do hero estilo julius.fm: eyebrow -> cada palavra do título ->
     parágrafo -> botões, 60ms de atraso a mais que o anterior. */
  const heroRevealStep = 60;
  const titleWords = t.title.split(" ");

  return (
    <>
      <NavBar context="dark" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroVisual} data-glow-hover-target>
              <div className={styles.glowTeal} />
              <LensBlurGlow />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-photo.png" alt={t.heroPhotoAlt} className={styles.heroPhoto} />
            </div>
            {/* Composição mobile (≤767px, Figma 617:7769) — só 2 elementos,
                sem foto: glow verde (asset estático, node 617:8058) + orb
                laranja (mesmo LensBlurGlow do desktop, só reescalado via
                CSS). Decorativo: aria-hidden + pointer-events:none no
                wrapper inteiro, pra nunca interceptar toque nos CTAs. */}
            <div className={styles.heroVisualMobile} aria-hidden="true" data-glow-hover-target>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-glow-mobile.png" alt="" className={styles.heroGlowMobile} />
              <LensBlurGlow variant="mobile" />
            </div>
            <div className={styles.heroText}>
              <span className={`${styles.eyebrow} ${styles.heroReveal}`} style={{ "--reveal-delay": "0ms" } as CSSProperties}>
                {t.eyebrow}
              </span>
              <h1
                className={`${styles.heroTitle} ${styles.heroTitleLong} ${locale === "pt" ? styles.heroTitlePt : ""}`}
              >
                {titleWords.map((word, i) => (
                  <Fragment key={i}>
                    {i > 0 ? " " : null}
                    <span
                      className={styles.heroTitleWord}
                      style={{ "--reveal-delay": `${heroRevealStep * (i + 1)}ms` } as CSSProperties}
                    >
                      <DisplayText variant={i === 0 ? "mixed" : "remainder"}>{word}</DisplayText>
                    </span>
                  </Fragment>
                ))}
              </h1>
              <p
                className={`${styles.heroIntro} ${styles.heroReveal}`}
                style={{ "--reveal-delay": `${heroRevealStep * (titleWords.length + 1)}ms` } as CSSProperties}
              >
                {t.intro}
              </p>
              <div
                className={`${styles.heroActions} ${styles.heroReveal}`}
                style={{ "--reveal-delay": `${heroRevealStep * (titleWords.length + 2)}ms` } as CSSProperties}
              >
                <Button variant="primary" context="dark" href="#work">
                  {t.ctaPrimary}
                </Button>
                <Button
                  variant="secondary"
                  context="dark"
                  icon="download"
                  href={RESUME_HREF[locale]}
                  download={RESUME_DOWNLOAD_NAME[locale]}
                >
                  {t.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <BrandsSection
          eyebrow={t.brands.eyebrow}
          caption={t.brands.caption}
          brands={BRANDS}
          playLabel={t.brands.playLabel}
          pauseLabel={t.brands.pauseLabel}
        />

        <section id="work" className={styles.workSection}>
          <div className={styles.sectionHeadingRow}>
            <h2>
              <RevealMask>{t.workHeading}</RevealMask>
            </h2>
            <Button variant="secondary" context="light" icon="arrow-right" href={workHref}>
              {t.viewAllCasesLabel}
            </Button>
          </div>
          <div className={styles.workGrid}>
            {featuredCases.map((c, index) => (
              <CaseCardLarge key={c.number} imageAlt={c.title} locale={locale} revealIndex={index} {...c} />
            ))}
          </div>
        </section>

        <section className={styles.workSection}>
          <RevealMask className={styles.sectionEyebrow}>{t.capabilitiesPreview.eyebrow}</RevealMask>
          <div className={styles.sectionHeadingRow}>
            <h2>
              <RevealMask delayMs={80}>{t.capabilitiesPreview.title}</RevealMask>
            </h2>
            <Button variant="secondary" context="light" icon="arrow-right" href={capabilitiesHref}>
              {t.capabilitiesPreview.viewAllLabel}
            </Button>
          </div>
          <p className={styles.sectionIntro}>{capabilities.intro}</p>
          <div className={styles.capabilitiesGrid}>
            {previewCapabilities.map((cap, index) => (
              <CapabilityCard
                key={cap.number}
                number={cap.number}
                title={cap.title}
                description={cap.description}
                tags={cap.tags}
                linkLabel={t.capabilitiesPreview.cardLinkLabel}
                href={capabilitiesHref}
                revealIndex={index}
              />
            ))}
          </div>
        </section>

        <section className={styles.workSection}>
          <RevealMask className={styles.sectionEyebrow}>{t.aboutPreview.eyebrow}</RevealMask>
          <blockquote className={styles.aboutQuote}>{about.bioParagraphs[0]}</blockquote>
          <LinkTertiary context="light" href={aboutHref}>
            {t.aboutPreview.linkLabel}
          </LinkTertiary>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalCtaInner}>
            <RevealMask className={styles.eyebrow}>{t.finalCta.eyebrow}</RevealMask>
            <h2 className={styles.finalCtaTitle}>
              <RevealMask delayMs={80}><DisplayText>{t.finalCta.title}</DisplayText></RevealMask>
            </h2>
            <p className={styles.finalCtaAvailability}>{about.contactBody[0]}</p>
            <div className={styles.finalCtaActions}>
              <Button variant="primary" context="dark" icon="arrow-right" href="mailto:deiverbrito@gmail.com">
                {t.finalCta.contactLabel}
              </Button>
              <Button
                variant="secondary"
                context="dark"
                icon="download"
                href={RESUME_HREF[locale]}
                download={RESUME_DOWNLOAD_NAME[locale]}
              >
                {t.ctaSecondary}
              </Button>
              <Button
                variant="secondary"
                context="dark"
                icon="external-link"
                href="https://linkedin.com/in/deiverbrito"
              >
                {about.viewLinkedIn}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
