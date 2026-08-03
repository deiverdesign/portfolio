import Link from "next/link";
import { NavBar } from "@/components/NavBar/NavBar";
import { Tag } from "@/components/Tag/Tag";
import { Footer } from "@/components/Footer/Footer";
import styles from "./page.module.css";

interface RelatedWork {
  title: string;
  summary: string;
  href: string;
}

const cure: RelatedWork = {
  title: "Cure Intelligence / SCRIOO",
  summary: "Plataforma de inteligência de riscos em supply chain com IA.",
  href: "/cases/cure",
};
const hp: RelatedWork = {
  title: "HP Subscription Onboarding",
  summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
  href: "/cases/hp",
};
const theodoor: RelatedWork = {
  title: "Theodoor",
  summary: "App acessível para automação de portas inteligentes.",
  href: "/cases/theodoor",
};

const capabilities = [
  {
    number: "01",
    title: "Sistemas complexos",
    tags: ["Sistemas complexos", "UX enterprise", "Usuários operacionais"],
    description:
      "Minha prática principal é dar sentido à complexidade — não simplificá-la artificialmente, mas criar interfaces e sistemas em que lógicas densas se tornam utilizáveis. Trabalho com fluxos ponta a ponta, componentes com múltiplos estados, workflows operacionais e contextos em que a própria lógica do produto faz parte do desafio de design.",
    relatedWork: [cure, hp],
  },
  {
    number: "02",
    title: "Design Systems",
    tags: ["Design Systems", "Plataforma web"],
    description:
      "Design systems são um meio para um fim: coerência de produto em escala. Já trabalhei dentro de sistemas enterprise estabelecidos e ajudei a criar sistemas do zero, escrevendo documentação de componentes, definindo estruturas de tokens, colaborando com engenharia na implementação e construindo a camada de governança que mantém o sistema vivo.",
    relatedWork: [cure, hp],
  },
  {
    number: "03",
    title: "Prototipação assistida por IA",
    tags: ["IA", "Prototipação"],
    description:
      "Uso ferramentas de IA não como atalho, mas como parceiras de raciocínio para simular edge cases, gerar conteúdo realista de teste, prototipar rapidamente lógica de interação e explorar variações de comportamento que levariam semanas para construir manualmente. Isso acelera o trabalho sem substituir o julgamento de design.",
    relatedWork: [cure, theodoor],
  },
  {
    number: "04",
    title: "Acessibilidade e UX inclusiva",
    tags: ["Acessibilidade", "UX inclusiva", "Mobile"],
    description:
      "Acessibilidade não é uma checklist. Eu desenho para pessoas reais usando tecnologias assistivas, trabalhando em ambientes com restrições ou enfrentando situações em que a interface precisa trabalhar mais. Isso inclui sistemas de feedback multimodal, navegação por toque e teclado, conformidade com WCAG e edge cases que importam mais para as pessoas com maior risco de exclusão.",
    relatedWork: [theodoor],
  },
  {
    number: "05",
    title: "Motion e interação",
    tags: ["Motion / Interação", "Design de interação"],
    description:
      "Motion em product design serve à comunicação. Uso transições, estados de feedback e animações para sinalizar o que o sistema está fazendo, confirmar ações do usuário e reduzir carga cognitiva — não para adicionar enfeite visual. O detalhe certo de interação pode eliminar um tooltip ou uma mensagem de erro inteira.",
    relatedWork: [theodoor],
  },
  {
    number: "06",
    title: "UX denso em dados",
    tags: ["UX denso em dados", "Enterprise", "Sistemas complexos"],
    description:
      "Alguns contextos de produto exigem densidade. Dashboards, tabelas de supply chain, linhas do tempo de processos jurídicos e matrizes de risco não são interfaces que podem ser reduzidas a três cards limpos. O desafio de design é tornar a densidade utilizável: hierarquia, progressive disclosure, filtros e comunicação clara de estados.",
    relatedWork: [cure, hp],
  },
  {
    number: "07",
    title: "Documentação e handoff",
    tags: ["Design Systems", "Fluxos complexos"],
    description:
      "Design não termina no mockup. Escrevo especificações de edge cases, anoto comportamentos de interação, documento estados de componentes e crio artefatos de handoff que permitem que engenharia construa sem adivinhar. Essa prática reduz idas e vindas, diminui risco de implementação e cria um vocabulário compartilhado entre design e engenharia.",
    relatedWork: [cure, hp],
  },
];

export default function CompetenciasPage() {
  return (
    <>
      <NavBar context="light" />

      <main>
        <section className={styles.header}>
          <span className={styles.eyebrow}>COMPETÊNCIAS</span>
          <h1 className={styles.title}>Competências</h1>
          <p className={styles.intro}>
            Projetos diferentes mostram partes diferentes da minha prática — de sistemas
            complexos e design systems a prototipação assistida por IA, acessibilidade, UX denso
            em dados e design de interação.
          </p>
        </section>

        <div className={styles.rows}>
          {capabilities.map((cap) => (
            <div className={styles.row} key={cap.number}>
              <div className={styles.rowLabel}>
                <span className={styles.number}>{cap.number}</span>
                <h2>{cap.title}</h2>
                <div className={styles.tagRow}>
                  {cap.tags.map((tag) => (
                    <Tag key={tag} context="light">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className={styles.rowContent}>
                <p>{cap.description}</p>

                <span className={styles.relatedEyebrow}>TRABALHOS RELACIONADOS</span>
                <div className={styles.relatedGrid}>
                  {cap.relatedWork.map((work) => (
                    <Link className={styles.relatedCard} href={work.href} key={work.title}>
                      <span className={styles.relatedTitle}>{work.title}</span>
                      <span className={styles.relatedSummary}>{work.summary}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
