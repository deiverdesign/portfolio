import Link from "next/link";
import { NavBar, type Locale } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Card } from "@/components/Card/Card";
import { Quote } from "@/components/Quote/Quote";
import { Tag } from "@/components/Tag/Tag";
import { Icon } from "@/components/icons/Icon";
import { getNextCase, getCaseNavigation } from "./HomeContent";
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
    prevCaseLabel: "Previous case",
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
    prevCaseLabel: "Case anterior",
    nextCaseLabel: "Próximo case",
  },
} as const;

const IMAGES = {
  hero: {
    src: "/images/cases/hp/hero.png",
    alt: { en: "HP Instant Ink box being delivered, next to a laptop showing the HP Smart account overview.", pt: "Caixa do HP Instant Ink sendo entregue, ao lado de um laptop mostrando a visão geral da conta no HP Smart." },
  },
  overviewScreen: {
    src: "/images/cases/hp/overview-screen.png",
    alt: { en: "Mobile account overview screen showing plan pages used, printer status, and support details.", pt: "Tela mobile de visão geral da conta mostrando páginas do plano usadas, status da impressora e detalhes de suporte." },
  },
  setupScreen: {
    src: "/images/cases/hp/setup-screen.png",
    alt: { en: "Mobile screen showing the monthly paper summary and plan and rollover page usage.", pt: "Tela mobile mostrando o resumo mensal de papel e o uso de páginas do plano e de rollover." },
  },
  billingScreen: {
    src: "/images/cases/hp/billing-screen.png",
    alt: { en: "Mobile screen showing the billing cycle period with a bar chart of pages printed over time.", pt: "Tela mobile mostrando o ciclo de faturamento com um gráfico de barras de páginas impressas ao longo do tempo." },
  },
  cartridgeScreen: {
    src: "/images/cases/hp/cartridge-screen.png",
    alt: { en: "Mobile screen showing cartridge status for each ink color, with replacement alerts.", pt: "Tela mobile mostrando o status de cada cartucho de tinta, com alertas de substituição." },
  },
  desktopMockup: {
    src: "/images/cases/hp/desktop-mockup.png",
    alt: { en: "Desktop view of the HP Smart account overview, showing plan usage and support details.", pt: "Visão desktop da visão geral da conta no HP Smart, mostrando uso do plano e detalhes de suporte." },
  },
  allInclusivePlan: {
    src: "/images/cases/hp/all-inclusive-plan.png",
    alt: { en: "Mobile screen introducing the all-inclusive printer subscription plan.", pt: "Tela mobile apresentando o plano de assinatura all-inclusive da impressora." },
  },
  choosePrinter: {
    src: "/images/cases/hp/choose-printer.png",
    alt: { en: "Mobile screen for choosing a printer, comparing Essential, Versatile, and Professional tiers.", pt: "Tela mobile para escolher a impressora, comparando os níveis Essential, Versatile e Professional." },
  },
  pageVolume: {
    src: "/images/cases/hp/page-volume.png",
    alt: { en: "Mobile screen for selecting monthly page volume, with pricing per tier.", pt: "Tela mobile para selecionar o volume mensal de páginas, com preço por nível." },
  },
  outcomeDiagram: {
    src: "/images/cases/hp/outcome-diagram.png",
    alt: { en: "Overview board mapping the subscription flow: trial pages, plan pages, billing states, delivery status, payments, and user vs. HP actions.", pt: "Board de visão geral mapeando o fluxo da assinatura: páginas de teste, páginas do plano, estados de faturamento, status de entrega, pagamentos e ações do usuário vs. da HP." },
  },
} as const;

export function HpContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const homeHref = locale === "pt" ? "/pt" : "/";
  const otherLocaleHref = locale === "pt" ? "/cases/hp" : "/pt/cases/hp";
  const currentHref = locale === "pt" ? "/pt/cases/hp" : "/cases/hp";
  const nextCase = getNextCase(locale, currentHref);
  const caseNav = getCaseNavigation(locale, currentHref);

  return (
    <>
      <NavBar context="dark" locale={locale} otherLocaleHref={otherLocaleHref} />

      <main className={styles.container}>
        <div className={styles.topRow}>
          <Link className={styles.backLink} href={homeHref}>
            {t.backLink}
          </Link>

          <nav className={styles.caseNav} aria-label={locale === "pt" ? "Navegação entre cases" : "Case navigation"}>
            {caseNav.previous ? (
              <Link className={styles.caseNavButton} href={caseNav.previous.href} aria-label={t.prevCaseLabel}>
                <Icon name="arrow-right" className={styles.caseNavIconPrev} />
              </Link>
            ) : (
              <button type="button" className={styles.caseNavButton} disabled aria-label={t.prevCaseLabel}>
                <Icon name="arrow-right" className={styles.caseNavIconPrev} />
              </button>
            )}
            {caseNav.next ? (
              <Link className={styles.caseNavButton} href={caseNav.next.href} aria-label={t.nextCaseLabel}>
                <Icon name="arrow-right" />
              </Link>
            ) : (
              <button type="button" className={styles.caseNavButton} disabled aria-label={t.nextCaseLabel}>
                <Icon name="arrow-right" />
              </button>
            )}
          </nav>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.tagRow}>
              {t.tags.map((tag) => (
                <Tag key={tag} context="light">
                  {tag}
                </Tag>
              ))}
            </div>

            <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
            <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
          </div>

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
          <div className={styles.phoneGrid}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.overviewScreen.src} alt={IMAGES.overviewScreen.alt[locale]} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.setupScreen.src} alt={IMAGES.setupScreen.alt[locale]} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.billingScreen.src} alt={IMAGES.billingScreen.alt[locale]} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.cartridgeScreen.src} alt={IMAGES.cartridgeScreen.alt[locale]} />
          </div>
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
          <img className={styles.sectionImage} src={IMAGES.desktopMockup.src} alt={IMAGES.desktopMockup.alt[locale]} />
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
          <div className={styles.phoneGrid}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.allInclusivePlan.src} alt={IMAGES.allInclusivePlan.alt[locale]} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.choosePrinter.src} alt={IMAGES.choosePrinter.alt[locale]} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.sectionImage} src={IMAGES.pageVolume.src} alt={IMAGES.pageVolume.alt[locale]} />
          </div>
          <p className={styles.caption}>{t.decisionsCaption}</p>
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`06 · ${t.outcomeTitle}`} title={t.outcomeTitle} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.outcomeDiagram.src} alt={IMAGES.outcomeDiagram.alt[locale]} />
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
