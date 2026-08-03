import { NavBar } from "@/components/NavBar/NavBar";
import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import styles from "./page.module.css";

const rows: Array<
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

export default function SobrePage() {
  return (
    <>
      <NavBar context="light" />

      <main>
        <section className={styles.aboutSection}>
          <span className={styles.eyebrow}>SOBRE</span>

          <div className={styles.aboutIntro}>
            <div className={styles.aboutText}>
              <h1 className={styles.aboutName}>Deiver Brito</h1>
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

          <div className={styles.rows}>
            {rows.map((row) => (
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

        <section id="contato" className={styles.contactSection}>
          <span className={styles.eyebrow}>CONTATO</span>
          <h2 className={styles.contactTitle}>Vamos conversar sobre um projeto.</h2>
          <p>
            Disponível para vagas remotas de Product Designer Sênior e trabalhos em produtos
            complexos.
          </p>
          <p>Normalmente respondo em até 24 horas.</p>
          <p className={styles.contactEmail}>deiverbrito@gmail.com</p>

          <div className={styles.contactActions}>
            <Button variant="primary" context="light" icon="arrow-right" href="mailto:deiverbrito@gmail.com">
              Enviar e-mail
            </Button>
            <Button
              variant="secondary"
              context="light"
              icon="external-link"
              href="https://linkedin.com/in/deiverbrito"
            >
              Ver LinkedIn
            </Button>
            <Button variant="secondary" context="light" icon="download" href="/curriculo.pdf">
              Baixar currículo
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
