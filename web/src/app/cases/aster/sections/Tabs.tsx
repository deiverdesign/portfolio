"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  label: string;
}

/**
 * Tabs acessíveis (padrão WAI-ARIA Tabs, ativação automática): setas
 * esquerda/direita e Home/End navegam entre abas, cada painel só existe
 * uma vez no DOM (não duplica conteúdo pra leitor de tela).
 */
export function Tabs({ items, label }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const nextIndex = (index + items.length) % items.length;
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(items.length - 1);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div role="tablist" aria-label={label} className={styles.tablist}>
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={onKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={index !== activeIndex}
          className={styles.panel}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
