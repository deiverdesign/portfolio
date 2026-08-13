import { NavBar, type Locale } from "@/components/NavBar/NavBar";
import { CapabilitySection, type CaseStudyTile, type OtherWorkTile } from "@/components/CapabilitySection/CapabilitySection";
import { Footer } from "@/components/Footer/Footer";
import styles from "./capabilities.module.css";

export interface Capability {
  number: string;
  title: string;
  tags: string[];
  description: string;
  caseStudies: CaseStudyTile[];
  otherWork: OtherWorkTile[];
}

interface CapabilitiesCopy {
  eyebrow: string;
  title: string;
  intro: string;
  caseStudiesLabel: string;
  otherWorkLabel: string;
  capabilities: Capability[];
}

/**
 * Os 8 tiles de projeto usados nas seções de capability — cada SVG já vem
 * com o fundo colorido da marca embutido (exportado do Figma pronto,
 * 112x75), então aqui só precisamos do caminho do arquivo.
 */
const LOGO: Record<string, string> = {
  cure: "/images/capabilities/cure.svg",
  hp: "/images/capabilities/hp.svg",
  theodoor: "/images/capabilities/theodoor.svg",
  intuit: "/images/capabilities/intuit.svg",
  aster: "/images/capabilities/aster.svg",
  cirrus: "/images/capabilities/cirrus.svg",
  softplan: "/images/capabilities/softplan.svg",
  lightship: "/images/capabilities/lightship.svg",
};

export function buildCapabilitiesCopy(locale: Locale): CapabilitiesCopy {
  const prefix = locale === "pt" ? "/pt/cases" : "/cases";
  const viewCase = locale === "pt" ? "Ver case" : "See case";

  const caseStudy = (key: keyof typeof LOGO, name: string, slug: string): CaseStudyTile => ({
    name,
    logoSrc: LOGO[key],
    href: `${prefix}/${slug}`,
    ariaLabel: `${viewCase}: ${name}`,
  });

  const otherWork = (key: keyof typeof LOGO, name: string): OtherWorkTile => ({
    name,
    logoSrc: LOGO[key],
  });

  const cure = caseStudy("cure", "CURE Intelligence / SCRIOO", "cure");
  const hp = caseStudy("hp", "HP Subscription Onboarding", "hp");
  const theodoor = caseStudy("theodoor", "Theodoor", "theodoor");
  const intuit = caseStudy("intuit", "Intuit for Education", "intuit");
  const aster = caseStudy("aster", "ASTER", "aster");
  const cirrus = otherWork("cirrus", "Cirrus");
  const softplan = otherWork("softplan", "Softplan");
  const lightship = otherWork("lightship", "Lightship");

  if (locale === "en") {
    return {
      eyebrow: "CAPABILITIES",
      title: "Capabilities",
      intro:
        "Different projects show different parts of my practice — from complex systems and design systems to AI-assisted prototyping, accessibility, data-heavy UX, and interaction design.",
      caseStudiesLabel: "RELATED CASE STUDIES",
      otherWorkLabel: "OTHER RELEVANT WORK",
      capabilities: [
        {
          number: "01",
          title: "Complex systems",
          tags: ["Enterprise UX", "Operational users", "Connected products"],
          description:
            "I turn dense product logic into interfaces people can understand and operate—across multi-state workflows, connected systems, and decisions where hiding complexity would make the product less useful.",
          caseStudies: [cure, hp],
          otherWork: [cirrus, softplan],
        },
        {
          number: "02",
          title: "Research and discovery",
          tags: ["User research", "Product discovery", "Usability testing"],
          description:
            "I use interviews, workshops, low-fidelity prototypes, and focused usability tests to clarify the problem, expose risky assumptions, and align teams before expensive UI work begins.",
          caseStudies: [intuit, cure],
          otherWork: [],
        },
        {
          number: "03",
          title: "Design Systems",
          tags: ["Components", "Tokens", "Governance"],
          description:
            "I build systems that keep products coherent as they grow—combining reusable components, token structures, documentation, engineering collaboration, and practical governance.",
          caseStudies: [intuit, theodoor],
          otherWork: [lightship],
        },
        {
          number: "04",
          title: "AI-assisted prototyping",
          tags: ["AI workflows", "Behavioral prototypes", "Edge cases"],
          description:
            "I use AI to prototype behavior, simulate edge cases, and produce realistic test content faster—expanding exploration without outsourcing design judgment.",
          caseStudies: [theodoor],
          otherWork: [],
        },
        {
          number: "05",
          title: "Designing for AI systems",
          tags: ["Trust", "Error recovery", "Human decision"],
          description:
            "I design AI interfaces that communicate confidence, expose uncertainty, support recovery, and keep people in control when automated outputs affect important decisions.",
          caseStudies: [aster, cure],
          otherWork: [],
        },
        {
          number: "06",
          title: "Accessibility and inclusive UX",
          tags: ["Inclusive UX", "Multimodal feedback", "Mobile"],
          description:
            "I design for people, devices, and contexts where visual feedback alone is not enough—using accessible interaction patterns, multimodal feedback, and resilient states.",
          caseStudies: [theodoor, intuit],
          otherWork: [],
        },
        {
          number: "07",
          title: "Motion and interaction",
          tags: ["System feedback", "State transitions", "Prototyping"],
          description:
            "I use motion and interaction to explain state, confirm actions, and make system behavior easier to understand—especially when a digital interface controls something physical.",
          caseStudies: [theodoor, hp],
          otherWork: [cirrus, lightship],
        },
        {
          number: "08",
          title: "Data-heavy UX",
          tags: ["Dashboards", "Enterprise", "Progressive disclosure"],
          description:
            "I make dense interfaces usable through hierarchy, filtering, comparison, and progressive disclosure—preserving the information people need without overwhelming the first view.",
          caseStudies: [cure, intuit],
          otherWork: [cirrus, softplan],
        },
        {
          number: "09",
          title: "Documentation and handoff",
          tags: ["Specifications", "Edge cases", "Engineering collaboration"],
          description:
            "I document flows, states, edge cases, and interaction rules so engineering and QA can build with less ambiguity, rework, and interpretation debt.",
          caseStudies: [cure, hp],
          otherWork: [lightship, softplan],
        },
      ],
    };
  }

  return {
    eyebrow: "COMPETÊNCIAS",
    title: "Competências",
    intro:
      "Projetos diferentes mostram partes diferentes da minha prática — de sistemas complexos e design systems a prototipação assistida por IA, acessibilidade, UX denso em dados e design de interação.",
    caseStudiesLabel: "CASES RELACIONADOS",
    otherWorkLabel: "OUTROS TRABALHOS RELEVANTES",
    capabilities: [
      {
        number: "01",
        title: "Sistemas complexos",
        tags: ["UX enterprise", "Usuários operacionais", "Produtos conectados"],
        description:
          "Transformo lógicas de produto densas em interfaces que as pessoas conseguem entender e operar — em workflows com múltiplos estados, sistemas conectados e decisões em que esconder a complexidade tornaria o produto menos útil.",
        caseStudies: [cure, hp],
        otherWork: [cirrus, softplan],
      },
      {
        number: "02",
        title: "Pesquisa e discovery",
        tags: ["Pesquisa com usuários", "Product discovery", "Testes de usabilidade"],
        description:
          "Uso entrevistas, workshops, protótipos de baixa fidelidade e testes de usabilidade focados para esclarecer o problema, expor hipóteses arriscadas e alinhar times antes de começar o trabalho caro de UI.",
        caseStudies: [intuit, cure],
        otherWork: [],
      },
      {
        number: "03",
        title: "Design Systems",
        tags: ["Componentes", "Tokens", "Governança"],
        description:
          "Construo sistemas que mantêm os produtos coerentes conforme crescem — combinando componentes reutilizáveis, estruturas de tokens, documentação, colaboração com engenharia e governança prática.",
        caseStudies: [intuit, theodoor],
        otherWork: [lightship],
      },
      {
        number: "04",
        title: "Prototipação assistida por IA",
        tags: ["Workflows de IA", "Protótipos comportamentais", "Edge cases"],
        description:
          "Uso IA para prototipar comportamento, simular edge cases e produzir conteúdo de teste realista mais rápido — ampliando a exploração sem terceirizar o julgamento de design.",
        caseStudies: [theodoor],
        otherWork: [],
      },
      {
        number: "05",
        title: "Design para sistemas de IA",
        tags: ["Confiança", "Recuperação de erro", "Decisão humana"],
        description:
          "Desenho interfaces de IA que comunicam nível de confiança, expõem incerteza, apoiam a recuperação de erros e mantêm as pessoas no controle quando resultados automatizados afetam decisões importantes.",
        caseStudies: [aster, cure],
        otherWork: [],
      },
      {
        number: "06",
        title: "Acessibilidade e UX inclusiva",
        tags: ["UX inclusiva", "Feedback multimodal", "Mobile"],
        description:
          "Desenho para pessoas, dispositivos e contextos em que só o feedback visual não basta — usando padrões de interação acessíveis, feedback multimodal e estados resilientes.",
        caseStudies: [theodoor, intuit],
        otherWork: [],
      },
      {
        number: "07",
        title: "Motion e interação",
        tags: ["Feedback do sistema", "Transições de estado", "Prototipação"],
        description:
          "Uso motion e interação para explicar estado, confirmar ações e tornar o comportamento do sistema mais fácil de entender — especialmente quando uma interface digital controla algo físico.",
        caseStudies: [theodoor, hp],
        otherWork: [cirrus, lightship],
      },
      {
        number: "08",
        title: "UX denso em dados",
        tags: ["Dashboards", "Enterprise", "Progressive disclosure"],
        description:
          "Torno interfaces densas utilizáveis por meio de hierarquia, filtros, comparação e progressive disclosure — preservando a informação que as pessoas precisam sem sobrecarregar a primeira visualização.",
        caseStudies: [cure, intuit],
        otherWork: [cirrus, softplan],
      },
      {
        number: "09",
        title: "Documentação e handoff",
        tags: ["Especificações", "Edge cases", "Colaboração com engenharia"],
        description:
          "Documento fluxos, estados, edge cases e regras de interação para que engenharia e QA consigam construir com menos ambiguidade, retrabalho e dívida de interpretação.",
        caseStudies: [cure, hp],
        otherWork: [lightship, softplan],
      },
    ],
  };
}

export function CapabilitiesContent({ locale }: { locale: Locale }) {
  const t = buildCapabilitiesCopy(locale);
  const otherLocaleHref = locale === "pt" ? "/capabilities" : "/pt/competencias";

  return (
    <>
      <NavBar context="light" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main data-theme="dark">
        <section className={styles.header}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.intro}>{t.intro}</p>
        </section>

        <div className={styles.rows}>
          {t.capabilities.map((cap) => (
            <CapabilitySection
              key={cap.number}
              number={cap.number}
              title={cap.title}
              tags={cap.tags}
              description={cap.description}
              caseStudiesLabel={t.caseStudiesLabel}
              otherWorkLabel={t.otherWorkLabel}
              caseStudies={cap.caseStudies}
              otherWork={cap.otherWork}
            />
          ))}
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
