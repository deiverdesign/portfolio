import { NavBar } from "@/components/NavBar/NavBar";
import { RESUME_DOWNLOAD_NAME, RESUME_HREF, type Locale } from "@/components/NavBar/constants";
import { Button } from "@/components/Button/Button";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { CapabilityCard } from "@/components/CapabilityCard/CapabilityCard";
import { LinkTertiary } from "@/components/LinkTertiary/LinkTertiary";
import { Footer } from "@/components/Footer/Footer";
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

  return (
    <>
      <NavBar context="dark" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroVisual}>
              <div className={styles.glowTeal} />
              <div className={styles.glowOrange} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-photo.png" alt={t.heroPhotoAlt} className={styles.heroPhoto} />
            </div>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>{t.eyebrow}</span>
              <h1 className={styles.heroTitle}>{t.title}</h1>
              <p className={styles.heroIntro}>{t.intro}</p>
              <div className={styles.heroActions}>
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

        <section id="work" className={styles.workSection}>
          <h2>{t.workHeading}</h2>
          <div className={styles.workGrid}>
            {featuredCases.map((c) => (
              <CaseCardLarge key={c.number} imageAlt={c.title} locale={locale} {...c} />
            ))}
          </div>
          <LinkTertiary context="light" href={workHref}>
            {t.viewAllCasesLabel}
          </LinkTertiary>
        </section>

        <section className={styles.workSection}>
          <span className={styles.sectionEyebrow}>{t.capabilitiesPreview.eyebrow}</span>
          <h2>{t.capabilitiesPreview.title}</h2>
          <p className={styles.sectionIntro}>{capabilities.intro}</p>
          <div className={styles.capabilitiesGrid}>
            {previewCapabilities.map((cap) => (
              <CapabilityCard
                key={cap.number}
                number={cap.number}
                title={cap.title}
                description={cap.description}
                tags={cap.tags}
                linkLabel={t.capabilitiesPreview.cardLinkLabel}
                href={capabilitiesHref}
              />
            ))}
          </div>
          <LinkTertiary context="light" href={capabilitiesHref}>
            {t.capabilitiesPreview.viewAllLabel}
          </LinkTertiary>
        </section>

        <section className={styles.workSection}>
          <span className={styles.sectionEyebrow}>{t.aboutPreview.eyebrow}</span>
          <blockquote className={styles.aboutQuote}>{about.bioParagraphs[0]}</blockquote>
          <LinkTertiary context="light" href={aboutHref}>
            {t.aboutPreview.linkLabel}
          </LinkTertiary>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalCtaInner}>
            <span className={styles.eyebrow}>{t.finalCta.eyebrow}</span>
            <h2 className={styles.finalCtaTitle}>{t.finalCta.title}</h2>
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
