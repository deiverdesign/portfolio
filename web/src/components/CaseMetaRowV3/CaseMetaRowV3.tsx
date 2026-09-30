import type { ReactNode } from "react";

import { IconV3, type IconV3Name } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import styles from "./CaseMetaRowV3.module.css";

export interface CaseMetaRowV3Item {
  icon: IconV3Name;
  label: string;
  /** Pode ter múltiplas linhas — cada `\n` vira sua própria linha. */
  value: string;
}

export interface CaseMetaRowV3Props {
  items: CaseMetaRowV3Item[];
  compactBefore?: boolean;
}

function renderValue(value: string): ReactNode {
  const lines = value.split("\n");
  if (lines.length === 1) return value;
  return lines.map((line, index) => <span key={index}>{line}</span>);
}

/**
 * Figma: bloco "My Role" / "Collaboration" logo abaixo do hero de case,
 * ex. node 2262:65858 (SCRIOO Desktop). Estrutura genérica — qualquer
 * case pode passar 1 a N itens (hoje sempre 2: Role e Collaboration).
 */
export function CaseMetaRowV3({ items, compactBefore = false }: CaseMetaRowV3Props) {
  return (
    <div className={[styles.root, compactBefore && styles.compactBefore].filter(Boolean).join(" ")}>
      {items.map((item, index) => (
        <MotionReveal
          as="div"
          className={styles.card}
          key={item.label}
          delayMs={index * 80}
          offsetPx={40}
        >
          <span className={styles.label}>
            <IconV3 name={item.icon} size={20} />
            {item.label}
          </span>
          <img
            src="/images/v3/icons/meta-divider.svg"
            alt=""
            aria-hidden="true"
            className={styles.divider}
          />
          <span className={styles.value}>{renderValue(item.value)}</span>
        </MotionReveal>
      ))}
    </div>
  );
}
