import { NavBar, RESUME_HREF, type Locale } from "@/components/NavBar/NavBar";
import { Button } from "@/components/Button/Button";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { Footer } from "@/components/Footer/Footer";
import styles from "../(pt)/home.module.css";

interface CaseCopy {
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
}

interface HomeCopy {
  heroPhotoAlt: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  workHeading: string;
  cases: CaseCopy[];
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
    cases: [
      {
        number: "01",
        title: "Cure Intelligence / SCRIOO",
        summary: "Plataforma de inteligência de riscos em supply chain com IA.",
        description:
          "Redesign de uma plataforma densa em dados para ajudar usuários a entender sinais de risco, fornecedores, filtros, dashboards e decisões operacionais.",
        tags: ["Sistemas complexos", "UX denso em dados", "IA", "Dashboards"],
        href: "/cases/cure",
        imageSrc: "/images/cure.png",
      },
      {
        number: "02",
        title: "HP Subscription Onboarding",
        summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
        description:
          "Ajudando a transformar um modelo de assinatura incluída em uma experiência mais clara de configuração e conta.",
        tags: ["UX de assinatura", "Produtos conectados", "Serviço com hardware"],
        href: "/cases/hp",
        imageSrc: "/images/hp.png",
      },
      {
        number: "03",
        title: "Theodoor",
        summary: "App acessível para automação de portas inteligentes.",
        description:
          "Design de uma experiência mobile acessível com feedback multimodal, restrições reais e edge cases.",
        tags: ["Acessibilidade", "Mobile", "UX físico-digital"],
        href: "/cases/theodoor",
        imageSrc: "/images/theodoor.png",
      },
      {
        number: "04",
        title: "Intuit for Education",
        summary: "Experiência de educação financeira para estudantes.",
        description:
          "Ajudando estudantes a acompanhar o presente, planejar o futuro e aprender sobre dinheiro em contexto.",
        tags: ["Discovery de produto", "Educação financeira", "Design Systems"],
        href: "/cases/intuit",
        imageSrc: "/images/intuit.png",
      },
      {
        number: "05",
        title: "ASTER",
        summary: "Explorando IA como colaboradora clínica em consultas de alto risco.",
        description:
          "Um estudo de caso protegido por senha sobre confiança, limites de atuação e responsabilidade compartilhada entre médicos e uma IA colaboradora clínica.",
        tags: ["Interação com IA", "Saúde", "Confiança e segurança"],
        href: "/cases/aster",
        imageSrc: "/images/aster/aster-cover.png",
        imageAlt: "Dispositivo vestível do ASTER ao lado do workspace de consulta aberto num laptop.",
        locked: true,
        maxWidth: 600,
      },
    ],
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
    cases: [
      {
        number: "01",
        title: "Cure Intelligence / SCRIOO",
        summary: "AI-powered supply chain risk intelligence platform.",
        description:
          "Redesign of a data-heavy platform to help users understand risk signals, suppliers, filters, dashboards, and operational decisions.",
        tags: ["Complex systems", "AI", "Data-heavy UX", "Enterprise"],
        href: "/en/cases/cure",
        imageSrc: "/images/cure.png",
      },
      {
        number: "02",
        title: "HP Subscription Onboarding",
        summary: "Guided setup for a printer-inclusive subscription model.",
        description:
          "Helping turn a printer-inclusive subscription model into a clearer setup and account experience, through UX/UI, design system application, and handoff for implementation.",
        tags: ["Subscription UX", "Connected products", "Hardware service"],
        href: "/en/cases/hp",
        imageSrc: "/images/hp.png",
      },
      {
        number: "03",
        title: "Theodoor",
        summary: "Accessible app for smart door automation.",
        description:
          "Designing an accessible mobile experience with multimodal feedback, real constraints, edge cases, and AI-assisted behavioral prototyping.",
        tags: ["Accessibility", "Mobile", "Physical-digital UX"],
        href: "/en/cases/theodoor",
        imageSrc: "/images/theodoor.png",
      },
      {
        number: "04",
        title: "Intuit for Education",
        summary: "Financial education experience for students.",
        description:
          "Helping students track the present, plan the future, and learn about money in context, through a mobile product with rich visual language and a design system I helped build from the ground up.",
        tags: ["Product Discovery", "Financial education", "Design Systems"],
        href: "/en/cases/intuit",
        imageSrc: "/images/intuit.png",
      },
      {
        number: "05",
        title: "ASTER",
        summary: "Exploring AI as a clinical collaborator in high-risk consultations.",
        description:
          "A password-protected case study about trust, interaction boundaries, and shared accountability between physicians and a clinical AI collaborator.",
        tags: ["AI interaction", "Healthcare", "Trust and safety"],
        href: "/en/cases/aster",
        imageSrc: "/images/aster/aster-cover.png",
        imageAlt: "The ASTER wearable device next to the consultation workspace open on a laptop.",
        locked: true,
        maxWidth: 600,
      },
    ],
  },
};

export function HomeContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const otherLocaleHref = locale === "pt" ? "/en" : "/";

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
                <Button variant="secondary" context="dark" href={RESUME_HREF[locale]}>
                  {t.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className={styles.workSection}>
          <h2>{t.workHeading}</h2>
          <div className={styles.workGrid}>
            {t.cases.map((c) => (
              <CaseCardLarge key={c.number} imageAlt={c.title} locale={locale} {...c} />
            ))}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
