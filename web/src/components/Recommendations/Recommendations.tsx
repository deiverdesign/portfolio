"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/content/i18n";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { Icon } from "@/components/icons/Icon";
import styles from "./Recommendations.module.css";

type Recommendation = {
  id: string;
  name: string;
  company: string;
  image: string;
  originalLanguage: "en" | "pt";
  role: Record<Locale, string>;
  quote: Record<Locale, string>;
  highlight: Record<Locale, string>;
};

const SOURCE_URL = "https://www.linkedin.com/in/deiverbrito/details/recommendations/";
const INITIAL_VISIBLE_COUNT = 3;

const COPY: Record<Locale, {
  title: string;
  sourceLink: string;
  sourceLinkAriaLabel: string;
  expand: string;
  collapse: string;
  translationNote: string;
}> = {
  en: {
    title: "What my colleagues say",
    sourceLink: "Read originals on LinkedIn",
    sourceLinkAriaLabel: "Read original recommendations on LinkedIn (opens in a new tab)",
    expand: "Show all 6 recommendations",
    collapse: "Show fewer recommendations",
    translationNote: "Translated from Portuguese",
  },
  pt: {
    title: "O que meus colegas dizem",
    sourceLink: "Ver originais no LinkedIn",
    sourceLinkAriaLabel: "Ver recomendações originais no LinkedIn (abre em uma nova aba)",
    expand: "Ver todas as 6 recomendações",
    collapse: "Ver menos recomendações",
    translationNote: "Traduzido do inglês",
  },
};

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "pedro-pazitto",
    name: "Pedro Pazitto",
    company: "ArcTouch",
    image: "/images/recommendations/Pazitto.png",
    originalLanguage: "en",
    role: { en: "Director of Design", pt: "Diretor de Design" },
    quote: {
      en: "Beyond his craft as a designer, Deiver is one of the most genuinely caring and team-oriented people I've ever collaborated with. He shows up for the people around him and for the projects he's part of... the kind of teammate who makes everyone's work better just by being in the room.",
      pt: "Além da sua competência como designer, Deiver é uma das pessoas mais atenciosas e colaborativas com quem já trabalhei. Ele está presente para apoiar as pessoas ao seu redor e os projetos dos quais faz parte... aquele tipo de colega que melhora o trabalho de todos só por estar presente.",
    },
    highlight: {
      en: "makes everyone's work better just by being in the room",
      pt: "melhora o trabalho de todos só por estar presente",
    },
  },
  {
    id: "mateus-custodio",
    name: "Mateus Custodio",
    company: "Softplan",
    image: "/images/recommendations/Mateus-Custodio.jpeg",
    originalLanguage: "pt",
    role: { en: "Senior Product Manager", pt: "Gerente de Produto Sênior" },
    quote: {
      en: "Working within an extremely complex business context, Deiver consistently surprises us with the UX and interface solutions he proposes. His ability to understand complex situations and propose innovative, simple solutions is incredible, always considering the best user experience.",
      pt: "Com um contexto de negócio extremamente complexo, Deiver tende a nos surpreender positivamente com as soluções propostas a nível de experiência do usuário e interface. É incrível sua capacidade cognitiva para entender situações complexas e propor soluções inovadoras e simples, sempre pensando na melhor experiência do usuário.",
    },
    highlight: {
      en: "understand complex situations and propose innovative, simple solutions",
      pt: "entender situações complexas e propor soluções inovadoras e simples",
    },
  },
  {
    id: "vinicius-vieira",
    name: "Vinícius Vieira",
    company: "ArcTouch",
    image: "/images/recommendations/Vinicius.jpeg",
    originalLanguage: "en",
    role: { en: "Global Staff Product Designer", pt: "Global Staff Product Designer" },
    quote: {
      en: "When I continued Deiver’s work on a client project, I was genuinely impressed by his documentation abilities. The clarity and structure of his handoff made onboarding seamless—a true testament to his professionalism and respect for the team's workflow. It was an absolute pleasure working with him. Any team would be lucky to have his talent and energy.",
      pt: "Ao dar continuidade ao trabalho do Deiver em um projeto de um cliente, fiquei realmente impressionado com sua capacidade de documentação. A clareza e a estrutura do seu handoff facilitaram minha integração ao projeto — uma demonstração do seu profissionalismo e respeito pelo fluxo de trabalho da equipe. Foi um enorme prazer trabalhar com ele. Qualquer equipe teria sorte de contar com seu talento e energia.",
    },
    highlight: {
      en: "The clarity and structure of his handoff made onboarding seamless",
      pt: "A clareza e a estrutura do seu handoff facilitaram minha integração ao projeto",
    },
  },
  {
    id: "tayron-sanches",
    name: "Tayron Sanches",
    company: "Softplan",
    image: "/images/recommendations/Tayron.png",
    originalLanguage: "pt",
    role: { en: "Product Designer", pt: "Product Designer" },
    quote: {
      en: "Deiver is a highly competent, committed, and responsible professional. Always willing to face challenges and go beyond limits. He is a great teammate and is always ready to help. His attitude is consistently positive, and his work is of high quality.",
      pt: "Deiver é um profissional de muita competência, compromisso e responsabilidade. Sempre disposto a enfrentar desafios e ir além dos limites. É um grande parceiro de equipe e sempre se prontifica a ajudar. Sua postura é sempre positiva e suas entregas de muita qualidade.",
    },
    highlight: { en: "always ready to help", pt: "sempre se prontifica a ajudar" },
  },
  {
    id: "lari-didone",
    name: "Lari Didoné",
    company: "ArcTouch",
    image: "/images/recommendations/Larissa-Lari.png",
    originalLanguage: "en",
    role: { en: "Design Manager", pt: "Gerente de Design" },
    quote: {
      en: "Deiver brings a strong UX skillset to the table, combined with a deep understanding of how and when to leverage it for optimal results. He's a natural collaborator, and his tech teams consistently rave about working alongside him. He's constantly seeking ways to improve and readily shares his knowledge with others.",
      pt: "Deiver reúne fortes competências em UX e uma compreensão profunda de como e quando aplicá-las para alcançar os melhores resultados. Ele colabora com naturalidade, e as equipes técnicas com quem trabalha sempre elogiam essa parceria. Está constantemente buscando formas de melhorar e compartilha seu conhecimento com os outros.",
    },
    highlight: {
      en: "his tech teams consistently rave about working alongside him",
      pt: "as equipes técnicas com quem trabalha sempre elogiam essa parceria",
    },
  },
  {
    id: "fabiana-biazotto",
    name: "Fabiana Biazotto",
    company: "ArcTouch",
    image: "/images/recommendations/Fabiana.jpeg",
    originalLanguage: "en",
    role: { en: "Senior Product Designer", pt: "Product Designer Sênior" },
    quote: {
      en: "His work is organized, consistent, and well-documented, making him a strategic choice for those seeking an end-to-end professional. His latest ventures with vibe coding were jaw-dropping, not only because of the great ideas he put into practice, but also because of the UX and UI refinement he achieved.",
      pt: "Seu trabalho é organizado, consistente e bem documentado, o que faz dele uma escolha estratégica para quem busca um profissional que atua de ponta a ponta. Suas explorações mais recentes com vibe coding foram impressionantes, tanto pelas ótimas ideias que colocou em prática quanto pelo refinamento de UX e UI que alcançou.",
    },
    highlight: {
      en: "the UX and UI refinement he achieved",
      pt: "pelo refinamento de UX e UI que alcançou",
    },
  },
];

function HighlightedQuote({ quote, highlight }: { quote: string; highlight: string }) {
  const start = quote.indexOf(highlight);
  if (start === -1) return quote;

  return (
    <>
      {quote.slice(0, start)}
      <strong>{highlight}</strong>
      {quote.slice(start + highlight.length)}
    </>
  );
}

function RecommendationCard({ item, locale }: { item: Recommendation; locale: Locale }) {
  const isTranslated = item.originalLanguage !== locale;

  return (
    <article className={styles.card}>
      <div className={styles.quotation}>
        <blockquote className={styles.quote}>
          <span aria-hidden="true">“</span>
          <HighlightedQuote quote={item.quote[locale]} highlight={item.highlight[locale]} />
          <span aria-hidden="true">”</span>
        </blockquote>
        {isTranslated ? <p className={styles.translationNote}>{COPY[locale].translationNote}</p> : null}
      </div>
      <div className={styles.author}>
        {/* The adjacent identification already supplies the equivalent text. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.avatar} src={item.image} alt="" width={56} height={56} loading="lazy" />
        <div className={styles.authorIdentification}>
          <div className={styles.authorInfo}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.role}>{item.role[locale]}</p>
          </div>
          <span className={styles.company}>{item.company}</span>
        </div>
      </div>
    </article>
  );
}

export interface RecommendationsProps {
  locale: Locale;
  /** Used by visual documentation; the Home always renders the collapsed state. */
  initialExpanded?: boolean;
}

export function Recommendations({ locale, initialExpanded = false }: RecommendationsProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const hiddenRecommendationsRef = useRef<HTMLDivElement>(null);
  const visibleItems = isExpanded ? RECOMMENDATIONS : RECOMMENDATIONS.slice(0, INITIAL_VISIBLE_COUNT);

  function toggleRecommendations() {
    if (isExpanded && hiddenRecommendationsRef.current?.contains(document.activeElement)) {
      document.getElementById("recommendations-toggle")?.focus();
    }
    setIsExpanded((expanded) => !expanded);
  }

  return (
    <section className={styles.section} aria-labelledby="recommendations-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="recommendations-title" className={styles.title}>{COPY[locale].title}</h2>
          <ButtonV3
            variant="tertiary"
            context="default"
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={COPY[locale].sourceLinkAriaLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/linkedin.svg" alt="" width={16} height={16} aria-hidden="true" />
            <span>{COPY[locale].sourceLink}</span>
            <Icon name="external-link" size={16} aria-hidden="true" />
          </ButtonV3>
        </header>

        <div id="recommendations-list" className={styles.grid}>
          {visibleItems.slice(0, INITIAL_VISIBLE_COUNT).map((item) => (
            <RecommendationCard key={item.id} item={item} locale={locale} />
          ))}
          {isExpanded ? (
            <div ref={hiddenRecommendationsRef} className={styles.additionalItems}>
              {visibleItems.slice(INITIAL_VISIBLE_COUNT).map((item) => (
                <RecommendationCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          ) : null}
        </div>

        <ButtonV3
          id="recommendations-toggle"
          variant="secondary"
          context="default"
          aria-expanded={isExpanded}
          aria-controls="recommendations-list"
          onClick={toggleRecommendations}
        >
          <span>{isExpanded ? COPY[locale].collapse : COPY[locale].expand}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={isExpanded ? styles.chevronExpanded : undefined}
            src="/images/icons/chevron-down.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
          />
        </ButtonV3>
      </div>
    </section>
  );
}
