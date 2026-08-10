"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { RevealMask } from "@/components/RevealMask/RevealMask";
import styles from "./BrandsSection.module.css";

export interface Brand {
  name: string;
  /** Caminho do SVG em /public — se não existir ainda, mostra o nome como wordmark de texto. */
  src?: string;
  width: number;
  height: number;
  /** Ajuste manual de tamanho pra essa marca específica (1 = tamanho normal). A altura do slot é fixa (40px pra todas), então isso é o único jeito de deixar uma logo menor sem mexer nas outras. */
  scale?: number;
}

export interface BrandsSectionProps {
  eyebrow: string;
  caption: string;
  brands: Brand[];
  playLabel: string;
  pauseLabel: string;
}

/**
 * Fileira de marcas com scroll contínuo (estilo arctouch.com) — a lista
 * de logos aparece duas vezes seguidas no track; andar exatamente -50%
 * fecha o loop sem emenda visível. Pausa via animation-play-state (não
 * para/reinicia o CSS, só congela o quadro atual).
 */
export function BrandsSection({ eyebrow, caption, brands, playLabel, pauseLabel }: BrandsSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const track = [...brands, ...brands];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>
            <RevealMask>{eyebrow}</RevealMask>
          </h2>
          <p className={styles.caption}>{caption}</p>
        </div>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => setIsPlaying((prev) => !prev)}
          aria-label={isPlaying ? pauseLabel : playLabel}
          aria-pressed={!isPlaying}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={14} />
        </button>
      </div>

      <div className={styles.row}>
        <div className={`${styles.track} ${isPlaying ? styles.playing : styles.paused}`}>
          {track.map((brand, i) => (
            <span key={`${brand.name}-${i}`} className={styles.logo} aria-hidden={i >= brands.length}>
              {brand.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo de marca, tamanho fixo pequeno
                <img
                  src={brand.src}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  className={styles.logoImage}
                  style={brand.scale ? { transform: `scale(${brand.scale})` } : undefined}
                />
              ) : (
                <span className={styles.logoPlaceholder}>{brand.name}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.divider} />
    </section>
  );
}
