"use client";

import { useState, type CSSProperties, type TransitionEvent } from "react";
import { Tag } from "@/components/Tag/Tag";
import { useInView } from "@/hooks/useInView";
import styles from "./CaseCardLarge.module.css";

export type CaseCardLocale = "pt" | "en";

const STRINGS: Record<CaseCardLocale, {
  viewCase: string;
  passwordProtectedSuffix: string;
  passwordProtectedBadge: string;
  seeCase: string;
  more: (count: number) => string;
}> = {
  pt: {
    viewCase: "Ver case",
    passwordProtectedSuffix: " (protegido por senha)",
    passwordProtectedBadge: "Protegido por senha",
    seeCase: "Ver case",
    more: (count) => `+${count} mais`,
  },
  en: {
    viewCase: "See case",
    passwordProtectedSuffix: " (password protected)",
    passwordProtectedBadge: "Password protected",
    seeCase: "See case",
    more: (count) => `+${count} more`,
  },
};

export interface CaseCardLargeProps {
  number: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  /** Quantas tags mostrar antes de resumir o resto em "+N more". Ver responsive-rules.md. */
  maxVisibleTags?: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
  /** Só o card que sobra sozinho na última linha recebe isso — decisão manual por página, ver responsive-rules.md. */
  maxWidth?: number;
  /** Case protegido por senha (ex: ASTER) — mostra um indicador "Password protected" no card público. */
  locked?: boolean;
  /** Idioma dos textos fixos do card (aria-label, badge, "See case", "+N more"). */
  locale?: CaseCardLocale;
  /** Ponto da imagem que fica visível quando ela é cortada pra caber nos 260px de altura. "top" (padrão) funciona bem pra screenshots de produto, onde o conteúdo importante fica no topo; "center" evita cortar imagens com um elemento centralizado (ex: ícone/ilustração), como a capa do ASTER. */
  imagePosition?: "top" | "center";
  /** Posição do card na grid — só usada pro stagger de entrada no viewport (70ms por item). */
  revealIndex?: number;
  /** Logo do cliente (mesmos arquivos da seção de marcas) — aparece no
      lugar do número quando existe. Sem isso, mostra o número normal. */
  logoSrc?: string;
  logoAlt?: string;
  /** Ajuste manual de tamanho pra esse logo específico (1 = tamanho normal). */
  logoScale?: number;
}

export function CaseCardLarge({
  number,
  title,
  summary,
  description,
  tags,
  maxVisibleTags = 3,
  imageSrc,
  imageAlt,
  href,
  maxWidth,
  locked = false,
  locale = "pt",
  imagePosition = "top",
  revealIndex,
  logoSrc,
  logoAlt,
  logoScale,
}: CaseCardLargeProps) {
  const t = STRINGS[locale];
  const visibleTags = tags.slice(0, maxVisibleTags);
  const hiddenCount = tags.length - visibleTags.length;
  const { ref, isInView } = useInView<HTMLAnchorElement>();
  const [hasEntered, setHasEntered] = useState(false);
  const classes = [styles.card, isInView && styles.isVisible, hasEntered && styles.hasEntered]
    .filter(Boolean)
    .join(" ");

  const handleTransitionEnd = (event: TransitionEvent<HTMLAnchorElement>) => {
    if (event.target === event.currentTarget && event.propertyName === "opacity") {
      setHasEntered(true);
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      style={
        {
          ...(maxWidth ? { maxWidth } : undefined),
          ...(revealIndex !== undefined ? { "--reveal-delay": `${revealIndex * 70}ms` } : undefined),
        } as CSSProperties
      }
      onTransitionEnd={handleTransitionEnd}
      aria-label={`${t.viewCase}: ${title}${locked ? t.passwordProtectedSuffix : ""}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem só de demonstração, sem otimização por enquanto
        <img
          src={imageSrc}
          alt={imageAlt}
          className={styles.image}
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        <div className={styles.image} role="img" aria-label={imageAlt} />
      )}
      <div className={styles.content}>
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- logo pequeno, mesmo padrão da fileira de marcas
          <img
            src={logoSrc}
            alt={logoAlt ?? ""}
            className={styles.logo}
            style={logoScale ? { transform: `scale(${logoScale})`, transformOrigin: "left center" } : undefined}
          />
        ) : (
          <span className={styles.number}>{number}</span>
        )}
        <h3 className={styles.title}>
          {title}
          {locked && (
            <span className={styles.lockedBadge}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <rect x="3" y="6.5" width="8" height="6" rx="1" />
                <path d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              {t.passwordProtectedBadge}
            </span>
          )}
        </h3>
        <p className={styles.summary}>{summary}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.tagRow}>
          {visibleTags.map((tag) => (
            <Tag key={tag} context="light">
              {tag}
            </Tag>
          ))}
          {hiddenCount > 0 && (
            <Tag context="light">{t.more(hiddenCount)}</Tag>
          )}
        </div>
        <span className={styles.link}>
          {t.seeCase} <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
