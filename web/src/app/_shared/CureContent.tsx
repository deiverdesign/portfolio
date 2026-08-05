import Link from "next/link";
import { NavBar, type Locale } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Card } from "@/components/Card/Card";
import { Quote } from "@/components/Quote/Quote";
import { Tag } from "@/components/Tag/Tag";
import { getNextCase } from "./HomeContent";
import styles from "./cases.module.css";

const COPY = {
  en: {
    backLink: "← Back to work",
    heroTitle: "CURE Intelligence / SCRIOO",
    heroSubtitle: "AI-powered supply chain risk intelligence platform.",
    tags: ["Complex systems", "AI", "Data-heavy UX", "Enterprise", "Web platform", "Design Systems"],
    meta: [
      { label: "Role", value: "Product Designer · Individual contributor" },
      {
        label: "Scope",
        value:
          "UX flows, information architecture, risk map simplification, supplier comparison, usability testing, and handoff documentation",
      },
      { label: "Collaboration", value: "Product, engineering, and client stakeholders" },
      { label: "Platform", value: "Web platform" },
      { label: "Duration", value: "6 months" },
    ],
    minuteTitle: "Project in a minute",
    minuteParas: [
      "SCRIOO is an AI-powered supply chain risk intelligence platform that helps companies monitor suppliers, understand risk signals, and support operational decisions.",
      "The product combines risk map exploration, supplier information, historical incident data, filters, documents, and compliance-related flows.",
      "My work focused on making that complex information easier to scan, compare, and act on.",
    ],
    contributionTitle: "My contribution",
    contributionIntro:
      "I worked as an individual contributor on UX flows, information architecture, interface patterns, usability testing, and handoff documentation.",
    contributionList: [
      "Simplify how risk appeared on the map",
      "Design clearer ways to compare supplier incidents over time",
      "Use progressive disclosure to reduce cognitive load",
      "Structure usability tests focused on the team's riskiest hypotheses",
      "Document flows, states, and decisions for implementation",
    ],
    contributionCaption:
      "Risk information was structured in layers: first severity and location, then supplier details when needed.",
    complexTitle: "What made it complex",
    complexIntro: "The challenge was helping users understand dense risk information without hiding the complexity behind it.",
    complexList: [
      "Users needed to move from a risk overview to per-supplier details without losing context.",
      "The interface combined dense information: maps, risk categories, filters, historical incidents, supplier data, and documents.",
      "The product needed to show enough detail for informed decisions without overwhelming the first layer of the experience.",
      "The same risk model needed to work across map, analytics, and insights views — including mobile.",
    ],
    approachTitle: "How I approached it",
    approachItems: [
      {
        title: "Understand the decision",
        text: "Before designing screens, I worked to understand what users needed to decide: where risk was happening, how severe it was, and whether a supplier required action.",
      },
      {
        title: "Reduce the first layer",
        text: "I focused on what users needed to see first, especially on the risk map, where too much information made scanning harder.",
      },
      {
        title: "Test uncertain flows",
        text: "When the team had open questions, I structured focused usability tests using simplified prototypes and external participants.",
      },
      {
        title: "Document the system",
        text: "I documented flows, states, interaction rules, and handoff details so engineering could implement the experience with less ambiguity.",
      },
    ],
    approachCaption: "Screens explored across map, analytics, filters, documents, mobile, and light/dark themes.",
    decisionsTitle: "Key design decisions",
    decisionsIntro: "Design decisions that made the product easier to scan, compare, and act on.",
    decisions: [
      {
        title: "01 · Simplify risk markers on the map",
        paragraphs: [
          "The risk map displayed many markers at once, each representing a potential risk. In an earlier direction, each marker tried to communicate multiple pieces of information at the same time.",
          "I proposed simplifying the marker system so the first layer communicated the most important risk signal first. Additional detail remained available progressively.",
          "The main argument was that showing less information upfront could support faster decisions, because the primary function of the map was to direct attention.",
          "Risk severity was communicated by color for quick recognition, but not by color alone. We also included a secondary cue to support accessibility.",
        ],
      },
      {
        title: "02 · Support supplier comparison over time",
        paragraphs: [
          "I worked on Incident Through Time, a feature that allowed comparing incidents from two or more suppliers over a selected period.",
          "The goal was to help decision-makers understand how supplier risk evolved over time, rather than evaluating incidents as isolated events.",
          "This supported decisions like maintaining, replacing, or monitoring a supplier more closely.",
        ],
      },
      {
        title: "03 · Use progressive disclosure for dense risk information",
        paragraphs: [
          "A recurring principle in the project was that not all information needed to appear at the same level. The interface needed to support a sequence: identify what deserves attention, understand why it matters, then access supporting detail.",
          "Progressive disclosure helped reduce cognitive load without hiding the complexity of supply chain risk.",
        ],
      },
    ],
    usabilityEyebrowTitle: "Targeted usability validation",
    usabilitySubheading: "Validating clarity without direct access to end users",
    usabilityParas: [
      "We didn't have direct access to end users, so I structured focused usability tests with external participants.",
      "The goal wasn't to validate domain expertise. It was to test whether people seeing the interface for the first time could understand the structure, follow main flows, identify important risk signals, and complete specific tasks.",
      "We only tested the areas where the team had the most uncertainty, such as map scanning, Incident Through Time, and the transition from overview to detail.",
      "This helped the team move from internal debate to more evidence-informed design decisions, while staying honest about the limits of the research.",
    ],
    testCards: [
      {
        title: "01 · Map scanning",
        question: "Could people identify the most important risks on a dense map?",
        test: "Multiple risk markers in a simplified scenario.",
        informed: "Simpler marker hierarchy and clearer severity cues.",
      },
      {
        title: "02 · Supplier comparison",
        question: "Could people compare supplier incidents over time?",
        test: "Incident Through Time with two or more suppliers.",
        informed: "Chart hierarchy, labels, and comparison flow.",
      },
      {
        title: "03 · Progressive detail",
        question: "Could people move from overview to detail without overload?",
        test: "Task moving from map overview to supporting detail.",
        informed: "Lighter first layer with progressive access to detail.",
      },
    ],
    outcomeTitle: "Outcome",
    outcomeList: [
      "Made dense risk information easier to scan and compare",
      "Simplified the first layer of the map while preserving access to deeper detail",
      "Helped users compare supplier risk trends over time",
      "Improved design handoff through documented flows, states, and interaction rules",
    ],
    outcomeCaption:
      "Design system foundations, theme tokens, and documented states supported implementation across light and dark modes.",
    reflectionTitle: "Reflection",
    reflectionParas: [
      "This project reinforced a lesson I still use often: in complex products, the first design challenge isn't the screen — it's understanding what decision the interface needs to support.",
      "Once that was clear, UI decisions became easier to explain, test, and document.",
    ],
    nextCaseLabel: "Next case",
  },
  pt: {
    backLink: "← Voltar ao trabalho",
    heroTitle: "CURE Intelligence / SCRIOO",
    heroSubtitle: "Plataforma de inteligência de riscos em supply chain com IA.",
    tags: ["Sistemas complexos", "IA", "UX denso em dados", "Enterprise", "Plataforma web", "Design Systems"],
    meta: [
      { label: "Papel", value: "Product Designer · Contribuidor individual" },
      {
        label: "Escopo",
        value:
          "Fluxos de UX, arquitetura de informação, simplificação do mapa de risco, comparação de fornecedores, testes de usabilidade e documentação de handoff",
      },
      { label: "Colaboração", value: "Produto, engenharia e stakeholders do cliente" },
      { label: "Plataforma", value: "Plataforma web" },
      { label: "Duração", value: "6 meses" },
    ],
    minuteTitle: "O projeto em um minuto",
    minuteParas: [
      "A SCRIOO é uma plataforma de inteligência de riscos em supply chain com IA que ajuda empresas a monitorar fornecedores, entender sinais de risco e apoiar decisões operacionais.",
      "O produto combina exploração de mapa de risco, informações de fornecedores, dados históricos de incidentes, filtros, documentos e fluxos relacionados a compliance.",
      "Meu trabalho focou em tornar essa informação complexa mais fácil de escanear, comparar e agir sobre ela.",
    ],
    contributionTitle: "Minha contribuição",
    contributionIntro:
      "Trabalhei como contribuidor individual em fluxos de UX, arquitetura de informação, padrões de interface, testes de usabilidade e documentação de handoff.",
    contributionList: [
      "Simplificar como o risco aparecia no mapa",
      "Desenhar formas mais claras de comparar incidentes de fornecedores ao longo do tempo",
      "Usar progressive disclosure para reduzir carga cognitiva",
      "Estruturar testes de usabilidade focados nas hipóteses de maior risco do time",
      "Documentar fluxos, estados e decisões para implementação",
    ],
    contributionCaption:
      "A informação de risco foi estruturada em camadas: primeiro severidade e localização, depois detalhes do fornecedor quando necessário.",
    complexTitle: "O que tornava complexo",
    complexIntro:
      "O desafio era ajudar usuários a entender informação densa de risco sem esconder a complexidade por trás dela.",
    complexList: [
      "Usuários precisavam ir de uma visão geral de risco para detalhes por fornecedor sem perder contexto.",
      "A interface combinava informação densa: mapas, categorias de risco, filtros, incidentes históricos, dados de fornecedores e documentos.",
      "O produto precisava mostrar detalhe suficiente para decisões informadas sem sobrecarregar a primeira camada da experiência.",
      "O mesmo modelo de risco precisava funcionar em visões de mapa, analytics e insights — incluindo mobile.",
    ],
    approachTitle: "Como eu abordei",
    approachItems: [
      {
        title: "Entender a decisão",
        text: "Antes de desenhar telas, trabalhei para entender o que os usuários precisavam decidir: onde o risco estava acontecendo, quão severo era e se um fornecedor precisava de ação.",
      },
      {
        title: "Reduzir a primeira camada",
        text: "Foquei no que os usuários precisavam ver primeiro, especialmente no mapa de risco, onde informação demais dificultava o escaneamento.",
      },
      {
        title: "Testar fluxos incertos",
        text: "Quando o time tinha perguntas em aberto, estruturei testes de usabilidade focados usando protótipos simplificados e participantes externos.",
      },
      {
        title: "Documentar o sistema",
        text: "Documentei fluxos, estados, regras de interação e detalhes de handoff para que engenharia pudesse implementar a experiência com menos ambiguidade.",
      },
    ],
    approachCaption: "Telas exploradas em mapa, analytics, filtros, documentos, mobile e temas claro/escuro.",
    decisionsTitle: "Decisões-chave de design",
    decisionsIntro: "Decisões de design que tornaram o produto mais fácil de escanear, comparar e agir.",
    decisions: [
      {
        title: "01 · Simplificar os marcadores de risco no mapa",
        paragraphs: [
          "O mapa de risco exibia muitos marcadores ao mesmo tempo, cada um representando um risco potencial. Numa direção anterior, cada marcador tentava comunicar várias informações ao mesmo tempo.",
          "Propus simplificar o sistema de marcadores para que a primeira camada comunicasse primeiro o sinal de risco mais importante. Detalhe adicional permanecia disponível progressivamente.",
          "O argumento principal era que mostrar menos informação de início podia apoiar decisões mais rápidas, já que a função primária do mapa era direcionar atenção.",
          "A severidade do risco era comunicada por cor para reconhecimento rápido, mas não só por cor. Também incluímos uma pista secundária para apoiar acessibilidade.",
        ],
      },
      {
        title: "02 · Apoiar comparação de fornecedores ao longo do tempo",
        paragraphs: [
          "Trabalhei no Incident Through Time, uma funcionalidade que permitia comparar incidentes de dois ou mais fornecedores num período selecionado.",
          "O objetivo era ajudar quem decide a entender como o risco de um fornecedor evoluiu ao longo do tempo, em vez de avaliar incidentes como eventos isolados.",
          "Isso apoiava decisões como manter, substituir ou monitorar um fornecedor mais de perto.",
        ],
      },
      {
        title: "03 · Usar progressive disclosure para informação densa de risco",
        paragraphs: [
          "Um princípio recorrente no projeto era que nem toda informação precisava aparecer no mesmo nível. A interface precisava apoiar uma sequência: identificar o que merece atenção, entender por que importa, e só então acessar o detalhe de apoio.",
          "Progressive disclosure ajudou a reduzir carga cognitiva sem esconder a complexidade do risco em supply chain.",
        ],
      },
    ],
    usabilityEyebrowTitle: "Validação de usabilidade direcionada",
    usabilitySubheading: "Validando clareza sem acesso direto a usuários finais",
    usabilityParas: [
      "Não tínhamos acesso direto a usuários finais, então estruturei testes de usabilidade focados com participantes externos.",
      "O objetivo não era validar conhecimento de domínio. Era testar se pessoas vendo a interface pela primeira vez conseguiam entender a estrutura, seguir os fluxos principais, identificar sinais de risco importantes e completar tarefas específicas.",
      "Testamos só as áreas onde o time tinha mais incerteza, como escaneamento do mapa, Incident Through Time e a transição de visão geral para detalhe.",
      "Isso ajudou o time a sair do debate interno para decisões de design mais informadas por evidência, mantendo honestidade sobre os limites da pesquisa.",
    ],
    testCards: [
      {
        title: "01 · Escaneamento do mapa",
        question: "As pessoas conseguiam identificar os riscos mais importantes num mapa denso?",
        test: "Múltiplos marcadores de risco num cenário simplificado.",
        informed: "Hierarquia de marcadores mais simples e pistas de severidade mais claras.",
      },
      {
        title: "02 · Comparação de fornecedores",
        question: "As pessoas conseguiam comparar incidentes de fornecedores ao longo do tempo?",
        test: "Incident Through Time com dois ou mais fornecedores.",
        informed: "Hierarquia do gráfico, rótulos e fluxo de comparação.",
      },
      {
        title: "03 · Detalhe progressivo",
        question: "As pessoas conseguiam ir da visão geral ao detalhe sem sobrecarga?",
        test: "Tarefa indo da visão geral do mapa ao detalhe de apoio.",
        informed: "Primeira camada mais leve com acesso progressivo ao detalhe.",
      },
    ],
    outcomeTitle: "Resultado",
    outcomeList: [
      "Tornou a informação densa de risco mais fácil de escanear e comparar",
      "Simplificou a primeira camada do mapa preservando acesso a detalhe mais profundo",
      "Ajudou usuários a comparar tendências de risco de fornecedores ao longo do tempo",
      "Melhorou o handoff de design através de fluxos, estados e regras de interação documentados",
    ],
    outcomeCaption:
      "Fundações de design system, tokens de tema e estados documentados apoiaram a implementação nos modos claro e escuro.",
    reflectionTitle: "Reflexão",
    reflectionParas: [
      "Esse projeto reforçou uma lição que ainda uso bastante: em produtos complexos, o primeiro desafio de design não é a tela — é entender qual decisão a interface precisa apoiar.",
      "Uma vez que isso estava claro, decisões de UI ficaram mais fáceis de explicar, testar e documentar.",
    ],
    nextCaseLabel: "Próximo case",
  },
} as const;

const IMAGES = {
  hero: {
    src: "/images/cases/cure/hero.png",
    alt: { en: "SCRIOO risk map open on a laptop, next to shipping containers.", pt: "Mapa de risco da SCRIOO aberto num laptop, ao lado de contêineres de transporte." },
  },
  riskMapComparison: {
    src: "/images/cases/cure/risk-map-comparison.png",
    alt: { en: "Before and after comparison of the risk map, from a dense dark UI to a clearer light UI.", pt: "Comparação antes e depois do mapa de risco, de uma UI escura densa para uma UI clara mais legível." },
  },
  mobileView: {
    src: "/images/cases/cure/mobile-view.png",
    alt: { en: "Three mobile screens showing the risk map, incident analytics, and insight reports.", pt: "Três telas mobile mostrando o mapa de risco, analytics de incidentes e relatórios de insight." },
  },
  screenDetail: {
    src: "/images/cases/cure/screen-detail.png",
    alt: { en: "Risk map with a supplier detail panel open, showing risk type, owner, and KPI tolerance.", pt: "Mapa de risco com painel de detalhe de fornecedor aberto, mostrando tipo de risco, responsável e tolerância de KPI." },
  },
  incidentThroughTime: {
    src: "/images/cases/cure/incident-through-time.png",
    alt: { en: "Incidents through time chart comparing risk score across suppliers over several dates.", pt: "Gráfico de incidentes ao longo do tempo comparando o índice de risco entre fornecedores em várias datas." },
  },
  designSystem: {
    src: "/images/cases/cure/design-system-foundations.png",
    alt: { en: "Design system reference sheet showing component states: sidebar, filters, risk detail, edit mode, and modals.", pt: "Folha de referência do design system mostrando estados de componentes: sidebar, filtros, detalhe de risco, modo de edição e modais." },
  },
} as const;

export function CureContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const homeHref = locale === "pt" ? "/pt" : "/";
  const otherLocaleHref = locale === "pt" ? "/cases/cure" : "/pt/cases/cure";
  const currentHref = locale === "pt" ? "/pt/cases/cure" : "/cases/cure";
  const nextCase = getNextCase(locale, currentHref);

  return (
    <>
      <NavBar context="dark" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main className={styles.container}>
        <Link className={styles.backLink} href={homeHref}>
          {t.backLink}
        </Link>

        <section className={styles.hero}>
          <div className={styles.tagRow}>
            {t.tags.map((tag) => (
              <Tag key={tag} context="light">
                {tag}
              </Tag>
            ))}
          </div>

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

        <div className={styles.heroImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.hero.src} alt={IMAGES.hero.alt[locale]} />
        </div>

        <section className={styles.section}>
          <SectionHeader eyebrow={`01 · ${t.minuteTitle}`} title={t.minuteTitle} />
          {t.minuteParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`02 · ${t.contributionTitle}`} title={t.contributionTitle} />
          <p>{t.contributionIntro}</p>
          <ol className={styles.list}>
            {t.contributionList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ol>
          <p className={styles.caption}>{t.contributionCaption}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.riskMapComparison.src} alt={IMAGES.riskMapComparison.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`03 · ${t.complexTitle}`} title={t.complexTitle} />
          <p>{t.complexIntro}</p>
          <ol className={styles.list}>
            {t.complexList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ol>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.mobileView.src} alt={IMAGES.mobileView.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`04 · ${t.approachTitle}`} title={t.approachTitle} />
          <div className={styles.approachGrid}>
            {t.approachItems.map((item, i) => (
              <Card key={item.title}>
                <span className={styles.approachNumber}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p>{item.text}</p>
              </Card>
            ))}
          </div>
          <p className={styles.caption}>{t.approachCaption}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.screenDetail.src} alt={IMAGES.screenDetail.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`05 · ${t.decisionsTitle}`} title={t.decisionsTitle} />
          <p>{t.decisionsIntro}</p>

          {t.decisions.map((d) => (
            <Card key={d.title}>
              <h3 className={styles.cardTitle}>{d.title}</h3>
              {d.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Card>
          ))}
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`06 · ${t.usabilityEyebrowTitle}`} title={t.usabilityEyebrowTitle} />
          <h3 className={styles.subheading}>{t.usabilitySubheading}</h3>
          {t.usabilityParas.map((p) => (
            <p key={p}>{p}</p>
          ))}

          <div className={styles.testGrid}>
            {t.testCards.map((card) => (
              <Card key={card.title}>
                <p className={styles.testTitle}>{card.title}</p>
                <p>
                  <strong>{locale === "pt" ? "Pergunta" : "Question"}</strong>
                  <br />
                  {card.question}
                </p>
                <p>
                  <strong>{locale === "pt" ? "Teste" : "Test"}</strong>
                  <br />
                  {card.test}
                </p>
                <p>
                  <strong>{locale === "pt" ? "Informou" : "Informed"}</strong>
                  <br />
                  {card.informed}
                </p>
              </Card>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.incidentThroughTime.src} alt={IMAGES.incidentThroughTime.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`08 · ${t.outcomeTitle}`} title={t.outcomeTitle} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.designSystem.src} alt={IMAGES.designSystem.alt[locale]} />
          <ul className={styles.outcomeList}>
            {t.outcomeList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
          <p className={styles.caption}>{t.outcomeCaption}</p>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <SectionHeader eyebrow={`09 · ${t.reflectionTitle}`} title={t.reflectionTitle} />
          <Quote>
            {t.reflectionParas.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Quote>
        </section>

        <Card href={nextCase.href} padding="spacious" className={styles.nextCase}>
          <span className={styles.eyebrow}>{t.nextCaseLabel}</span>
          <span className={styles.nextCaseTitle}>{nextCase.title} →</span>
          <span className={styles.caption}>{nextCase.summary}</span>
        </Card>
      </main>

      <Footer locale={locale} />
    </>
  );
}
