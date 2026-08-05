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
    heroTitle: "HP Subscription Onboarding",
    heroSubtitle: "Guided setup for a printer inclusive subscription model.",
    tags: ["Subscription UX", "Connected products", "Hardware service", "Design Systems", "Enterprise", "Complex flows"],
    meta: [
      { label: "Role", value: "Product Designer · Individual contributor" },
      { label: "Scope", value: "UX/UI execution, subscription setup flows, edge cases, and handoff documentation" },
      { label: "Collaboration", value: "Product, engineering, QA, and client stakeholders" },
      { label: "Platform", value: "Web platform" },
      { label: "Duration", value: "On-demand project" },
    ],
    minuteTitle: "Project in a minute",
    minuteParas: [
      "I worked on an evolution of the HP subscription experience where the plan included not just ink, toner, or paper — but the printer itself.",
      "The model was already past an initial MVP but still in testing and implementation. My work focused on subscription setup and the account experience: helping users configure a plan, understand what was included, and review the service before committing.",
      "Because some service rules were still being clarified, the design work also helped surface edge cases around delivery, replacement, returns, printer status, and support.",
    ],
    minuteCaption: "A guided setup flow combining printer selection, monthly page volume, paper add-on, and order summary.",
    contributionTitle: "My contribution",
    contributionIntro: "I worked as an individual contributor focused on UX/UI execution, design system application, and implementation handoff.",
    contributionList: [
      "Structure the subscription setup into clear decision steps",
      "Design the printer selection, page volume, and paper add-on flow",
      "Translate service rules into visible states and next steps for the user",
      "Surface edge case questions about delivery, returns, replacement, and printer status",
      "Keep the experience aligned with HP's existing design standards",
    ],
    complexTitle: "What made it complex",
    complexIntro: "The interface needed to make a physical service model clear before the user committed.",
    complexList: [
      "The subscription included a physical printer, not just a digital plan or supply delivery.",
      "Some rules were still being clarified during implementation, so UI work surfaced questions the team needed to answer.",
      "The experience needed to clearly explain service states: what was selected, what was included, what would be delivered, what could change, and what would happen next.",
    ],
    complexCaption: "Unlike a purely digital subscription, this setup needed to account for physical products, delivery, returns, support, and service conditions.",
    approachTitle: "How I approached it",
    approachItems: [
      { title: "Understand the service state", text: "Before designing screens, I worked to understand what the user needed to know at each point: printer selected, page volume, paper add-on, price, delivery, trial conditions, and next steps." },
      { title: "Make choices sequential", text: "I structured the setup so users could make one decision at a time, rather than facing the full service model all at once." },
      { title: "Surface unanswered edge cases", text: "As the UI took shape, I helped identify open questions about printer delivery, returns, replacement, broken device scenarios, and status visibility." },
      { title: "Document for implementation", text: "I documented selections, states, edge cases, and handoff details so engineering and QA could implement the experience with less ambiguity." },
    ],
    decisionsTitle: "Key design decisions",
    decisionsIntro: "Design decisions that made the subscription easier to set up, review, and understand.",
    decisions: [
      {
        title: "01 · Turn a new subscription model into a guided setup",
        paragraphs: [
          "The new model required users to configure several connected choices: printer, monthly page volume, optional paper, and a final subscription summary. I structured the experience as a guided setup so users could understand each decision in sequence, rather than facing the full service model all at once.",
        ],
      },
      {
        title: "02 · Surface edge cases through UI work",
        paragraphs: [
          "As we designed the panel, several service questions became visible: delivery timelines, printer status, return flows, replacement scenarios, and what happens when a printer breaks or needs to be sent back. I helped raise these questions with HP and translate the answers into clearer states, flows, and interface decisions.",
        ],
      },
      {
        title: "03 · Make the subscription bundle reviewable",
        paragraphs: [
          "Because each selection affected the final subscription, users needed a clear way to review what they had chosen before continuing. The summary experience connected the selected printer, page plan, paper add-on, monthly price, trial information, shipping, and service conditions in one place.",
        ],
      },
    ],
    decisionsCaption: "The review step connected selected items, included benefits, price, trial conditions, and service requirements in one place.",
    outcomeTitle: "Outcome",
    outcomeList: [
      "Delivered a clearer setup flow for a printer-inclusive subscription model",
      "Helped translate service rules into visible states and next steps for the user",
      "Surfaced edge case questions about delivery, replacement, returns, and printer status",
      "Kept the experience consistent with HP's existing design standards and implementation needs",
    ],
    outcomeCaption: "Open questions about delivery, returns, replacement, and printer status were translated into visible states and handoff notes.",
    reflectionTitle: "Reflection",
    reflectionParas: [
      "This project reminded me that UI work can surface product questions that haven't been resolved yet.",
      "When a subscription includes physical service operations, the interface isn't just organizing choices. It's helping the team make the service logic explicit.",
    ],
    nextCaseLabel: "Next case",
  },
  pt: {
    backLink: "← Voltar ao trabalho",
    heroTitle: "HP Subscription Onboarding",
    heroSubtitle: "Configuração guiada para um modelo de assinatura com impressora incluída.",
    tags: ["UX de assinatura", "Produtos conectados", "Serviço com hardware", "Design Systems", "Enterprise", "Fluxos complexos"],
    meta: [
      { label: "Papel", value: "Product Designer · Contribuidor individual" },
      { label: "Escopo", value: "Execução de UX/UI, fluxos de configuração de assinatura, edge cases e documentação de handoff" },
      { label: "Colaboração", value: "Produto, engenharia, QA e stakeholders do cliente" },
      { label: "Plataforma", value: "Plataforma web" },
      { label: "Duração", value: "Projeto sob demanda" },
    ],
    minuteTitle: "O projeto em um minuto",
    minuteParas: [
      "Trabalhei numa evolução da experiência de assinatura da HP em que o plano incluía não só tinta, toner ou papel — mas a própria impressora.",
      "O modelo já tinha passado de um MVP inicial, mas ainda estava em teste e implementação. Meu trabalho focou na configuração da assinatura e na experiência de conta: ajudar usuários a configurar um plano, entender o que estava incluído e revisar o serviço antes de assumir o compromisso.",
      "Como algumas regras de serviço ainda estavam sendo esclarecidas, o trabalho de design também ajudou a trazer à tona edge cases sobre entrega, substituição, devoluções, status da impressora e suporte.",
    ],
    minuteCaption: "Um fluxo de configuração guiada combinando seleção de impressora, volume mensal de páginas, add-on de papel e resumo do pedido.",
    contributionTitle: "Minha contribuição",
    contributionIntro: "Trabalhei como contribuidor individual focado em execução de UX/UI, aplicação do design system e handoff de implementação.",
    contributionList: [
      "Estruturar a configuração da assinatura em etapas de decisão claras",
      "Desenhar o fluxo de seleção de impressora, volume de páginas e add-on de papel",
      "Traduzir regras de serviço em estados visíveis e próximos passos para o usuário",
      "Trazer à tona perguntas de edge case sobre entrega, devoluções, substituição e status da impressora",
      "Manter a experiência alinhada aos padrões de design já existentes da HP",
    ],
    complexTitle: "O que tornava complexo",
    complexIntro: "A interface precisava deixar claro um modelo de serviço físico antes do usuário assumir o compromisso.",
    complexList: [
      "A assinatura incluía uma impressora física, não só um plano digital ou entrega de suprimentos.",
      "Algumas regras ainda estavam sendo esclarecidas durante a implementação, então o trabalho de UI trazia à tona perguntas que o time precisava responder.",
      "A experiência precisava explicar claramente os estados do serviço: o que foi selecionado, o que estava incluído, o que seria entregue, o que podia mudar e o que aconteceria a seguir.",
    ],
    complexCaption: "Diferente de uma assinatura puramente digital, essa configuração precisava considerar produtos físicos, entrega, devoluções, suporte e condições de serviço.",
    approachTitle: "Como eu abordei",
    approachItems: [
      { title: "Entender o estado do serviço", text: "Antes de desenhar telas, trabalhei para entender o que o usuário precisava saber em cada ponto: impressora selecionada, volume de páginas, add-on de papel, preço, entrega, condições de teste e próximos passos." },
      { title: "Tornar as escolhas sequenciais", text: "Estruturei a configuração para que usuários pudessem tomar uma decisão de cada vez, em vez de enfrentar o modelo de serviço completo de uma só vez." },
      { title: "Trazer à tona edge cases não respondidos", text: "Conforme a UI tomava forma, ajudei a identificar perguntas em aberto sobre entrega de impressora, devoluções, substituição, cenários de aparelho quebrado e visibilidade de status." },
      { title: "Documentar para implementação", text: "Documentei seleções, estados, edge cases e detalhes de handoff para que engenharia e QA pudessem implementar a experiência com menos ambiguidade." },
    ],
    decisionsTitle: "Decisões-chave de design",
    decisionsIntro: "Decisões de design que tornaram a assinatura mais fácil de configurar, revisar e entender.",
    decisions: [
      {
        title: "01 · Transformar um novo modelo de assinatura numa configuração guiada",
        paragraphs: [
          "O novo modelo exigia que usuários configurassem várias escolhas conectadas: impressora, volume mensal de páginas, papel opcional e um resumo final da assinatura. Estruturei a experiência como uma configuração guiada para que usuários entendessem cada decisão em sequência, em vez de enfrentar o modelo de serviço completo de uma vez.",
        ],
      },
      {
        title: "02 · Trazer edge cases à tona através do trabalho de UI",
        paragraphs: [
          "Conforme desenhávamos o painel, várias perguntas de serviço ficaram visíveis: prazos de entrega, status da impressora, fluxos de devolução, cenários de substituição e o que acontece quando uma impressora quebra ou precisa ser devolvida. Ajudei a levantar essas perguntas com a HP e traduzir as respostas em estados, fluxos e decisões de interface mais claros.",
        ],
      },
      {
        title: "03 · Tornar o pacote da assinatura revisável",
        paragraphs: [
          "Como cada seleção afetava a assinatura final, usuários precisavam de uma forma clara de revisar o que tinham escolhido antes de continuar. A experiência de resumo conectava a impressora selecionada, o plano de páginas, o add-on de papel, o preço mensal, informações de teste, envio e condições de serviço num só lugar.",
        ],
      },
    ],
    decisionsCaption: "A etapa de revisão conectava itens selecionados, benefícios incluídos, preço, condições de teste e requisitos de serviço num só lugar.",
    outcomeTitle: "Resultado",
    outcomeList: [
      "Entregou um fluxo de configuração mais claro para um modelo de assinatura com impressora incluída",
      "Ajudou a traduzir regras de serviço em estados visíveis e próximos passos para o usuário",
      "Trouxe à tona perguntas de edge case sobre entrega, substituição, devoluções e status da impressora",
      "Manteve a experiência consistente com os padrões de design já existentes da HP e as necessidades de implementação",
    ],
    outcomeCaption: "Perguntas em aberto sobre entrega, devoluções, substituição e status da impressora foram traduzidas em estados visíveis e notas de handoff.",
    reflectionTitle: "Reflexão",
    reflectionParas: [
      "Esse projeto me lembrou que trabalho de UI pode trazer à tona perguntas de produto que ainda não foram resolvidas.",
      "Quando uma assinatura inclui operações de serviço físico, a interface não está só organizando escolhas. Está ajudando o time a tornar a lógica do serviço explícita.",
    ],
    nextCaseLabel: "Próximo case",
  },
} as const;

const IMAGES = {
  hero: {
    src: "/images/cases/hp/hero.png",
    alt: { en: "HP Instant Ink box being delivered, next to a laptop showing the HP Smart account overview.", pt: "Caixa do HP Instant Ink sendo entregue, ao lado de um laptop mostrando a visão geral da conta no HP Smart." },
  },
  overviewScreens: {
    src: "/images/cases/hp/overview-screens.png",
    alt: { en: "Four mobile screens: account overview, monthly paper summary, billing cycle, and cartridge status.", pt: "Quatro telas mobile: visão geral da conta, resumo mensal de papel, ciclo de faturamento e status do cartucho." },
  },
  desktopDashboard: {
    src: "/images/cases/hp/desktop-dashboard.png",
    alt: { en: "Desktop view of the HP Smart account overview, showing plan usage and support details.", pt: "Visão desktop da visão geral da conta no HP Smart, mostrando uso do plano e detalhes de suporte." },
  },
  flowDiagram: {
    src: "/images/cases/hp/flow-diagram.png",
    alt: { en: "Flow diagram mapping user actions and HP's system actions across the account pages.", pt: "Diagrama de fluxo mapeando ações do usuário e ações do sistema da HP nas páginas de conta." },
  },
  onboardingFlow: {
    src: "/images/cases/hp/onboarding-flow.png",
    alt: { en: "Three onboarding screens: all-inclusive plan intro, choose your printer, and page volume selection.", pt: "Três telas de onboarding: introdução ao plano all-inclusive, escolha da impressora e seleção de volume de páginas." },
  },
} as const;

export function HpContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const homeHref = locale === "pt" ? "/pt" : "/";
  const otherLocaleHref = locale === "pt" ? "/cases/hp" : "/pt/cases/hp";
  const currentHref = locale === "pt" ? "/pt/cases/hp" : "/cases/hp";
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
          <p className={styles.caption}>{t.minuteCaption}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.overviewScreens.src} alt={IMAGES.overviewScreens.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`02 · ${t.contributionTitle}`} title={t.contributionTitle} />
          <p>{t.contributionIntro}</p>
          <ol className={styles.list}>
            {t.contributionList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`03 · ${t.complexTitle}`} title={t.complexTitle} />
          <p>{t.complexIntro}</p>
          <ol className={styles.list}>
            {t.complexList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ol>
          <p className={styles.caption}>{t.complexCaption}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.desktopDashboard.src} alt={IMAGES.desktopDashboard.alt[locale]} />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.flowDiagram.src} alt={IMAGES.flowDiagram.alt[locale]} />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.onboardingFlow.src} alt={IMAGES.onboardingFlow.alt[locale]} />
          <p className={styles.caption}>{t.decisionsCaption}</p>
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`06 · ${t.outcomeTitle}`} title={t.outcomeTitle} />
          <ul className={styles.outcomeList}>
            {t.outcomeList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
          <p className={styles.caption}>{t.outcomeCaption}</p>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <SectionHeader eyebrow={`07 · ${t.reflectionTitle}`} title={t.reflectionTitle} />
          <Quote>
            {t.reflectionParas.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Quote>
        </section>

        <Card href={nextCase.href} padding="spacious" className={styles.nextCase}>
          <span className={styles.eyebrow}>{t.nextCaseLabel}</span>
          <span className={styles.nextCaseTitle}>
            {nextCase.title} <span className={styles.nextCaseArrow}>→</span>
          </span>
          <span className={styles.caption}>{nextCase.summary}</span>
        </Card>
      </main>

      <Footer locale={locale} />
    </>
  );
}
