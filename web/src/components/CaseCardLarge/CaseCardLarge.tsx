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
  href: string;
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
}: CaseCardLargeProps) {
  const visibleTags = tags.slice(0, maxVisibleTags);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <a href={href} className={styles.card}>
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem só de demonstração, sem otimização por enquanto
        <img src={imageSrc} alt={imageAlt} className={styles.image} />
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
