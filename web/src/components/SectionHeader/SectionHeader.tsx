import styles from "./SectionHeader.module.css";

export type SectionHeaderContext = "light" | "dark";
export type SectionHeaderLevel = "h1" | "h2" | "h3";

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Nível do heading gerado — escolha pelo papel real na hierarquia da página, não pelo tamanho visual. */
  level?: SectionHeaderLevel;
  /** Sobre qual fundo o cabeçalho está — mesma propriedade "Context" usada em Button/Tag/NavBar. */
  context?: SectionHeaderContext;
}

export function SectionHeader({ eyebrow, title, level = "h2", context = "light" }: SectionHeaderProps) {
  const Title = level;
  return (
    <div className={styles.header}>
      <span className={`${styles.eyebrow} ${styles[context]}`}>{eyebrow}</span>
      <Title className={`${styles.title} ${styles[context]}`}>{title}</Title>
    </div>
  );
}
