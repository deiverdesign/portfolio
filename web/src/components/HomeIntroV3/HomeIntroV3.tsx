"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

import type { Locale } from "@/content/i18n";
import { HexagonIntro } from "@/components/HexagonIntro/HexagonIntro";
import { HomeHeroV3 } from "@/components/HomeHeroV3/HomeHeroV3";
import styles from "./HomeIntroV3.module.css";

type IntroPhase =
  | "checking"
  | "intro"
  | "horizontal"
  | "vertical"
  | "reveal"
  | "complete"
  | "skipped";

export interface HomeIntroV3Props {
  locale: Locale;
  homeHref?: string;
  aboutHref?: string;
  languageHref?: string;
  /** Desliga a coreografia e entrega diretamente o hero final. */
  introEnabled?: boolean;
  /** `null` desliga a memória de sessão, útil para specimens e testes. */
  sessionKey?: string | null;
}

const DEFAULT_SESSION_KEY = "portfolio-v3-home-intro-complete";
const CONTENT_REVEAL_MS = 720;
const SCROLL_RELEASE_RATIO = 0.7;
const HERO_LAST_REVEAL_DELAY_MS = 120;

const BLOCKED_SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);

function hasCompletedSession(key: string | null) {
  if (!key) return false;
  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function rememberCompletedSession(key: string | null) {
  if (!key) return;
  try {
    window.sessionStorage.setItem(key, "true");
  } catch {
    // Storage pode estar indisponível em modos de privacidade. A intro ainda
    // funciona; ela apenas poderá reaparecer numa navegação futura.
  }
}

/**
 * Orquestra o handoff aprovado da identidade para a Home:
 * DEIVER → quadrado → expansão horizontal → expansão vertical → hero.
 */
export function HomeIntroV3({
  locale,
  homeHref,
  aboutHref,
  languageHref,
  introEnabled = true,
  sessionKey = DEFAULT_SESSION_KEY,
}: HomeIntroV3Props) {
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const [scrollReleaseReached, setScrollReleaseReached] = useState(false);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const chooseInitialState = () => {
      if (!introEnabled || reducedMotion.matches || hasCompletedSession(sessionKey)) {
        setPhase("skipped");
      } else {
        setPhase("intro");
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) setPhase("skipped");
    };

    chooseInitialState();
    reducedMotion.addEventListener("change", handleReducedMotionChange);
    return () => reducedMotion.removeEventListener("change", handleReducedMotionChange);
  }, [introEnabled, sessionKey]);

  useEffect(
    () => () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      if (scrollReleaseTimerRef.current) clearTimeout(scrollReleaseTimerRef.current);
    },
    [],
  );

  /* Durante a abertura, o conteúdo abaixo do hero já existe no DOM (para
     evitar um salto de layout), mas não deve poder ser alcançado por wheel,
     touch ou teclado. A rolagem só volta depois de 70% da entrada do header e
     do conteúdo do hero — o restante da animação continua livre e natural. */
  useEffect(() => {
    if (scrollReleaseTimerRef.current) {
      clearTimeout(scrollReleaseTimerRef.current);
      scrollReleaseTimerRef.current = null;
    }

    if (phase === "reveal") {
      scrollReleaseTimerRef.current = setTimeout(
        () => setScrollReleaseReached(true),
        HERO_LAST_REVEAL_DELAY_MS + CONTENT_REVEAL_MS * SCROLL_RELEASE_RATIO,
      );
    }
  }, [phase]);

  const scrollLocked =
    phase !== "skipped" &&
    phase !== "complete" &&
    (phase !== "reveal" || !scrollReleaseReached);

  useLayoutEffect(() => {
    if (!scrollLocked) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previous = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: documentElement.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    const preventScrollKey = (event: KeyboardEvent) => {
      if (BLOCKED_SCROLL_KEYS.has(event.key)) event.preventDefault();
    };
    const preventTouchScroll = (event: TouchEvent) => event.preventDefault();

    window.addEventListener("keydown", preventScrollKey, { passive: false });
    window.addEventListener("touchmove", preventTouchScroll, { passive: false });
    return () => {
      window.removeEventListener("keydown", preventScrollKey);
      window.removeEventListener("touchmove", preventTouchScroll);
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.overflow = previous.bodyOverflow;
      documentElement.style.overflow = previous.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [scrollLocked]);

  const finishReveal = useCallback(() => {
    rememberCompletedSession(sessionKey);
    setPhase("complete");
  }, [sessionKey]);

  const beginReveal = useCallback(() => {
    setPhase("reveal");
    revealTimerRef.current = setTimeout(finishReveal, CONTENT_REVEAL_MS);
  }, [finishReveal]);

  const handleHandoffTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (phase === "horizontal" && event.propertyName === "width") {
      setPhase("vertical");
      return;
    }

    if (phase === "vertical" && event.propertyName === "height") {
      beginReveal();
    }
  };

  const contentVisible = phase === "reveal" || phase === "complete" || phase === "skipped";
  const overlayVisible = phase !== "reveal" && phase !== "complete" && phase !== "skipped";

  return (
    <div
      className={styles.root}
      data-phase={phase}
      data-home-intro-scroll-locked={scrollLocked ? "true" : undefined}
    >
      <HomeHeroV3
        locale={locale}
        homeHref={homeHref}
        aboutHref={aboutHref}
        languageHref={languageHref}
        contentVisible={contentVisible}
      />

      {overlayVisible && (
        <div className={styles.curtain} aria-hidden="true">
          {phase === "intro" && (
            <HexagonIntro
              className={styles.introStage}
              autoPlay
              loop={false}
              direction="reverse"
              introHoldMs={0}
              loaderCycles={0}
              loaderCycleMs={2_150}
              rotationMs={1_040}
              resolveMs={1_500}
              finalHoldMs={1_650}
              onComplete={() => setPhase("horizontal")}
            />
          )}

          <div
            className={styles.handoff}
            data-phase={phase}
            onTransitionEnd={handleHandoffTransitionEnd}
          />
        </div>
      )}
    </div>
  );
}
