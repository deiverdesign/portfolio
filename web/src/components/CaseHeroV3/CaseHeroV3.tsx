import type { CSSProperties } from "react";

import type { RasterAsset } from "@/content/home-assets";
import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { CaseHeroNoise } from "@/components/CaseHeroBackground/CaseHeroNoise";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import { TagV3 } from "@/components/TagV3/TagV3";
import styles from "./CaseHeroV3.module.css";

type FrameStyle = CSSProperties & {
  "--case-hero-bg-desktop"?: string;
  "--case-hero-bg-tablet"?: string;
  "--case-hero-bg-mobile"?: string;
};

export interface CaseHeroV3Props {
  locale: Locale;
  tags: string[];
  title: string;
  summary: string;
  backHref: string;
  devices: RasterAsset;
  /** Imagem de fundo (cor + gradiente + luz já incorporados) — desktop/tablet. */
  backgroundDesktop: RasterAsset;
  backgroundTablet: RasterAsset;
  /** Valor CSS (gradient() ou url()) para o mobile, que pode não ter imagem exportada. */
  backgroundMobile: string;
  /** Cor do grão que passa por cima do fundo — mesmo padrão do CaseHeroBackground. */
  noiseColor: string;
  /** Desabilitados até existir mais de um case publicado. */
  prevCaseHref?: string;
  nextCaseHref?: string;
}

/**
 * Figma: seção SCRIOO na página `Update-Incremental`, nodes 2262:65858
 * (Desktop), 2262:66000 (Laptop), 2262:66168 (Tablet), 2262:66324 (Mobile).
 *
 * Simplificação assumida: no desktop/tablet o fundo é a imagem exportada
 * (contrato de hero background do V3-HANDOFF.md); no mobile não existe
 * imagem — é o gradiente radial puro (--gradient-case-scrioo-hero-mobile).
 * O grão (CaseHeroNoise) é aplicado por cima nos três breakpoints para dar
 * a mesma textura, mesmo a imagem já tendo grão de foto embutido.
 */
export function CaseHeroV3({
  locale,
  tags,
  title,
  summary,
  backHref,
  devices,
  backgroundDesktop,
  backgroundTablet,
  backgroundMobile,
  noiseColor,
  prevCaseHref,
  nextCaseHref,
}: CaseHeroV3Props) {
  const frameStyle: FrameStyle = {
    "--case-hero-bg-desktop": `url(${backgroundDesktop.src})`,
    "--case-hero-bg-tablet": `url(${backgroundTablet.src})`,
    "--case-hero-bg-mobile": backgroundMobile,
  };

  return (
    <section className={styles.root}>
      <div className={styles.frame} style={frameStyle}>
        <CaseHeroNoise color={noiseColor} />
        <div className={styles.content}>
          <nav className={styles.topNav} aria-label={getCopy(locale, "shared.case.other")}>
            <a href={backHref} className={styles.backLink}>
              <IconV3 name="arrow-left" size={16} />
              {getCopy(locale, "shared.case.back")}
            </a>
            <div className={styles.otherCases}>
              <span className={styles.otherCasesLabel}>{getCopy(locale, "shared.case.other")}</span>
              <a
                href={prevCaseHref}
                aria-disabled={!prevCaseHref}
                className={styles.navArrow}
                tabIndex={prevCaseHref ? 0 : -1}
              >
                <IconV3 name="arrow-left" size={16} />
              </a>
              <a
                href={nextCaseHref}
                aria-disabled={!nextCaseHref}
                className={styles.navArrow}
                tabIndex={nextCaseHref ? 0 : -1}
              >
                <IconV3 name="arrow-right" size={16} />
              </a>
            </div>
          </nav>

          <div className={styles.body}>
            <div className={styles.textBlock}>
              <MotionReveal as="div" className={styles.tags} triggerIfInitiallyVisible>
                {tags.map((tag) => (
                  <TagV3 key={tag} label={tag} />
                ))}
              </MotionReveal>
              <MotionReveal as="h1" className={styles.title} delayMs={80} triggerIfInitiallyVisible>
                {title}
              </MotionReveal>
              <MotionReveal as="p" className={styles.summary} delayMs={160} triggerIfInitiallyVisible>
                {summary}
              </MotionReveal>
            </div>
            <MotionReveal
              as="div"
              className={styles.devices}
              delayMs={240}
              offsetPx={40}
              triggerIfInitiallyVisible
            >
              <img src={devices.src} width={devices.width} height={devices.height} alt="" />
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
