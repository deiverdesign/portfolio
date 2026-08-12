"use client";

import { useEffect, useState, type CSSProperties } from "react";
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

const SLOT_COUNT = 6;
/* Valores derivados do mecanismo real do client-list da instrument.com/services
   (lido no bundle: ClientListRotator.js) — lá cada slot fixo troca de logo a
   cada 2500ms, com fade de 300ms (igual pra entrar/sair) e um atraso de
   col*100ms por coluna pra não trocar tudo no mesmo instante. Pedido do
   Deiver: sumiço 25% mais rápido (300 * 0.75) que aquele site; tempo em tela
   ajustado manualmente pra 5000ms. */
const HOLD_MS = 5000;
const FADE_IN_MS = 300;
const FADE_OUT_MS = 225;
const STAGGER_MS = 100;

/** Reparte a lista em N grupos por posição (0,6,12... -> slot 0; 1,7,13... -> slot 1...), igual ao "e % 6" da instrument.com. */
function groupIntoSlots(brands: Brand[], slotCount: number): Brand[][] {
  const slots: Brand[][] = Array.from({ length: slotCount }, () => []);
  brands.forEach((brand, i) => slots[i % slotCount].push(brand));
  return slots;
}

interface LogoSlotProps {
  logos: Brand[];
  columnIndex: number;
  isPlaying: boolean;
}

/**
 * Um slot fixo: todas as logos daquela coluna ficam empilhadas na mesma
 * posição (position:absolute), e só a marca "ativa" fica com opacity:1 —
 * nada se move de lado, uma marca some enquanto a próxima aparece por cima.
 */
function LogoSlot({ logos, columnIndex, isPlaying }: LogoSlotProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying || logos.length <= 1) return;
    /* sem movimento: a marca fica parada na primeira da lista, em vez de
       trocar sozinha de tempos em tempos (mesmo congelando via CSS, o
       conteúdo mudando de tempos em tempos ainda seria "movimento"). */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const advance = () => setActiveIndex((prev) => (prev + 1) % logos.length);

    /* o atraso por coluna precisa se repetir em TODA troca, não só na
       primeira — é o que faz a esquerda sempre sumir antes da direita, a
       cada ciclo (não só uma vez no começo). Por isso "tick" (que agenda
       o advance com esse atraso) roda de novo a cada HOLD_MS, em vez de
       um setInterval chamando advance direto. */
    let swapTimeout: number;
    const tick = () => {
      swapTimeout = window.setTimeout(advance, columnIndex * STAGGER_MS);
    };
    tick();
    const cycleInterval = window.setInterval(tick, HOLD_MS);

    return () => {
      window.clearTimeout(swapTimeout);
      window.clearInterval(cycleInterval);
    };
  }, [isPlaying, logos.length, columnIndex]);

  return (
    <div
      className={styles.slot}
      style={{ "--fade-in": `${FADE_IN_MS}ms`, "--fade-out": `${FADE_OUT_MS}ms` } as CSSProperties}
    >
      {logos.map((brand, i) => (
        <span key={brand.name} className={`${styles.slotLogo} ${i === activeIndex ? styles.slotLogoActive : ""}`}>
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
  );
}

export function BrandsSection({ eyebrow, caption, brands, playLabel, pauseLabel }: BrandsSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const slots = groupIntoSlots(brands, SLOT_COUNT);

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

      <div className={styles.slots}>
        {slots.map((logos, columnIndex) => (
          <LogoSlot key={columnIndex} logos={logos} columnIndex={columnIndex} isPlaying={isPlaying} />
        ))}
      </div>

      <div className={styles.divider} />
    </section>
  );
}
