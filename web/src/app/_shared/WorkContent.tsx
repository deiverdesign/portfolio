import { NavBar } from "@/components/NavBar/NavBar";
import type { Locale } from "@/components/NavBar/constants";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { Tag } from "@/components/Tag/Tag";
import { Footer } from "@/components/Footer/Footer";
import { buildCasesCopy } from "./HomeContent";
import homeStyles from "./home.module.css";
import styles from "./work.module.css";

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  additionalExperience: {
    eyebrow: string;
    title: string;
    description: string;
    tags: string[];
    badge: string;
  };
}> = {
  en: {
    eyebrow: "WORK",
    title: "Selected work",
    intro:
      "A focused selection of product design work across complex platforms, service UX, accessibility, AI-assisted prototyping, and product discovery.",
    additionalExperience: {
      eyebrow: "ADDITIONAL EXPERIENCE",
      title: "Enterprise Legal Tech / Softplan",
      description:
        "Product design experience across complex legal flows, judicial and institutional systems, legacy products, operational users, research repositories, and design system governance. Public case study not shown due to confidentiality.",
      tags: [
        "Enterprise UX",
        "Legal Tech",
        "Legacy Systems",
        "Operational Users",
        "Design Systems",
        "Complex flows",
      ],
      badge: "Mentioned in resume",
    },
  },
  pt: {
    eyebrow: "TRABALHO",
    title: "Trabalhos selecionados",
    intro:
      "Uma seleção focada de trabalhos em product design envolvendo plataformas complexas, UX de serviços, acessibilidade, prototipação assistida por IA e discovery de produto.",
    additionalExperience: {
      eyebrow: "EXPERIÊNCIA ADICIONAL",
      title: "Enterprise Legal Tech / Softplan",
      description:
        "Experiência em product design em fluxos jurídicos complexos, sistemas judiciais e institucionais, produtos legados, usuários operacionais, repositórios de pesquisa e governança de design system. Case público não mostrado por confidencialidade.",
      tags: [
        "UX enterprise",
        "Legal Tech",
        "Sistemas legados",
        "Usuários operacionais",
        "Design Systems",
        "Fluxos complexos",
      ],
      badge: "Mencionado no currículo",
    },
  },
};

export function WorkContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const otherLocaleHref = locale === "pt" ? "/work" : "/pt/work";
  const cases = buildCasesCopy(locale);

  return (
    <>
      <NavBar context="light" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main>
        <section className={styles.header}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.intro}>{t.intro}</p>
        </section>

        <section className={homeStyles.workSection}>
          <div className={homeStyles.workGrid}>
            {cases.map((c) => (
              <CaseCardLarge key={c.number} imageAlt={c.title} locale={locale} {...c} />
            ))}
          </div>
        </section>

        <section className={homeStyles.workSection}>
          <span className={homeStyles.sectionEyebrow}>{t.additionalExperience.eyebrow}</span>
          <div className={homeStyles.additionalCard}>
            <h3 className={homeStyles.additionalTitle}>{t.additionalExperience.title}</h3>
            <p className={homeStyles.additionalDescription}>{t.additionalExperience.description}</p>
            <div className={homeStyles.additionalTagRow}>
              {t.additionalExperience.tags.map((tag) => (
                <Tag key={tag} context="light">
                  {tag}
                </Tag>
              ))}
            </div>
            <span className={homeStyles.additionalBadge}>{t.additionalExperience.badge}</span>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
