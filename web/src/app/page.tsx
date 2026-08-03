import { NavBar } from "@/components/NavBar/NavBar";
import { Button } from "@/components/Button/Button";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { Footer } from "@/components/Footer/Footer";
import styles from "./home.module.css";

const cases = [
  {
    number: "01",
    title: "Cure Intelligence / SCRIOO",
    summary: "Plataforma de inteligência de riscos em supply chain com IA.",
    description:
      "Redesign de uma plataforma densa em dados para ajudar usuários a entender sinais de risco, fornecedores, filtros, dashboards e decisões operacionais.",
    tags: ["Sistemas complexos", "UX denso em dados", "IA", "Dashboards"],
    href: "/cure-intelligence.html",
    imageSrc: "/images/cure.png",
  },
  {
    number: "02",
    title: "HP Subscription Onboarding",
    summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
    description:
      "Ajudando a transformar um modelo de assinatura incluída em uma experiência mais clara de configuração e conta.",
    tags: ["UX de assinatura", "Produtos conectados", "Serviço com hardware"],
    href: "/hp-subscription.html",
    imageSrc: "/images/hp.png",
  },
  {
    number: "03",
    title: "Theodoor",
    summary: "App acessível para automação de portas inteligentes.",
    description:
      "Design de uma experiência mobile acessível com feedback multimodal, restrições reais e edge cases.",
    tags: ["Acessibilidade", "Mobile", "UX físico-digital"],
    href: "/theodoor.html",
    imageSrc: "/images/theodoor.png",
  },
  {
    number: "04",
    title: "Intuit for Education",
    summary: "Experiência de educação financeira para estudantes.",
    description:
      "Ajudando estudantes a acompanhar o presente, planejar o futuro e aprender sobre dinheiro em contexto.",
    tags: ["Discovery de produto", "Educação financeira", "Design Systems"],
    href: "/intuit-for-education.html",
    imageSrc: "/images/intuit.png",
    // é o card que sobra sozinho na última linha — mesmo tratamento do Figma:
    // um teto de largura pra não esticar até o fim da linha quando fica sozinho.
    maxWidth: 600,
  },
];

const aboutRows: Array<
  | { number: string; title: string; paragraphs: string[]; values?: undefined }
  | {
      number: string;
      title: string;
      paragraphs?: undefined;
      values: { title: string; description: string }[];
    }
> = [
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
];

export default function Home() {
  return (
    <>
      <NavBar context="dark" />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroVisual}>
              <div className={styles.glowTeal} />
              <div className={styles.glowOrange} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-photo.png"
                alt="Foto de Deiver Brito"
                className={styles.heroPhoto}
              />
            </div>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>PRODUCT DESIGNER SÊNIOR · FLORIPA · BRASIL</span>
              <h1 className={styles.heroTitle}>Design para simplificar produtos complexos.</h1>
              <p className={styles.heroIntro}>
                Ajudo times a transformar ambiguidade, restrições técnicas e jornadas fragmentadas em
                lógica de produto clara, interfaces escaláveis e experiências construíveis.
              </p>
              <div className={styles.heroActions}>
                <Button variant="primary" context="dark">
                  Ver trabalhos selecionados
                </Button>
                <Button variant="secondary" context="dark">
                  Baixar currículo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.workSection}>
          <h2>Trabalho</h2>
          <div className={styles.workGrid}>
            {cases.map((c) => (
              <CaseCardLarge key={c.number} imageAlt={c.title} {...c} />
            ))}
          </div>
        </section>

        <section id="sobre" className={styles.aboutSection}>
          <span className={styles.sectionEyebrow}>SOBRE</span>

          <div className={styles.aboutIntro}>
            <div className={styles.aboutText}>
              <h2 className={styles.aboutName}>Deiver Brito</h2>
              <p>
                Sou Product Designer Sênior no Brasil, com experiência em produtos enterprise,
                legal tech, acessibilidade, plataformas com IA, assinaturas e design systems. Meu
                melhor trabalho acontece onde complexidade de produto, restrições técnicas e
                necessidades de usuários se encontram.
              </p>
              <p>
                Minha experiência inclui produtos enterprise, legal tech, design systems,
                acessibilidade, plataformas com IA, experiências de assinatura e apps mobile.
                Valorizo lógica de produto clara, fundamentos fortes de interação, documentação,
                colaboração com engenharia e pequenas decisões que tornam sistemas complexos mais
                coerentes.
              </p>
            </div>

            <figure className={styles.aboutPhotoBlock}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about-photo.png"
                alt="Foto de Deiver Brito"
                className={styles.aboutPhoto}
              />
              <figcaption className={styles.aboutCaption}>
                <span>Brasil · Remoto disponível</span>
                <span>deiverbrito@gmail.com</span>
              </figcaption>
            </figure>
          </div>

          <div className={styles.aboutRows}>
            {aboutRows.map((row) => (
              <div className={styles.aboutRow} key={row.number}>
                <div className={styles.aboutRowLabel}>
                  <span className={styles.number}>{row.number}</span>
                  <h3>{row.title}</h3>
                </div>

                <div className={styles.aboutRowContent}>
                  {row.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {row.values && (
                    <div className={styles.valueGrid}>
                      {row.values.map((v) => (
                        <div className={styles.valueCard} key={v.title}>
                          <h4>{v.title}</h4>
                          <p>{v.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
