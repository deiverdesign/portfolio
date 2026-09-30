import styles from "./CaseTypeSpecimenCard.module.css";

export interface CaseTypeSpecimenCardProps {
  labelSrc: string;
  glyphSrc: string;
  surfaceColor: string;
}

/**
 * Cartão "Noto Sans / Aa" do bloco Outcome da SCRIOO (evidência de
 * fundação de design system). Os dois SVGs são traçados exportados do
 * Figma com a cor já cravada no arquivo (`#8fed7f`, igual a
 * `--color-case-scrioo-accent`) — mesmo padrão dos ícones do IconV3, não
 * usam `currentColor`. Só o fundo é configurável.
 */
export function CaseTypeSpecimenCard({ labelSrc, glyphSrc, surfaceColor }: CaseTypeSpecimenCardProps) {
  return (
    <div className={styles.root} style={{ background: surfaceColor }}>
      <img src={labelSrc} alt="Noto Sans" className={styles.label} />
      <img src={glyphSrc} alt="" aria-hidden="true" className={styles.glyph} />
    </div>
  );
}
