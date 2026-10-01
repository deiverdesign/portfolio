"use client";

import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { CarouselIndicatorsV3 } from "@/components/CarouselIndicatorsV3/CarouselIndicatorsV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import type { RasterAsset } from "@/content/home-assets";
import { useRailCarousel } from "@/hooks/useRailCarousel";
import styles from "./CaseLimitsV3.module.css";

export interface CaseLimitsV3Item { name: string; missing: string; why: string; status: string; banner: RasterAsset; }
export interface CaseLimitsV3Props { eyebrow: string; title: string; body: string; items: CaseLimitsV3Item[]; statement: string; footnoteLead: string; footnoteList: string; overview: RasterAsset; }

export function CaseLimitsV3({ eyebrow, title, body, items, statement, footnoteLead, footnoteList, overview }: CaseLimitsV3Props) {
  const { railRef, activePage, pageCount, goToPage, scrollByPage, handleScroll } = useRailCarousel<HTMLDivElement>();
  return <section className={styles.section}>
    <div className={styles.intro}><div className={styles.copy}><EyebrowV3>{eyebrow}</EyebrowV3><MotionReveal as="h2" className={styles.title}>{title}</MotionReveal><MotionReveal as="p" className={styles.body}>{body}</MotionReveal></div><MotionReveal as="div"><img className={styles.overview} src={overview.src} width={overview.width} height={overview.height} alt="" /></MotionReveal></div>
    <div className={styles.rail} ref={railRef} onScroll={handleScroll}><div className={styles.cards}>{items.map((item, index) => <MotionReveal as="article" className={styles.card} key={item.name} delayMs={index * 80}><img src={item.banner.src} width={item.banner.width} height={item.banner.height} alt="" /><div className={styles.cardBody}><h3>{item.name}</h3><div className={styles.field}><span>What was missing</span><p>{item.missing}</p></div><div className={styles.divider}/><div className={styles.evidence}><div className={styles.field}><span>Why it mattered</span><p>{item.why}</p></div><div className={styles.field}><span>Status</span><p className={styles.status}>{item.status}</p></div></div></div></MotionReveal>)}</div></div>
    <div className={styles.controls}><div className={styles.dots}><CarouselIndicatorsV3 count={pageCount} activeIndex={activePage} onSelect={goToPage} getLabel={(index) => `Page ${index + 1}`}/></div><div className={styles.arrows}><ButtonV3 variant="secondary" size="medium" className={styles.arrowButton} onClick={() => scrollByPage(-1)} disabled={activePage === 0} aria-label="Previous"><IconV3 name="arrow-left" size={20}/></ButtonV3><ButtonV3 variant="secondary" size="medium" className={styles.arrowButton} onClick={() => scrollByPage(1)} disabled={activePage === pageCount - 1} aria-label="Next"><IconV3 name="arrow-right" size={20}/></ButtonV3></div></div>
    <div className={styles.close}><p className={styles.statement}>{statement}</p><p className={styles.footnote}><strong>{footnoteLead}</strong> {footnoteList}</p></div>
  </section>;
}
