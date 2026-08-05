import Link from "next/link";
import { NavBar, type Locale } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Card } from "@/components/Card/Card";
import { Quote } from "@/components/Quote/Quote";
import { Tag } from "@/components/Tag/Tag";
import { getNextCase } from "./HomeContent";
import styles from "../(pt)/cases/cases.module.css";

const COPY = {
  en: {
    backLink: "← Back to work",
    heroTitle: "Theodoor",
    heroSubtitle: "Accessible app for smart door automation.",
    tags: ["Accessibility", "Mobile", "Physical-digital UX", "Motion", "AI-assisted prototyping", "Design Systems", "Edge cases"],
    meta: [
      { label: "Role", value: "Lead Product Designer · Individual contributor" },
      {
        label: "Scope",
        value:
          "Mobile UX, interaction design, system feedback, accessibility considerations, motion, prototyping, design system foundations, and handoff documentation",
      },
      { label: "Collaboration", value: "Product, engineering, and client stakeholders" },
      { label: "Platform", value: "Mobile app" },
      { label: "Duration", value: "1 month" },
    ],
    minuteTitle: "Project in a minute",
    minuteParas: [
      "Theodoor is a mobile app for controlling an accessible smart door automation system.",
      "My work focused on making door states, system feedback, errors, and controls clear enough that users could trust what was happening in the physical world.",
      "Because the app controlled a real door, motion, accessibility, and feedback weren't decorative. They were part of the core interaction model.",
    ],
    minuteCaption: "Designing a mobile interface for a physical system where feedback, trust, and accessibility were central to the experience.",
    contributionTitle: "My contribution",
    contributionIntro: "I worked on mobile UX, UI, design system foundations, motion, prototyping, and accessibility considerations.",
    contributionList: [
      "Map door states and user actions",
      "Design feedback for opening, closing, waiting, success, and error states",
      "Create motion explorations to communicate system behavior",
      "Use AI-assisted and code-based prototypes to test interaction ideas faster",
      "Build reusable UI foundations for the mobile experience",
    ],
    complexTitle: "What made it complex",
    complexIntro: "The interface needed to explain what was happening in the physical world.",
    complexList: [
      "The app controlled a physical object, so users needed to know whether a command was received, in progress, complete, or failed.",
      "The experience needed to support accessibility contexts where feedback couldn't rely on visual UI alone.",
      "Static screens weren't enough. The important part was how the system behaved over time.",
    ],
    approachTitle: "How I approached it",
    approachItems: [
      { title: "Map door states and user actions", text: "I mapped what the system needed to communicate: open, closed, opening, closing, waiting, success, error, and connection issues." },
      { title: "Design feedback loops", text: "I explored how the app could confirm that a command was sent, the system was processing it, and the physical action was complete or failed." },
      { title: "Simulate behavior before building", text: "I used code-based and AI-assisted prototypes to run edge-case scenarios and make state timing and transitions visible to the team before development." },
      { title: "Build reusable foundations", text: "I organized UI patterns and states into reusable foundations so the app stayed consistent as the experience evolved." },
    ],
    behavioralTitle: "Behavioral prototyping",
    behavioralParas: [
      "Static screens weren't enough to discuss this experience.",
      "I built an AI-assisted prototype simulator to make edge cases, timing, and system transitions visible before development. The simulator covered scenarios like Happy Path, Empty Home, Door Locked, Partial Open with Obstruction, Pinch Protection, Path Blocked, Battery Alert, and Offline/Out of Range.",
      "A Figma blueprint translated from the prototype helped bridge the simulation to the final design handoff.",
    ],
    behavioralCaption: "The simulator made edge cases visible before development, including offline, obstruction, pinch protection, and path-blocked scenarios.",
    decisionsTitle: "Key design decisions",
    decisionsIntro: "Design decisions that made the physical system clearer, safer, and more reliable.",
    decisions: [
      {
        title: "01 · Make invisible door states visible",
        paragraphs: ["The door could be open, closed, opening, closing, waiting, locked, unlocked, disconnected, or in an error state. I mapped these states so the interface clearly communicated what was happening, rather than leaving users guessing after tapping a button."],
      },
      {
        title: "02 · Use motion as system feedback",
        paragraphs: ["Motion was used to explain behavior, not just to make the app feel more polished. I explored animations for scanning, waiting, pairing, success, empty states, and error recovery so users understood what the system was doing over time. This was especially important because the app controlled a physical door — users needed feedback that a command had been received, was in progress, or required attention."],
      },
      {
        title: "03 · Design feedback beyond visual UI",
        paragraphs: ["Since this was an accessibility-oriented product, feedback couldn't rely only on what users saw. The interaction model considered visual, haptic, and audio feedback so system status could be understood across different contexts and by different users."],
      },
      {
        title: "04 · Prototype behavior before development",
        paragraphs: ["Static screens weren't enough to discuss this experience. I used prototypes, AI-assisted exploration, and code-based experiments to make behavior tangible before implementation, helping the team discuss timing, transitions, edge cases, and system feedback."],
      },
    ],
    motionTitle: "Motion + AI",
    motionParas: [
      "Motion was used to explain system behavior, not just to make the app feel more polished.",
      "For states like scanning, pairing, empty home, waiting, success, and failure, static screens weren't enough. Animation needed to show that the system was searching, processing, or waiting for the user's next action.",
      "I used AI-assisted and code-based workflows to speed up motion production, refine animation timing, and prepare Lottie outputs ready for implementation.",
      "The goal wasn't to automate taste. It was to reduce repetitive production work so I could focus on clarity, timing, and how motion supported system feedback.",
    ],
    motionItems: [
      { title: "Scanning and waiting states", caption: "Motion made the waiting state feel active and understandable while the system searched for nearby door devices." },
      { title: "Empty state motion", caption: "The empty state guided users toward the next action without making setup feel broken or incomplete." },
      { title: "Lottie production workflow", caption: "Motion explorations were refined into implementation-ready Lottie outputs." },
    ],
    foundationsTitle: "Design system foundations",
    foundationsParas: [
      "I organized reusable UI foundations for the app: buttons, cards, status labels, door states, feedback patterns, navigation, empty states, setup flows, errors, and recovery states.",
      "This helped keep the experience consistent across normal use, setup, settings, motion states, and edge cases.",
    ],
    foundationsCaption: "Reusable UI patterns helped the app handle setup, normal use, settings, errors, and recovery states consistently.",
    outcomeTitle: "Outcome",
    outcomeList: [
      "Made door status and system feedback easier to understand",
      "Created clearer interaction patterns for success, waiting, error, and recovery states",
      "Supported accessibility through multimodal feedback rather than visual-only communication",
      "Helped the team discuss physical-digital edge cases before implementation",
      "Built reusable UI foundations for the mobile experience",
      "Prepared motion assets for implementation through Lottie output",
    ],
    reflectionTitle: "Reflection",
    reflectionParas: [
      "This project reinforced that accessibility isn't a checklist at the end of the process.",
      "When a digital interface controls something physical, accessibility, feedback, and trust need to be part of the core interaction model.",
    ],
    nextCaseLabel: "Next case",
  },
  pt: {
    backLink: "← Voltar ao trabalho",
    heroTitle: "Theodoor",
    heroSubtitle: "App acessível para automação de portas inteligentes.",
    tags: ["Acessibilidade", "Mobile", "UX físico-digital", "Motion", "Prototipação assistida por IA", "Design Systems", "Edge cases"],
    meta: [
      { label: "Papel", value: "Lead Product Designer · Contribuidor individual" },
      {
        label: "Escopo",
        value:
          "UX mobile, design de interação, feedback de sistema, considerações de acessibilidade, motion, prototipação, fundações de design system e documentação de handoff",
      },
      { label: "Colaboração", value: "Produto, engenharia e stakeholders do cliente" },
      { label: "Plataforma", value: "App mobile" },
      { label: "Duração", value: "1 mês" },
    ],
    minuteTitle: "O projeto em um minuto",
    minuteParas: [
      "Theodoor é um app mobile para controlar um sistema acessível de automação de portas inteligentes.",
      "Meu trabalho focou em tornar estados da porta, feedback do sistema, erros e controles claros o suficiente para que usuários pudessem confiar no que estava acontecendo no mundo físico.",
      "Como o app controlava uma porta real, motion, acessibilidade e feedback não eram decorativos. Eram parte do modelo de interação central.",
    ],
    minuteCaption: "Desenhando uma interface mobile para um sistema físico onde feedback, confiança e acessibilidade eram centrais para a experiência.",
    contributionTitle: "Minha contribuição",
    contributionIntro: "Trabalhei em UX mobile, UI, fundações de design system, motion, prototipação e considerações de acessibilidade.",
    contributionList: [
      "Mapear estados da porta e ações do usuário",
      "Desenhar feedback para abertura, fechamento, espera, sucesso e estados de erro",
      "Criar explorações de motion para comunicar comportamento do sistema",
      "Usar protótipos assistidos por IA e baseados em código para testar ideias de interação mais rápido",
      "Construir fundações de UI reutilizáveis para a experiência mobile",
    ],
    complexTitle: "O que tornava complexo",
    complexIntro: "A interface precisava explicar o que estava acontecendo no mundo físico.",
    complexList: [
      "O app controlava um objeto físico, então usuários precisavam saber se um comando foi recebido, estava em progresso, completo ou falhou.",
      "A experiência precisava apoiar contextos de acessibilidade onde o feedback não podia depender só de UI visual.",
      "Telas estáticas não eram suficientes. A parte importante era como o sistema se comportava ao longo do tempo.",
    ],
    approachTitle: "Como eu abordei",
    approachItems: [
      { title: "Mapear estados da porta e ações do usuário", text: "Mapeei o que o sistema precisava comunicar: aberta, fechada, abrindo, fechando, esperando, sucesso, erro e problemas de conexão." },
      { title: "Desenhar loops de feedback", text: "Explorei como o app podia confirmar que um comando foi enviado, o sistema estava processando e a ação física foi completa ou falhou." },
      { title: "Simular comportamento antes de construir", text: "Usei protótipos baseados em código e assistidos por IA para rodar cenários de edge case e tornar timing e transições de estado visíveis pro time antes do desenvolvimento." },
      { title: "Construir fundações reutilizáveis", text: "Organizei padrões de UI e estados em fundações reutilizáveis para que o app se mantivesse consistente conforme a experiência evoluía." },
    ],
    behavioralTitle: "Prototipação comportamental",
    behavioralParas: [
      "Telas estáticas não eram suficientes para discutir essa experiência.",
      "Construí um simulador de protótipo assistido por IA para tornar edge cases, timing e transições de sistema visíveis antes do desenvolvimento. O simulador cobria cenários como Happy Path, Casa Vazia, Porta Trancada, Abertura Parcial com Obstrução, Proteção contra Pinçamento, Caminho Bloqueado, Alerta de Bateria e Offline/Fora de Alcance.",
      "Um blueprint no Figma traduzido a partir do protótipo ajudou a conectar a simulação ao handoff final de design.",
    ],
    behavioralCaption: "O simulador tornou edge cases visíveis antes do desenvolvimento, incluindo cenários de offline, obstrução, proteção contra pinçamento e caminho bloqueado.",
    decisionsTitle: "Decisões-chave de design",
    decisionsIntro: "Decisões de design que tornaram o sistema físico mais claro, seguro e confiável.",
    decisions: [
      {
        title: "01 · Tornar visíveis estados invisíveis da porta",
        paragraphs: ["A porta podia estar aberta, fechada, abrindo, fechando, esperando, trancada, destrancada, desconectada ou em estado de erro. Mapeei esses estados para que a interface comunicasse claramente o que estava acontecendo, em vez de deixar usuários adivinhando depois de tocar num botão."],
      },
      {
        title: "02 · Usar motion como feedback de sistema",
        paragraphs: ["Motion foi usado para explicar comportamento, não só para deixar o app com cara mais polida. Explorei animações para escaneamento, espera, pareamento, sucesso, estados vazios e recuperação de erro para que usuários entendessem o que o sistema estava fazendo ao longo do tempo. Isso era especialmente importante porque o app controlava uma porta física — usuários precisavam de feedback de que um comando tinha sido recebido, estava em progresso ou precisava de atenção."],
      },
      {
        title: "03 · Desenhar feedback além da UI visual",
        paragraphs: ["Como esse era um produto orientado a acessibilidade, o feedback não podia depender só do que usuários viam. O modelo de interação considerava feedback visual, háptico e sonoro para que o status do sistema pudesse ser entendido em diferentes contextos e por diferentes usuários."],
      },
      {
        title: "04 · Prototipar comportamento antes do desenvolvimento",
        paragraphs: ["Telas estáticas não eram suficientes para discutir essa experiência. Usei protótipos, exploração assistida por IA e experimentos baseados em código para tornar o comportamento tangível antes da implementação, ajudando o time a discutir timing, transições, edge cases e feedback de sistema."],
      },
    ],
    motionTitle: "Motion + IA",
    motionParas: [
      "Motion foi usado para explicar comportamento do sistema, não só para deixar o app com cara mais polida.",
      "Para estados como escaneamento, pareamento, casa vazia, espera, sucesso e falha, telas estáticas não eram suficientes. A animação precisava mostrar que o sistema estava buscando, processando ou esperando a próxima ação do usuário.",
      "Usei workflows assistidos por IA e baseados em código para acelerar a produção de motion, refinar o timing das animações e preparar outputs Lottie prontos para implementação.",
      "O objetivo não era automatizar o gosto estético. Era reduzir trabalho de produção repetitivo para que eu pudesse focar em clareza, timing e como o motion apoiava o feedback do sistema.",
    ],
    motionItems: [
      { title: "Estados de escaneamento e espera", caption: "O motion fez o estado de espera parecer ativo e compreensível enquanto o sistema buscava dispositivos de porta próximos." },
      { title: "Motion do estado vazio", caption: "O estado vazio guiava usuários para a próxima ação sem fazer a configuração parecer quebrada ou incompleta." },
      { title: "Fluxo de produção Lottie", caption: "As explorações de motion foram refinadas em outputs Lottie prontos para implementação." },
    ],
    foundationsTitle: "Fundações de design system",
    foundationsParas: [
      "Organizei fundações de UI reutilizáveis para o app: botões, cards, rótulos de status, estados da porta, padrões de feedback, navegação, estados vazios, fluxos de configuração, erros e estados de recuperação.",
      "Isso ajudou a manter a experiência consistente entre uso normal, configuração, ajustes, estados de motion e edge cases.",
    ],
    foundationsCaption: "Padrões de UI reutilizáveis ajudaram o app a lidar com configuração, uso normal, ajustes, erros e estados de recuperação de forma consistente.",
    outcomeTitle: "Resultado",
    outcomeList: [
      "Tornou o status da porta e o feedback do sistema mais fáceis de entender",
      "Criou padrões de interação mais claros para estados de sucesso, espera, erro e recuperação",
      "Apoiou acessibilidade através de feedback multimodal em vez de comunicação só visual",
      "Ajudou o time a discutir edge cases físico-digitais antes da implementação",
      "Construiu fundações de UI reutilizáveis para a experiência mobile",
      "Preparou assets de motion para implementação através de output Lottie",
    ],
    reflectionTitle: "Reflexão",
    reflectionParas: [
      "Esse projeto reforçou que acessibilidade não é uma checklist no fim do processo.",
      "Quando uma interface digital controla algo físico, acessibilidade, feedback e confiança precisam fazer parte do modelo de interação central.",
    ],
    nextCaseLabel: "Próximo case",
  },
} as const;

const IMAGES = {
  hero: {
    src: "/images/cases/theodoor/hero.png",
    alt: { en: "A person using a wheelchair opens a door with the Theodoor app on their phone.", pt: "Uma pessoa em cadeira de rodas abre uma porta com o app Theodoor no celular." },
  },
  appInterface: {
    src: "/images/cases/theodoor/app-interface.png",
    alt: { en: "Theodoor's smart door app interface, showing the door list and controls.", pt: "Interface do app Theodoor, mostrando a lista de portas e os controles." },
  },
  prototypeSimulator: {
    src: "/images/cases/theodoor/prototype-simulator.png",
    alt: { en: "The behavioral prototype simulator with test scenarios like in-motion obstruction and offline states.", pt: "O simulador do protótipo comportamental com cenários de teste como obstrução em movimento e estados offline." },
  },
  designSystem: {
    src: "/images/cases/theodoor/design-system.png",
    alt: { en: "Design system reference sheet showing color variables, semantic tokens, and a color audit.", pt: "Folha de referência do design system mostrando variáveis de cor, tokens semânticos e uma auditoria de cores." },
  },
} as const;

/** frame: "phone" = mockup de celular (borda preta grossa, como no Figma); "screen" = gravação de tela desktop, sem moldura de telefone. */
const VIDEOS = [
  { src: "/videos/cases/theodoor/scanning-for-devices.mp4", frame: "phone", label: { en: "Scanning for devices", pt: "Buscando dispositivos" } },
  { src: "/videos/cases/theodoor/door-page-empty.mp4", frame: "phone", label: { en: "Empty state, door page", pt: "Estado vazio, página da porta" } },
  { src: "/videos/cases/theodoor/screen-recording.mp4", frame: "screen", label: { en: "Interaction walkthrough", pt: "Passo a passo da interação" } },
] as const;

export function TheodoorContent({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const homeHref = locale === "pt" ? "/" : "/en";
  const otherLocaleHref = locale === "pt" ? "/en/cases/theodoor" : "/cases/theodoor";
  const currentHref = locale === "pt" ? "/cases/theodoor" : "/en/cases/theodoor";
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
          <img className={styles.sectionImage} src={IMAGES.appInterface.src} alt={IMAGES.appInterface.alt[locale]} />
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
          <SectionHeader eyebrow={`05 · ${t.behavioralTitle}`} title={t.behavioralTitle} />
          {t.behavioralParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.caption}>{t.behavioralCaption}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.prototypeSimulator.src} alt={IMAGES.prototypeSimulator.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`06 · ${t.decisionsTitle}`} title={t.decisionsTitle} />
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
          <SectionHeader eyebrow={`07 · ${t.motionTitle}`} title={t.motionTitle} />
          {t.motionParas.map((p) => (
            <p key={p}>{p}</p>
          ))}

          <div className={styles.phoneGrid}>
            {t.motionItems.slice(0, 2).map((item, i) => {
              const video = VIDEOS[i];
              return (
                <div className={styles.motionItem} key={item.title}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <video
                    className={styles.phoneFrame}
                    src={video.src}
                    aria-label={video.label[locale]}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <p className={styles.caption}>{item.caption}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.motionItem}>
            <h3 className={styles.cardTitle}>{t.motionItems[2].title}</h3>
            <video
              className={styles.screenFrame}
              src={VIDEOS[2].src}
              aria-label={VIDEOS[2].label[locale]}
              autoPlay
              muted
              loop
              playsInline
            />
            <p className={styles.caption}>{t.motionItems[2].caption}</p>
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`08 · ${t.foundationsTitle}`} title={t.foundationsTitle} />
          {t.foundationsParas.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.caption}>{t.foundationsCaption}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sectionImage} src={IMAGES.designSystem.src} alt={IMAGES.designSystem.alt[locale]} />
        </section>

        <section className={styles.section}>
          <SectionHeader eyebrow={`09 · ${t.outcomeTitle}`} title={t.outcomeTitle} />
          <ul className={styles.outcomeList}>
            {t.outcomeList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <SectionHeader eyebrow={`10 · ${t.reflectionTitle}`} title={t.reflectionTitle} />
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
