"use client";

import { useCallback, useEffect, useRef, useState, type TransitionEvent } from "react";

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
  /** Desliga a coreografia e entrega diretamente o hero final. */
  introEnabled?: boolean;
  /** `null` desliga a memória de sessão, útil para specimens e testes. */
  sessionKey?: string | null;
}

const DEFAULT_SESSION_KEY = "portfolio-v3-home-intro-complete";
const CONTENT_REVEAL_MS = 720;

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
  introEnabled = true,
  sessionKey = DEFAULT_SESSION_KEY,
}: HomeIntroV3Props) {
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    },
    [],
  );

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
    <div className={styles.root} data-phase={phase}>
      <HomeHeroV3 locale={locale} contentVisible={contentVisible} />

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
