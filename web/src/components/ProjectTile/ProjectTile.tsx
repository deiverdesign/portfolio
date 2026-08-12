import Link from "next/link";
import styles from "./ProjectTile.module.css";

export interface ProjectTileProps {
  name: string;
  logoSrc: string;
  /** Presente só nos tiles de case study — é o que torna o tile um link. */
  href?: string;
  /** Nome acessível do link (ex: "See case: HP Subscription Onboarding"). Só usado quando `href` existe. */
  ariaLabel?: string;
}

/**
 * Tile de projeto na página de Capabilities — o SVG já vem com o fundo
 * colorido da marca embutido (exportado do Figma pronto), então aqui é só
 * posicionar a imagem. Case studies viram link (href); "other relevant
 * work" fica estático, sem nenhuma affordance de clique.
 */
export function ProjectTile({ name, logoSrc, href, ariaLabel }: ProjectTileProps) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- tile já vem com fundo+logo compostos no próprio SVG
    <img src={logoSrc} alt={href ? "" : name} className={styles.image} width={112} height={75} />
  );

  if (href) {
    return (
      <Link href={href} className={styles.tile} aria-label={ariaLabel}>
        {image}
      </Link>
    );
  }

  return <div className={styles.tile}>{image}</div>;
}
