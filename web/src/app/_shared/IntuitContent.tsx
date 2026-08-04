import Link from "next/link";
import { NavBar, type Locale } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import styles from "../(pt)/cases/cases.module.css";

const COPY = {
  en: {
    backLink: "← Back to work",
    heroTitle: "Intuit for Education",
    heroSubtitle: "Financial education experience for students.",
    meta: [
      { label: "Role", value: "Product Designer · Core contributor" },
      {
        label: "Scope",
        value:
          "Initial design system ownership, majority of UI screens, Track / Plan / Learn flows, visual direction, themes, font scaling, and product-ready documentation",
      },
      { label: "Collaboration", value: "Design Lead, PM, product team, and client stakeholders" },
      { label: "Platform", value: "Mobile / responsive experience" },
      { label: "Duration", value: "On-demand project" },
    ],
    minuteTitle: "Project in a minute",
    minuteParas: [
      "Intuit for Education was a financial education product designed to help students relate to money through a more accessible and intentional digital experience.",
      "The product was built around three connected modules: Track for present-day and everyday financial awareness; Plan for future goals and financial intention; Learn for contextual financial knowledge, delivered at the right moment.",
      "The challenge was making financial concepts feel learnable rather than overwhelming, while building a product system flexible enough to support themes, states, dark mode, and a rich illustration language.",
    ],
    minuteCaption: "Track, Plan and Learn in light and dark mode: the product system needed to support multiple themes, illustration contexts, and interface states with consistency.",
    contributionTitle: "My contribution",
    contributionIntro: "I joined the project before the Design Lead and helped shape the product's initial UI foundation.",
    contributionIntro2: "I created the initial design system structure, designed the majority of screens, and worked daily with the Design Lead and PM to review flows, hierarchy, product logic, and client-facing decisions.",
    contributionList: [
      "Create the initial design system structure and reusable UI foundations",
      "Design the majority of product screens across Track, Plan, and Learn",
      "Translate financial concepts into concrete, learnable interface patterns",
      "Apply visual direction across themes, states, modules, and product surfaces",
      "Collaborate with the Design Lead and PM to refine hierarchy, flow logic, and client-facing decisions",
    ],
    complexTitle: "What made it complex",
    complexIntro: "The product needed to make money feel clear, useful, and learnable for students.",
    complexList: [
      "Students had different levels of financial confidence and experience, so the product needed to feel accessible without trivializing money.",
      "The product needed to connect three distinct behaviors: tracking money day to day, planning future goals, and learning financial concepts.",
      "Research needed to combine multiple perspectives: students, course coordinators, financial aid stakeholders, and client expectations.",
      "The design system was being created while product direction was still evolving, so the foundations needed to be flexible without becoming loose.",
    ],
    complexCaption: "Stakeholder and client conversations mapped in FigJam helped clarify goals, expectations, and what “financial education for students” meant in product terms.",
    researchTitle: "Research and direction validation",
    researchParas: [
      "The project combined discovery interviews, stakeholder conversations, and visual direction validation.",
      "We talked with Gen Z college students, course coordinators, and financial aid stakeholders within the university to understand everyday money challenges, planning needs, and confidence in financial decisions.",
      "We also used Maze to compare UI directions and identify which visual approach had the strongest reception with the target audience.",
    ],
    researchCaption: "Research and Maze validation helped the team align on product direction, tone, and visual approach before scaling the UI system.",
    approachTitle: "How I approached it",
    approachItems: [
      { title: "Ground direction in research", text: "We started with interviews and conversations involving Gen Z college students, course coordinators, and financial aid stakeholders within the university. This helped the team understand what financial education for students meant beyond the interface: everyday financial stress, planning needs, institutional support, and confidence in financial decisions." },
      { title: "Build the foundation early", text: "I created the initial design system structure before the Design Lead joined — tokens, typographic scales, color foundations, and reusable components — so the team had a stable base to build from." },
      { title: "Explore and validate visual directions", text: "We explored multiple UI directions and used Maze to understand which visual approach had the strongest reception with the target audience." },
      { title: "Design across Track, Plan, and Learn", text: "Each module had a different user intent and information hierarchy. I designed across all three while keeping the system and visual logic consistent." },
      { title: "Work in daily three-way review", text: "Every morning, the Design Lead, the PM, and I reviewed flows, discussed hierarchy, resolved product logic questions, and aligned on client-facing decisions." },
    ],
    decisionsTitle: "Key design decisions",
    decisionsIntro: "Design decisions that shaped how the product communicated money, progress, and learning.",
    decisions: [
      { title: "01 · Connect Track, Plan, and Learn", paragraphs: ["The three modules weren't separate products — they needed to feel like a single experience with shared logic. Track informed Plan. Plan surfaced Learn moments. I designed the connective tissue between them so users could move fluidly from today's spending to a future goal to a relevant financial concept."] },
      { title: "02 · Turn financial goals into visible progress", paragraphs: ["Abstract financial goals are hard to act on. I translated those goals into visual progress states — active targets with contribution tracking, timelines, and clear next steps — so users felt forward movement rather than just seeing a number."] },
      { title: "03 · Design Track as daily financial awareness", paragraphs: ["Track was the daily entry point. It needed to show what was happening today without requiring effort or prior financial knowledge. I designed the experience to surface spending breakdowns, budget states, and check-in moments as contextual, ambient information."] },
      { title: "04 · Make learning modular", paragraphs: ["Learn content needed to work as standalone moments, not just as a course. I designed the module as a navigable, contextual layer so financial concepts could appear when relevant to a user's goal or spending pattern — not only when they navigated to a dedicated section."] },
      { title: "05 · Build a flexible visual system with AI-assisted illustration", paragraphs: ["The illustration style helped make financial topics feel less abstract and more approachable. The challenge was using rich visuals without letting them override the product UI. I helped apply the visual language across screens and modules so it supported clarity, hierarchy, and engagement."] },
    ],
    decisionsCaption: "Track flow: check-in modal and financial confidence survey giving the user a moment of reflection within the daily money view. Learn flow: Happy Path and General Search with modular, navigable financial content presented in context rather than isolated in a course structure.",
    illustrationTitle: "AI-assisted illustration language",
    illustrationParas: [
      "The product used a rich AI-assisted illustration style developed by the design team. These illustrations helped make financial topics more accessible, emotional, and memorable for students, while still supporting a trustworthy product experience.",
      "My work connected that visual language to the product UI, applying it across onboarding, Track, Plan, Learn, goals, cards, and learning moments.",
    ],
    illustrationCaption: "AI-assisted illustrations helped transform abstract financial concepts into more approachable product moments. Illustration bundles organized in Figma by financial topic, each set paired with contextual photography assets for content modules.",
    foundationsTitle: "Product system foundations",
    foundationsParas: [
      "I created the initial design system structure before the Design Lead joined — tokens, color functions, typographic scales, component foundations, and reusable patterns across Track, Plan, Learn, Onboarding, Goals, and Setup.",
      "The system needed to support light and dark themes, font scaling across different device sizes, multiple illustration contexts, and a product-ready handoff structure that engineering could use with less ambiguity.",
    ],
    foundationsCaption: "Color tokens and functions in the design system for backgrounds, borders, semantic states, and interactive states across both themes. Production UI file structure: Master, Default, Dark Mode, and Font Scaling pages organized for handoff and team use.",
    outcomeTitle: "Outcome",
    outcomeList: [
      "Designed the majority of screens across Track, Plan, and Learn",
      "Created the initial design system structure, including tokens, typographic scale, colors, and reusable patterns",
      "Applied the AI-assisted illustration language consistently across product surfaces",
      "Supported dark mode, font scaling, and multi-theme system flexibility",
      "Used research interviews and Maze validation to inform product direction and visual approach",
      "Collaborated daily with the Design Lead and PM to align hierarchy, flow logic, and client-facing decisions",
    ],
    reflectionTitle: "Reflection",
    reflectionParas: [
      "This project taught me how much early design system work shapes everything that comes after. Building stable foundations before product direction was fully defined required judgment calls that held up through significant changes.",
      "Working closely with a Design Lead in a daily three-way review with the PM was one of the most effective collaboration structures I've experienced. Each person owned a distinct part of the problem, and that clarity made fast, quality decisions possible even under ambiguity.",
    ],
    nextCaseLabel: "Next case",
    nextCaseTitle: "CURE Intelligence / SCRIOO →",
    nextCaseCaption: "AI-powered supply chain risk intelligence platform.",
    nextCaseHref: "/en/cases/cure",
  },
  pt: {
    backLink: "← Voltar ao trabalho",
    heroTitle: "Intuit for Education",
    heroSubtitle: "Experiência de educação financeira para estudantes.",
    meta: [
      { label: "Papel", value: "Product Designer · Contribuidor principal" },
      {
        label: "Escopo",
        value:
          "Responsabilidade inicial pelo design system, maioria das telas de UI, fluxos Track / Plan / Learn, direção visual, temas, escala de fonte e documentação pronta para produto",
      },
      { label: "Colaboração", value: "Design Lead, PM, time de produto e stakeholders do cliente" },
      { label: "Plataforma", value: "Experiência mobile / responsiva" },
      { label: "Duração", value: "Projeto sob demanda" },
    ],
    minuteTitle: "O projeto em um minuto",
    minuteParas: [
      "Intuit for Education era um produto de educação financeira desenhado para ajudar estudantes a se relacionar com dinheiro através de uma experiência digital mais acessível e intencional.",
      "O produto foi construído em torno de três módulos conectados: Track para consciência financeira do dia a dia; Plan para metas futuras e intenção financeira; Learn para conhecimento financeiro contextual, entregue no momento certo.",
      "O desafio era fazer com que conceitos financeiros parecessem aprendíveis em vez de sobrecarregantes, enquanto construíamos um sistema de produto flexível o suficiente para suportar temas, estados, modo escuro e uma linguagem rica de ilustração.",
    ],
    minuteCaption: "Track, Plan e Learn em modo claro e escuro: o sistema do produto precisava suportar múltiplos temas, contextos de ilustração e estados de interface com consistência.",
    contributionTitle: "Minha contribuição",
    contributionIntro: "Entrei no projeto antes do Design Lead e ajudei a moldar a fundação inicial de UI do produto.",
    contributionIntro2: "Criei a estrutura inicial do design system, desenhei a maioria das telas e trabalhei diariamente com o Design Lead e o PM revisando fluxos, hierarquia, lógica de produto e decisões voltadas ao cliente.",
    contributionList: [
      "Criar a estrutura inicial do design system e fundações de UI reutilizáveis",
      "Desenhar a maioria das telas do produto entre Track, Plan e Learn",
      "Traduzir conceitos financeiros em padrões de interface concretos e aprendíveis",
      "Aplicar direção visual entre temas, estados, módulos e superfícies do produto",
      "Colaborar com o Design Lead e o PM para refinar hierarquia, lógica de fluxo e decisões voltadas ao cliente",
    ],
    complexTitle: "O que tornava complexo",
    complexIntro: "O produto precisava fazer dinheiro parecer claro, útil e aprendível para estudantes.",
    complexList: [
      "Estudantes tinham níveis diferentes de confiança e experiência financeira, então o produto precisava parecer acessível sem trivializar dinheiro.",
      "O produto precisava conectar três comportamentos distintos: acompanhar dinheiro no dia a dia, planejar metas futuras e aprender conceitos financeiros.",
      "A pesquisa precisava combinar múltiplas perspectivas: estudantes, coordenadores de curso, stakeholders de auxílio financeiro e expectativas do cliente.",
      "O design system estava sendo criado enquanto a direção do produto ainda estava evoluindo, então as fundações precisavam ser flexíveis sem ficarem soltas.",
    ],
    complexCaption: "Conversas com stakeholders e cliente mapeadas no FigJam ajudaram a esclarecer objetivos, expectativas e o que “educação financeira para estudantes” significava em termos de produto.",
    researchTitle: "Pesquisa e validação de direção",
    researchParas: [
      "O projeto combinou entrevistas de discovery, conversas com stakeholders e validação de direção visual.",
      "Conversamos com estudantes universitários da Geração Z, coordenadores de curso e stakeholders de auxílio financeiro dentro da universidade para entender desafios financeiros do dia a dia, necessidades de planejamento e confiança em decisões financeiras.",
      "Também usamos o Maze para comparar direções de UI e identificar qual abordagem visual tinha a recepção mais forte com o público-alvo.",
    ],
    researchCaption: "A pesquisa e a validação no Maze ajudaram o time a alinhar direção de produto, tom e abordagem visual antes de escalar o sistema de UI.",
    approachTitle: "Como eu abordei",
    approachItems: [
      { title: "Fundamentar a direção em pesquisa", text: "Começamos com entrevistas e conversas envolvendo estudantes universitários da Geração Z, coordenadores de curso e stakeholders de auxílio financeiro dentro da universidade. Isso ajudou o time a entender o que educação financeira para estudantes significava além da interface: estresse financeiro do dia a dia, necessidades de planejamento, suporte institucional e confiança em decisões financeiras." },
      { title: "Construir a fundação cedo", text: "Criei a estrutura inicial do design system antes do Design Lead entrar — tokens, escalas tipográficas, fundações de cor e componentes reutilizáveis — para que o time tivesse uma base estável para construir." },
      { title: "Explorar e validar direções visuais", text: "Exploramos múltiplas direções de UI e usamos o Maze para entender qual abordagem visual tinha a recepção mais forte com o público-alvo." },
      { title: "Desenhar entre Track, Plan e Learn", text: "Cada módulo tinha uma intenção de usuário e hierarquia de informação diferentes. Desenhei os três mantendo o sistema e a lógica visual consistentes." },
      { title: "Trabalhar em revisão diária a três", text: "Toda manhã, o Design Lead, o PM e eu revisávamos fluxos, discutíamos hierarquia, resolvíamos questões de lógica de produto e alinhávamos decisões voltadas ao cliente." },
    ],
    decisionsTitle: "Decisões-chave de design",
    decisionsIntro: "Decisões de design que moldaram como o produto comunicava dinheiro, progresso e aprendizado.",
    decisions: [
      { title: "01 · Conectar Track, Plan e Learn", paragraphs: ["Os três módulos não eram produtos separados — precisavam parecer uma única experiência com lógica compartilhada. Track informava Plan. Plan trazia à tona momentos de Learn. Desenhei o tecido conectivo entre eles para que usuários pudessem ir fluidamente do gasto de hoje a uma meta futura a um conceito financeiro relevante."] },
      { title: "02 · Transformar metas financeiras em progresso visível", paragraphs: ["Metas financeiras abstratas são difíceis de agir sobre. Traduzi essas metas em estados visuais de progresso — alvos ativos com acompanhamento de contribuição, linhas do tempo e próximos passos claros — para que usuários sentissem movimento à frente em vez de só ver um número."] },
      { title: "03 · Desenhar Track como consciência financeira diária", paragraphs: ["Track era o ponto de entrada diário. Precisava mostrar o que estava acontecendo hoje sem exigir esforço ou conhecimento financeiro prévio. Desenhei a experiência para trazer à tona detalhamentos de gastos, estados de orçamento e momentos de check-in como informação contextual e ambiente."] },
      { title: "04 · Tornar o aprendizado modular", paragraphs: ["O conteúdo de Learn precisava funcionar como momentos independentes, não só como um curso. Desenhei o módulo como uma camada navegável e contextual para que conceitos financeiros pudessem aparecer quando relevantes à meta ou padrão de gasto de um usuário — não só quando ele navegasse até uma seção dedicada."] },
      { title: "05 · Construir um sistema visual flexível com ilustração assistida por IA", paragraphs: ["O estilo de ilustração ajudou a fazer tópicos financeiros parecerem menos abstratos e mais acessíveis. O desafio era usar visuais ricos sem deixá-los sobrepor a UI do produto. Ajudei a aplicar a linguagem visual entre telas e módulos para que apoiasse clareza, hierarquia e engajamento."] },
    ],
    decisionsCaption: "Fluxo Track: modal de check-in e pesquisa de confiança financeira dando ao usuário um momento de reflexão dentro da visão diária de dinheiro. Fluxo Learn: Happy Path e Busca Geral com conteúdo financeiro modular e navegável apresentado em contexto, em vez de isolado numa estrutura de curso.",
    illustrationTitle: "Linguagem de ilustração assistida por IA",
    illustrationParas: [
      "O produto usava um estilo rico de ilustração assistido por IA desenvolvido pelo time de design. Essas ilustrações ajudaram a tornar tópicos financeiros mais acessíveis, emocionais e memoráveis para estudantes, mantendo uma experiência de produto confiável.",
      "Meu trabalho conectou essa linguagem visual à UI do produto, aplicando-a em onboarding, Track, Plan, Learn, metas, cards e momentos de aprendizado.",
    ],
    illustrationCaption: "Ilustrações assistidas por IA ajudaram a transformar conceitos financeiros abstratos em momentos de produto mais acessíveis. Conjuntos de ilustração organizados no Figma por tópico financeiro, cada conjunto pareado com assets de fotografia contextual para módulos de conteúdo.",
    foundationsTitle: "Fundações do sistema de produto",
    foundationsParas: [
      "Criei a estrutura inicial do design system antes do Design Lead entrar — tokens, funções de cor, escalas tipográficas, fundações de componentes e padrões reutilizáveis entre Track, Plan, Learn, Onboarding, Goals e Setup.",
      "O sistema precisava suportar temas claro e escuro, escala de fonte entre diferentes tamanhos de dispositivo, múltiplos contextos de ilustração e uma estrutura de handoff pronta para produto que engenharia pudesse usar com menos ambiguidade.",
    ],
    foundationsCaption: "Tokens e funções de cor no design system para fundos, bordas, estados semânticos e estados interativos nos dois temas. Estrutura de arquivo de UI de produção: páginas Master, Default, Dark Mode e Font Scaling organizadas para handoff e uso do time.",
    outcomeTitle: "Resultado",
    outcomeList: [
      "Desenhou a maioria das telas entre Track, Plan e Learn",
      "Criou a estrutura inicial do design system, incluindo tokens, escala tipográfica, cores e padrões reutilizáveis",
      "Aplicou a linguagem de ilustração assistida por IA de forma consistente entre superfícies do produto",
      "Apoiou modo escuro, escala de fonte e flexibilidade de sistema multi-tema",
      "Usou entrevistas de pesquisa e validação no Maze para informar direção de produto e abordagem visual",
      "Colaborou diariamente com o Design Lead e o PM para alinhar hierarquia, lógica de fluxo e decisões voltadas ao cliente",
    ],
    reflectionTitle: "Reflexão",
    reflectionParas: [
      "Esse projeto me ensinou o quanto trabalho inicial de design system molda tudo que vem depois. Construir fundações estáveis antes da direção de produto estar totalmente definida exigiu decisões de julgamento que se sustentaram através de mudanças significativas.",
      "Trabalhar de perto com um Design Lead numa revisão diária a três com o PM foi uma das estruturas de colaboração mais eficazes que já vivenciei. Cada pessoa era dona de uma parte distinta do problema, e essa clareza tornou possível decisões rápidas e de qualidade mesmo sob ambiguidade.",
    ],
    nextCaseLabel: "Próximo case",
    nextCaseTitle: "CURE Intelligence / SCRIOO →",
    nextCaseCaption: "Plataforma de inteligência de riscos em supply chain com IA.",
    nextCaseHref: "/cases/cure",
  },
} as const;

export function IntuitContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const homeHref = locale === "pt" ? "/" : "/en";
  const otherLocaleHref = locale === "pt" ? "/en/cases/intuit" : "/cases/intuit";

  return (
    <>
      <NavBar context="dark" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main className={styles.container}>
        <Link className={styles.backLink} href={homeHref}>
          {t.backLink}
        </Link>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>

          <dl className={styles.metaGrid}>
            {t.meta.map((m) => (
              <div key={m.label}>
                <dt className={styles.metaLabel}>{m.label}</dt>
                <dd className={styles.metaValue}>{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>01 · {t.minuteTitle}</p>
          <h2 className={styles.sectionTitle}>{t.minuteTitle}</h2>
          {t.minuteParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.caption}>{t.minuteCaption}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>02 · {t.contributionTitle}</p>
          <h2 className={styles.sectionTitle}>{t.contributionTitle}</h2>
          <p>{t.contributionIntro}</p>
          <p>{t.contributionIntro2}</p>
          <ol className={styles.list}>
            {t.contributionList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03 · {t.complexTitle}</p>
          <h2 className={styles.sectionTitle}>{t.complexTitle}</h2>
          <p>{t.complexIntro}</p>
          <ol className={styles.list}>
            {t.complexList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ol>
          <p className={styles.caption}>{t.complexCaption}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03B · {t.researchTitle}</p>
          <h2 className={styles.sectionTitle}>{t.researchTitle}</h2>
          {t.researchParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.caption}>{t.researchCaption}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>04 · {t.approachTitle}</p>
          <h2 className={styles.sectionTitle}>{t.approachTitle}</h2>
          <div className={styles.approachGrid}>
            {t.approachItems.map((item, i) => (
              <div className={styles.approachItem} key={item.title}>
                <span className={styles.approachNumber}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>05 · {t.decisionsTitle}</p>
          <h2 className={styles.sectionTitle}>{t.decisionsTitle}</h2>
          <p>{t.decisionsIntro}</p>

          {t.decisions.map((d) => (
            <article className={styles.decision} key={d.title}>
              <h3>{d.title}</h3>
              {d.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </article>
          ))}
          <p className={styles.caption}>{t.decisionsCaption}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>06 · {t.illustrationTitle}</p>
          <h2 className={styles.sectionTitle}>{t.illustrationTitle}</h2>
          {t.illustrationParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.caption}>{t.illustrationCaption}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>07 · {t.foundationsTitle}</p>
          <h2 className={styles.sectionTitle}>{t.foundationsTitle}</h2>
          {t.foundationsParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.caption}>{t.foundationsCaption}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>08 · {t.outcomeTitle}</p>
          <h2 className={styles.sectionTitle}>{t.outcomeTitle}</h2>
          <ul className={styles.outcomeList}>
            {t.outcomeList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <p className={styles.eyebrow}>09 · {t.reflectionTitle}</p>
          <h2 className={styles.sectionTitle}>{t.reflectionTitle}</h2>
          <blockquote className={styles.reflectionQuote}>
            {t.reflectionParas.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </blockquote>
        </section>

        <Link className={styles.nextCase} href={t.nextCaseHref}>
          <span className={styles.eyebrow}>{t.nextCaseLabel}</span>
          <span className={styles.nextCaseTitle}>{t.nextCaseTitle}</span>
          <span className={styles.caption}>{t.nextCaseCaption}</span>
        </Link>
      </main>

      <Footer locale={locale} />
    </>
  );
}
