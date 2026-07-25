import { Tag } from "@/components/Tag/Tag";
import styles from "./CaseCardLarge.module.css";

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
  /** Largura real do print salvo (não do card), pra cortar certo. Ver CaseCardLarge.module.css. */
  imageNativeWidth?: number;
  href: string;
  /** Só o card que sobra sozinho na última linha recebe isso — decisão manual por página, ver responsive-rules.md. */
  maxWidth?: number;
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
  imageNativeWidth = 413.33,
  href,
  maxWidth,
}: CaseCardLargeProps) {
  const visibleTags = tags.slice(0, maxVisibleTags);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <a
      href={href}
      className={styles.card}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem só de demonstração, sem otimização por enquanto
        <img
          src={imageSrc}
          alt={imageAlt}
          className={styles.image}
          style={{ aspectRatio: `${imageNativeWidth} / 260` }}
        />
      ) : (
        <div className={styles.image} role="img" aria-label={imageAlt} />
      )}
      <div className={styles.content}>
        <span className={styles.number}>{number}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.tagRow}>
          {visibleTags.map((tag) => (
            <Tag key={tag} context="light">
              {tag}
            </Tag>
          ))}
          {hiddenCount > 0 && (
            <Tag context="light">+{hiddenCount} more</Tag>
          )}
        </div>
        <span className={styles.link}>
          See case <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
