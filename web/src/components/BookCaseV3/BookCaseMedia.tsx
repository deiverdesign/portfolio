"use client";

import { CarouselIndicatorsV3 } from "@/components/CarouselIndicatorsV3/CarouselIndicatorsV3";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/content/i18n";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import styles from "./BookCaseV3.module.css";

export function BookVideo({
  src,
  poster,
  mobileSrc,
  mobilePoster,
  label,
  locale,
  loop = true,
}: {
  src: string;
  poster: string;
  mobileSrc?: string;
  mobilePoster?: string;
  label: string;
  locale: Locale;
  loop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const paused = useRef(false);
  const observerPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 599px)");
    let visible = false;
    function update() {
      if (visible && !reduce.matches && !paused.current && !document.hidden)
        void el!.play().catch(() => undefined);
      else if (!el!.paused) {
        observerPause.current = true;
        el!.pause();
      }
    }
    const observer = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        update();
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    function selectPoster() {
      el!.poster = compact.matches && mobilePoster ? mobilePoster : poster;
    }
    function resizeSource() {
      selectPoster();
      if (mobileSrc) {
        observerPause.current = !el!.paused;
        el!.load();
        update();
      }
    }
    selectPoster();
    compact.addEventListener("change", resizeSource);
    reduce.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      compact.removeEventListener("change", resizeSource);
      reduce.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      observerPause.current = !el.paused;
      el.pause();
    };
  }, [src, poster, mobileSrc, mobilePoster]);
  return (
    <div className={[styles.videoFrame, mobileSrc ? styles.mobileVideo : ""].join(" ")}>
      <video
        ref={ref}
        poster={poster}
        muted
        loop={loop}
        playsInline
        preload="none"
        controls
        aria-label={label}
        onPlay={() => {
          paused.current = false;
          setPlaying(true);
        }}
        onPause={() => {
          if (!observerPause.current) paused.current = true;
          observerPause.current = false;
          setPlaying(false);
        }}
        onError={() => setFailed(true)}
      >
        {mobileSrc ? <source media="(max-width: 599px)" src={mobileSrc} type="video/mp4"/> : null}
        <source src={src} type="video/mp4"/>
      </video>
      <button
        className={styles.videoToggle}
        type="button"
        aria-label={
          (playing
            ? locale === "pt"
              ? "Pausar"
              : "Pause"
            : locale === "pt"
              ? "Reproduzir"
              : "Play") +
          ": " +
          label
        }
        onClick={() => {
          const el = ref.current;
          if (!el) return;
          if (el.paused) {
            paused.current = false;
            void el.play().catch(() => undefined);
          } else {
            paused.current = true;
            el.pause();
          }
        }}
      >
        {playing
          ? locale === "pt"
            ? "Pausar"
            : "Pause"
          : locale === "pt"
            ? "Reproduzir"
            : "Play"}
      </button>
      {failed ? (
        <a href={src}>{locale === "pt" ? "Abrir vídeo" : "Open video"}</a>
      ) : null}
    </div>
  );
}
export function BookCarousel({
  children,
  captions,
  locale,
}: {
  children: ReactNode[];
  captions: string[];
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(i: number) {
    const rail = ref.current;
    if (!rail) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const item = rail.children[i] as HTMLElement;
    rail.scrollTo({
      left:
        item.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft,
      behavior: reduce ? "instant" : "smooth",
    });
  }
  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={locale === "pt" ? "Estudos técnicos" : "Technical studies"}
    >
      <div
        ref={ref}
        className={styles.rail}
        tabIndex={0}
        aria-label={
          locale === "pt"
            ? "Cards técnicos; use as setas para navegar"
            : "Technical cards; use arrow keys to navigate"
        }
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(Math.min(active + 1, children.length - 1));
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(Math.max(active - 1, 0));
          }
        }}
        onScroll={() => {
          const rail = ref.current;
          if (!rail) return;
          const left = rail.getBoundingClientRect().left;
          const distances = Array.from(rail.children).map((el) =>
            Math.abs(el.getBoundingClientRect().left - left),
          );
          setActive(distances.indexOf(Math.min(...distances)));
        }}
      >
        {children.map((child, i) => (
          <figure
            key={i}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${children.length}`}
          >
            {child}
            <figcaption>{captions[i]}</figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.carouselControls}>
        <CarouselIndicatorsV3
          count={children.length}
          activeIndex={active}
          onSelect={go}
          getLabel={(i) => (locale === "pt" ? "Ver card " : "View card ") + (i + 1)}
        />
        <span aria-live="polite">
          {active + 1} / {children.length}
        </span>
        <ButtonV3
          variant="secondary"
          size="medium"
          disabled={active === 0}
          onClick={() => go(active - 1)}
          aria-label={locale === "pt" ? "Anterior" : "Previous"}
        >
          <IconV3 name="arrow-left" size={16} />
        </ButtonV3>
        <ButtonV3
          variant="secondary"
          size="medium"
          disabled={active === children.length - 1}
          onClick={() => go(active + 1)}
          aria-label={locale === "pt" ? "Próximo" : "Next"}
        >
          <IconV3 name="arrow-right" size={16} />
        </ButtonV3>
      </div>
    </div>
  );
}
