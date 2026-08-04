import { NavBar, RESUME_HREF, type Locale } from "@/components/NavBar/NavBar";
import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import styles from "../(pt)/sobre/page.module.css";

type Row =
  | { number: string; title: string; paragraphs: string[]; values?: undefined }
  | { number: string; title: string; paragraphs?: undefined; values: { title: string; description: string }[] };

interface AboutCopy {
  eyebrowAbout: string;
  photoAlt: string;
  name: string;
  bioParagraphs: string[];
  locationLine: string;
  rows: Row[];
  eyebrowContact: string;
  contactTitle: string;
  contactBody: string[];
  contactEmailLabel: string;
  sendEmail: string;
  viewLinkedIn: string;
  downloadResume: string;
}

const COPY: Record<Locale, AboutCopy> = {
  pt: {
    eyebrowAbout: "SOBRE",
    photoAlt: "Foto de Deiver Brito",
    name: "Deiver Brito",
    bioParagraphs: [
      "Sou Product Designer Sênior no Brasil, com experiência em produtos enterprise, legal tech, acessibilidade, plataformas com IA, assinaturas e design systems. Meu melhor trabalho acontece onde complexidade de produto, restrições técnicas e necessidades de usuários se encontram.",
      "Minha experiência inclui produtos enterprise, legal tech, design systems, acessibilidade, plataformas com IA, experiências de assinatura e apps mobile. Valorizo lógica de produto clara, fundamentos fortes de interação, documentação, colaboração com engenharia e pequenas decisões que tornam sistemas complexos mais coerentes.",
    ],
    locationLine: "Brasil · Remoto disponível",
    rows: [
      {
        number: "01",
        title: "Como eu penso",
        paragraphs: [
          "Eu abordo problemas de design primeiro como problemas de sistema. Antes de tocar em uma tela, quero entender o modelo de dados, os tipos de usuário, os edge cases e os pontos em que a lógica do produto está pouco clara ou inconsistente.",
          "A maioria dos problemas difíceis de interface é sintoma de raciocínio de produto pouco claro. Meu trabalho é tornar o sistema visível e depois torná-lo utilizável — nessa ordem. Eu evito soluções estéticas para problemas estruturais.",
        ],
      },
      {
        number: "02",
        title: "Como trabalho com times",
        paragraphs: [
          "Trabalho próximo de PMs e engenheiros desde o início — não como alguém que só entra no handoff, mas como co-pensador. Levo design para conversas sobre lógica de produto, restrições de dados e viabilidade técnica antes que essas decisões estejam fechadas.",
          "Documento decisões com cuidado, anoto edge cases e escrevo especificações que engenheiros conseguem implementar sem adivinhar. Eu me importo em reduzir ambiguidade em todas as etapas — não só na interface, mas no próprio processo de trabalho.",
        ],
      },
      {
        number: "03",
        title: "O que valorizo em product design",
        values: [
          {
            title: "Clareza estrutural",
            description:
              "Interfaces que comunicam o comportamento do sistema sem depender de documentação para explicá-las.",
          },
          {
            title: "Pronto para implementação",
            description:
              "Designs que podem ser construídos como especificados, sem dívida de interpretação adicionada por engenharia.",
          },
          {
            title: "Cobertura de edge cases",
            description:
              "Estados que consideram o que acontece quando algo dá errado, está ausente ou se comporta de forma inesperada.",
          },
          {
            title: "Padrões escaláveis",
            description:
              "Lógica de componentes que resolve uma classe de problemas, não apenas uma tela ou um momento.",
          },
          {
            title: "Complexidade honesta",
            description:
              "Não esconder o que é difícil — tornar isso navegável. Alguns produtos não podem e não devem ser simplificados.",
          },
        ],
      },
    ],
    eyebrowContact: "CONTATO",
    contactTitle: "Vamos conversar sobre um projeto.",
    contactBody: [
      "Disponível para vagas remotas de Product Designer Sênior e trabalhos em produtos complexos.",
      "Normalmente respondo em até 24 horas.",
    ],
    contactEmailLabel: "deiverbrito@gmail.com",
    sendEmail: "Enviar e-mail",
    viewLinkedIn: "Ver LinkedIn",
    downloadResume: "Baixar currículo",
  },
  en: {
    eyebrowAbout: "ABOUT",
    photoAlt: "Photo of Deiver Brito",
    name: "Deiver Brito",
    bioParagraphs: [
      "I'm a Senior Product Designer based in Brazil, with experience in enterprise products, legal tech, accessibility, AI platforms, subscriptions, and design systems. My best work happens where product complexity, technical constraints, and user needs meet.",
      "My background includes enterprise products, legal tech, design systems, accessibility, AI platforms, subscription experiences, and mobile apps. I value clear product logic, strong interaction fundamentals, documentation, engineering collaboration, and the small decisions that make complex systems more coherent.",
    ],
    locationLine: "Brazil · Remote available",
    rows: [
      {
        number: "01",
        title: "How I think",
        paragraphs: [
          "I approach design problems as system problems first. Before touching a screen, I want to understand the data model, user types, edge cases, and the points where product logic is unclear or inconsistent.",
          "Most hard interface problems are symptoms of unclear product thinking. My work is to make the system visible and then make it usable — in that order. I avoid aesthetic solutions to structural problems.",
        ],
      },
      {
        number: "02",
        title: "How I work with teams",
        paragraphs: [
          "I work closely with PMs and engineers from the start — not as someone who only shows up at handoff, but as a co-thinker. I bring design into conversations about product logic, data constraints, and technical feasibility before those decisions are closed.",
          "I document decisions carefully, annotate edge cases, and write specifications that engineers can implement without guessing. I care about reducing ambiguity at every step — not just in the interface, but in the work process itself.",
        ],
      },
      {
        number: "03",
        title: "What I value in product design",
        values: [
          {
            title: "Structural clarity",
            description:
              "Interfaces that communicate system behavior without relying on documentation to explain them.",
          },
          {
            title: "Implementation-ready",
            description:
              "Designs that can be built as specified, without interpretation debt added by engineering.",
          },
          {
            title: "Edge case coverage",
            description:
              "States that account for what happens when something goes wrong, is missing, or behaves unexpectedly.",
          },
          {
            title: "Scalable patterns",
            description: "Component logic that solves a class of problems, not just one screen or one moment.",
          },
          {
            title: "Honest complexity",
            description:
              "Not hiding what's hard — making it navigable. Some products can't and shouldn't be simplified.",
          },
        ],
      },
    ],
    eyebrowContact: "CONTACT",
    contactTitle: "Let's talk about a project.",
    contactBody: [
      "Available for remote Senior Product Designer roles and work on complex products.",
      "I usually reply within 24 hours.",
    ],
    contactEmailLabel: "deiverbrito@gmail.com",
    sendEmail: "Send email",
    viewLinkedIn: "View LinkedIn",
    downloadResume: "Download resume",
  },
};

export function AboutContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const otherLocaleHref = locale === "pt" ? "/en/about" : "/sobre";
  const contactId = locale === "pt" ? "contato" : "contact";

  return (
    <>
      <NavBar context="light" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main>
        <section className={styles.aboutSection}>
          <span className={styles.eyebrow}>{t.eyebrowAbout}</span>

          <div className={styles.aboutIntro}>
            <div className={styles.aboutText}>
              <h1 className={styles.aboutName}>{t.name}</h1>
              {t.bioParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <figure className={styles.aboutPhotoBlock}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-photo.png" alt={t.photoAlt} className={styles.aboutPhoto} />
              <figcaption className={styles.aboutCaption}>
                <span>{t.locationLine}</span>
                <span>{t.contactEmailLabel}</span>
              </figcaption>
            </figure>
          </div>

          <div className={styles.rows}>
            {t.rows.map((row) => (
              <div className={styles.row} key={row.number}>
                <div className={styles.rowLabel}>
                  <span className={styles.number}>{row.number}</span>
                  <h2>{row.title}</h2>
                </div>

                <div className={styles.rowContent}>
                  {row.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {row.values && (
                    <ul className={styles.valueList}>
                      {row.values.map((v) => (
                        <li className={styles.valueItem} key={v.title}>
                          <span className={styles.valueBullet} aria-hidden="true" />
                          <div>
                            <h3>{v.title}</h3>
                            <p>{v.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id={contactId} className={styles.contactSection}>
          <span className={styles.eyebrow}>{t.eyebrowContact}</span>
          <h2 className={styles.contactTitle}>{t.contactTitle}</h2>
          {t.contactBody.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.contactEmail}>{t.contactEmailLabel}</p>

          <div className={styles.contactActions}>
            <Button variant="primary" context="light" icon="arrow-right" href="mailto:deiverbrito@gmail.com">
              {t.sendEmail}
            </Button>
            <Button
              variant="secondary"
              context="light"
              icon="external-link"
              href="https://linkedin.com/in/deiverbrito"
            >
              {t.viewLinkedIn}
            </Button>
            <Button variant="secondary" context="light" icon="download" href={RESUME_HREF[locale]}>
              {t.downloadResume}
            </Button>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
