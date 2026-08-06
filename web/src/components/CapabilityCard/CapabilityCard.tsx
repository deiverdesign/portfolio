"use client";

import type { CSSProperties } from "react";
import { Tag } from "@/components/Tag/Tag";
import { LinkTertiary } from "@/components/LinkTertiary/LinkTertiary";
import { useInView } from "@/hooks/useInView";
import styles from "./CapabilityCard.module.css";

export interface CapabilityCardProps {
  number: string;
  title: string;
  description: string;
  tags: string[];
  linkLabel: string;
  href: string;
  /** Posição do card na grid — só usada pro stagger de entrada no viewport (70ms por item). */
  revealIndex?: number;
}

export function CapabilityCard({
  number,
  title,
  description,
  tags,
  linkLabel,
  href,
  revealIndex,
}: CapabilityCardProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const classes = [styles.card, isInView && styles.isVisible].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      style={revealIndex !== undefined ? ({ "--reveal-delay": `${revealIndex * 70}ms` } as CSSProperties) : undefined}
    >
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
