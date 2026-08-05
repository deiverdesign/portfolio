import Link from "next/link";
import { NavBar, type Locale } from "@/components/NavBar/NavBar";
import { Tag } from "@/components/Tag/Tag";
import { Footer } from "@/components/Footer/Footer";
import styles from "../(pt)/competencias/page.module.css";

interface RelatedWork {
  title: string;
  summary: string;
  href: string;
}

export interface Capability {
  number: string;
  title: string;
  tags: string[];
  description: string;
  relatedWork: RelatedWork[];
}

interface CapabilitiesCopy {
  eyebrow: string;
  title: string;
  intro: string;
  relatedEyebrow: string;
  capabilities: Capability[];
}

export function buildCapabilitiesCopy(locale: Locale): CapabilitiesCopy {
  const prefix = locale === "pt" ? "/cases" : "/en/cases";

  const cure: RelatedWork =
    locale === "pt"
      ? {
          title: "Cure Intelligence / SCRIOO",
          summary: "Plataforma de inteligência de riscos em supply chain com IA.",
          href: `${prefix}/cure`,
        }
      : {
          title: "Cure Intelligence / SCRIOO",
          summary: "AI-powered supply chain risk intelligence platform.",
          href: `${prefix}/cure`,
        };

  const hp: RelatedWork =
    locale === "pt"
      ? {
          title: "HP Subscription Onboarding",
          summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
          href: `${prefix}/hp`,
        }
      : {
          title: "HP Subscription Onboarding",
          summary: "Guided setup for a printer-inclusive subscription model.",
          href: `${prefix}/hp`,
        };

  const theodoor: RelatedWork =
    locale === "pt"
      ? {
          title: "Theodoor",
          summary: "App acessível para automação de portas inteligentes.",
          href: `${prefix}/theodoor`,
        }
      : {
          title: "Theodoor",
          summary: "Accessible app for smart door automation.",
          href: `${prefix}/theodoor`,
        };

  const intuit: RelatedWork =
    locale === "pt"
      ? {
          title: "Intuit for Education",
          summary: "Experiência de educação financeira para estudantes.",
          href: `${prefix}/intuit`,
        }
      : {
          title: "Intuit for Education",
          summary: "Financial education experience for students.",
          href: `${prefix}/intuit`,
        };

  const aster: RelatedWork =
    locale === "pt"
      ? {
          title: "ASTER",
          summary: "Explorando IA como colaboradora clínica em consultas de alto risco.",
          href: `${prefix}/aster`,
        }
      : {
          title: "ASTER",
          summary: "Exploring AI as a clinical collaborator in high-risk consultations.",
          href: `${prefix}/aster`,
        };

  if (locale === "en") {
    return {
      eyebrow: "CAPABILITIES",
      title: "Capabilities",
      intro:
        "Different projects show different parts of my practice — from complex systems and design systems to AI-assisted prototyping, accessibility, data-heavy UX, and interaction design.",
      relatedEyebrow: "RELATED WORK",
      capabilities: [
        {
          number: "01",
          title: "Complex systems",
          tags: ["Complex systems", "Enterprise UX", "Operational users"],
          description:
            "My core practice is making sense of complexity — not flattening it artificially, but creating interfaces and systems where dense logic becomes usable. I work with end-to-end flows, multi-state components, operational workflows, and contexts where the product logic itself is part of the design challenge.",
          relatedWork: [cure, hp, aster],
        },
        {
          number: "02",
          title: "Research and discovery",
          tags: ["Discovery", "User research", "Usability testing"],
          description:
            "Before I design the solution, I need to understand the problem. I run user interviews, discovery workshops with the client, and usability tests to validate hypotheses before committing weeks of UI work. I use low-fidelity wireframes not as a deliverable, but as a conversation tool — to align business rules with the client before they turn into code.",
          relatedWork: [intuit, cure],
        },
        {
          number: "03",
          title: "Design Systems",
          tags: ["Design Systems", "Web platform"],
          description:
            "Design systems are a means to an end: product coherence at scale. I've worked inside established enterprise systems and helped build systems from scratch — writing component documentation, defining token structures, collaborating with engineering on implementation, and building the governance layer that keeps the system alive.",
          relatedWork: [cure, hp, intuit],
        },
        {
          number: "04",
          title: "AI-assisted prototyping",
          tags: ["AI", "Prototyping"],
          description:
            "I use AI tools not as a shortcut, but as thinking partners in my workflow — to simulate edge cases, generate realistic test content, rapidly prototype interaction logic, and explore behavior variations that would take weeks to build manually. This accelerates the work without replacing design judgment; here AI serves my process, not the product itself.",
          relatedWork: [cure, theodoor],
        },
        {
          number: "05",
          title: "Designing for AI systems",
          tags: ["AI", "Trust and error", "Human decision"],
          description:
            "AI systems fail, and design has to deal with that, not hide it. I design interfaces that communicate a prediction's confidence level, make model error visible and recoverable, and make clear where the final decision still belongs to a person. Here AI isn't a tool in my process — it's the system I'm designing.",
          relatedWork: [aster, cure],
        },
        {
          number: "06",
          title: "Accessibility and inclusive UX",
          tags: ["Accessibility", "Inclusive UX", "Mobile"],
          description:
            "Accessibility is not a checklist. I design for real people using assistive technology, working in constrained environments, or facing situations where the interface needs to work harder. This includes multimodal feedback systems, touch and keyboard navigation, WCAG compliance, and edge cases that matter most to people at the highest risk of exclusion.",
          relatedWork: [theodoor],
        },
        {
          number: "07",
          title: "Motion and interaction",
          tags: ["Motion / Interaction", "Interaction design"],
          description:
            "Motion in product design serves communication. I use transitions, feedback states, and animations to signal what the system is doing, confirm user actions, and reduce cognitive load — not to add visual decoration. The right interaction detail can eliminate an entire tooltip or error message.",
          relatedWork: [theodoor],
        },
        {
          number: "08",
          title: "Data-heavy UX",
          tags: ["Data-heavy UX", "Enterprise", "Complex systems"],
          description:
            "Some product contexts demand density. Dashboards, supply-chain tables, legal-process timelines, and risk matrices are not interfaces that can be reduced to three clean cards. The design challenge is making density usable: hierarchy, progressive disclosure, filters, and clear state communication.",
          relatedWork: [cure, hp],
        },
        {
          number: "09",
          title: "Documentation and handoff",
          tags: ["Design Systems", "Complex flows"],
          description:
            "Design doesn't end at the mockup. I write edge-case specifications, annotate interaction behaviors, document component states, and create handoff artifacts that let engineering build without guessing. This practice reduces back-and-forth, lowers implementation risk, and creates a shared vocabulary between design and engineering.",
          relatedWork: [cure, hp],
        },
      ],
    };
  }

  return {
    eyebrow: "COMPETÊNCIAS",
    title: "Competências",
    intro:
      "Projetos diferentes mostram partes diferentes da minha prática — de sistemas complexos e design systems a prototipação assistida por IA, acessibilidade, UX denso em dados e design de interação.",
    relatedEyebrow: "TRABALHOS RELACIONADOS",
    capabilities: [
      {
        number: "01",
        title: "Sistemas complexos",
        tags: ["Sistemas complexos", "UX enterprise", "Usuários operacionais"],
        description:
          "Minha prática principal é dar sentido à complexidade — não simplificá-la artificialmente, mas criar interfaces e sistemas em que lógicas densas se tornam utilizáveis. Trabalho com fluxos ponta a ponta, componentes com múltiplos estados, workflows operacionais e contextos em que a própria lógica do produto faz parte do desafio de design.",
        relatedWork: [cure, hp, aster],
      },
      {
        number: "02",
        title: "Pesquisa e discovery",
        tags: ["Pesquisa", "Discovery", "Testes de usabilidade"],
        description:
          "Antes de desenhar a solução, preciso entender o problema. Conduzo entrevistas com usuários, workshops de discovery com o cliente e testes de usabilidade para validar hipóteses antes de comprometer semanas de trabalho de UI. Uso wireframes de baixa fidelidade não como entregável, mas como ferramenta de conversa — para alinhar regras de negócio com o cliente antes que virem código.",
        relatedWork: [intuit, cure],
      },
      {
        number: "03",
        title: "Design Systems",
        tags: ["Design Systems", "Plataforma web"],
        description:
          "Design systems são um meio para um fim: coerência de produto em escala. Já trabalhei dentro de sistemas enterprise estabelecidos e ajudei a criar sistemas do zero, escrevendo documentação de componentes, definindo estruturas de tokens, colaborando com engenharia na implementação e construindo a camada de governança que mantém o sistema vivo.",
        relatedWork: [cure, hp, intuit],
      },
      {
        number: "04",
        title: "Prototipação assistida por IA",
        tags: ["IA", "Prototipação"],
        description:
          "Uso ferramentas de IA não como atalho, mas como parceiras de raciocínio no meu processo de trabalho — para simular edge cases, gerar conteúdo realista de teste, prototipar rapidamente lógica de interação e explorar variações de comportamento que levariam semanas para construir manualmente. Isso acelera o trabalho sem substituir o julgamento de design; aqui a IA está a serviço do meu processo, não do produto final.",
        relatedWork: [cure, theodoor],
      },
      {
        number: "05",
        title: "Design para sistemas de IA",
        tags: ["IA", "Confiança e erro", "Decisão humana"],
        description:
          "Sistemas de IA erram, e o design precisa lidar com isso, não escondê-lo. Desenho interfaces que comunicam o nível de confiança de uma previsão, tornam o erro do modelo visível e recuperável, e deixam claro onde a decisão final continua sendo de uma pessoa. Aqui a IA não é uma ferramenta do meu processo — é o próprio sistema que estou desenhando.",
        relatedWork: [aster, cure],
      },
      {
        number: "06",
        title: "Acessibilidade e UX inclusiva",
        tags: ["Acessibilidade", "UX inclusiva", "Mobile"],
        description:
          "Acessibilidade não é uma checklist. Eu desenho para pessoas reais usando tecnologias assistivas, trabalhando em ambientes com restrições ou enfrentando situações em que a interface precisa trabalhar mais. Isso inclui sistemas de feedback multimodal, navegação por toque e teclado, conformidade com WCAG e edge cases que importam mais para as pessoas com maior risco de exclusão.",
        relatedWork: [theodoor],
      },
      {
        number: "07",
        title: "Motion e interação",
        tags: ["Motion / Interação", "Design de interação"],
        description:
          "Motion em product design serve à comunicação. Uso transições, estados de feedback e animações para sinalizar o que o sistema está fazendo, confirmar ações do usuário e reduzir carga cognitiva — não para adicionar enfeite visual. O detalhe certo de interação pode eliminar um tooltip ou uma mensagem de erro inteira.",
        relatedWork: [theodoor],
      },
      {
        number: "08",
        title: "UX denso em dados",
        tags: ["UX denso em dados", "Enterprise", "Sistemas complexos"],
        description:
          "Alguns contextos de produto exigem densidade. Dashboards, tabelas de supply chain, linhas do tempo de processos jurídicos e matrizes de risco não são interfaces que podem ser reduzidas a três cards limpos. O desafio de design é tornar a densidade utilizável: hierarquia, progressive disclosure, filtros e comunicação clara de estados.",
        relatedWork: [cure, hp],
      },
      {
        number: "09",
        title: "Documentação e handoff",
        tags: ["Design Systems", "Fluxos complexos"],
        description:
          "Design não termina no mockup. Escrevo especificações de edge cases, anoto comportamentos de interação, documento estados de componentes e crio artefatos de handoff que permitem que engenharia construa sem adivinhar. Essa prática reduz idas e vindas, diminui risco de implementação e cria um vocabulário compartilhado entre design e engenharia.",
        relatedWork: [cure, hp],
      },
    ],
  };
}

export function CapabilitiesContent({ locale }: { locale: Locale }) {
  const t = buildCapabilitiesCopy(locale);
  const otherLocaleHref = locale === "pt" ? "/en/capabilities" : "/competencias";

  return (
    <>
      <NavBar context="light" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main>
        <section className={styles.header}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.intro}>{t.intro}</p>
        </section>

        <div className={styles.rows}>
          {t.capabilities.map((cap) => (
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

                <span className={styles.relatedEyebrow}>{t.relatedEyebrow}</span>
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

      <Footer locale={locale} />
    </>
  );
}
