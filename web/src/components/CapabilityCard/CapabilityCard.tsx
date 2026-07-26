import { Tag } from "@/components/Tag/Tag";
import { LinkTertiary } from "@/components/LinkTertiary/LinkTertiary";
import styles from "./CapabilityCard.module.css";

export interface CapabilityCardProps {
  number: string;
  title: string;
  description: string;
  tags: string[];
  linkLabel: string;
  href: string;
}

export function CapabilityCard({
  number,
  title,
  description,
  tags,
  linkLabel,
  href,
}: CapabilityCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.number}>{number}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.tagRow}>
        {tags.map((tag) => (
          <Tag key={tag} context="dark">
            {tag}
          </Tag>
        ))}
      </div>
      <div className={styles.linkAlign}>
        <LinkTertiary context="dark" href={href}>
          {linkLabel}
        </LinkTertiary>
      </div>
    </div>
  );
}
