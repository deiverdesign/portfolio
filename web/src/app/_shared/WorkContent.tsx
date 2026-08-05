import { NavBar } from "@/components/NavBar/NavBar";
import type { Locale } from "@/components/NavBar/constants";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { Footer } from "@/components/Footer/Footer";
import { buildCasesCopy } from "./HomeContent";
import homeStyles from "./home.module.css";
import styles from "./work.module.css";

const COPY: Record<Locale, { eyebrow: string; title: string; intro: string }> = {
  en: {
    eyebrow: "WORK",
    title: "Selected work",
    intro:
      "A focused selection of product design work across complex platforms, service UX, accessibility, AI-assisted prototyping, and product discovery.",
  },
  pt: {
    eyebrow: "TRABALHO",
    title: "Trabalhos selecionados",
    intro:
      "Uma seleção focada de trabalhos em product design envolvendo plataformas complexas, UX de serviços, acessibilidade, prototipação assistida por IA e discovery de produto.",
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
      </main>

      <Footer locale={locale} />
    </>
  );
}
