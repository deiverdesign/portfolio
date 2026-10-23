"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import styles from "./loader.module.css";
import { SCENE_READY_EVENT, isSceneReady } from "./sceneReady";

// Loader real (Deiver, 23/10): fica na tela até a primeira cena 3D estar baixada e desenhada.
// Ex.: no 4G, enquanto a Rua baixa os modelos e as texturas, a lata continua girando.
// O fundo e o texto vêm no HTML do servidor, então aparecem antes de qualquer JavaScript.
const MOTION_URL = "/enquanto-durar-a-fe/loader-lata.json?v=1";
// Primeiro quadro da lata (tampa de frente), já no HTML: no 4G o player chega uns segundos
// depois do fundo, e sem isso o círculo ficaria vazio até lá.
const POSTER_URL = "/enquanto-durar-a-fe/loader-lata-poster.webp?v=1";
// Mesmo numa conexão rápida, o loader fica pelo menos 2 s (Deiver, 23/10), para a lata girar.
const MIN_VISIBLE_MS = 2000;
// Trava de segurança: se algum arquivo travar, o site aparece com o que já carregou.
const MAX_VISIBLE_MS = 25000;
const FADE_MS = 450;

export function HotsiteLoader({ fontFamily }: { fontFamily?: string }) {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const motionRef = useRef<HTMLDivElement>(null);
  preload(POSTER_URL, { as: "image", fetchPriority: "high" });
  preload(MOTION_URL, { as: "fetch", crossOrigin: "anonymous" });

  // Enquanto o loader está na tela, a página não rola por baixo dele.
  useEffect(() => {
    if (hidden) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [hidden]);

  useEffect(() => {
    let finished = false;
    let minTimer: number | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      // O mínimo conta desde o começo da navegação, que é quando o loader já está na tela.
      const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
      minTimer = window.setTimeout(() => setHidden(true), wait);
    };
    const maxTimer = window.setTimeout(finish, Math.max(0, MAX_VISIBLE_MS - performance.now()));
    if (isSceneReady()) finish();
    else window.addEventListener(SCENE_READY_EVENT, finish, { once: true });
    return () => {
      window.removeEventListener(SCENE_READY_EVENT, finish);
      window.clearTimeout(maxTimer);
      window.clearTimeout(minTimer);
    };
  }, []);

  useEffect(() => {
    if (!hidden) return;
    const timer = window.setTimeout(() => setRemoved(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  // A lata: o player e o arquivo do motion chegam depois do fundo e do texto.
  useEffect(() => {
    const container = motionRef.current;
    if (!container) return;
    let disposed = false;
    let destroy: (() => void) | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    Promise.all([
      import("lottie-web/build/player/lottie_light"),
      fetch(MOTION_URL).then((response) => response.json()),
    ])
      .then(([{ default: lottie }, animationData]) => {
        if (disposed) return;
        const animation = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: !reducedMotion,
          animationData,
        });
        // Menos movimento: só o primeiro quadro, a lata de frente.
        if (reducedMotion) animation.goToAndStop(0, true);
        animation.addEventListener("DOMLoaded", () => setMotionReady(true));
        destroy = () => animation.destroy();
      })
      .catch(() => {
        // Sem o motion, o círculo e o texto continuam indicando o carregamento.
      });
    return () => {
      disposed = true;
      destroy?.();
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`${styles.loader} ${hidden ? styles.hidden : ""}`} role="status" aria-live="polite" aria-busy={!hidden}>
      {/* Sem JavaScript a cena 3D não roda; o loader não pode ficar cobrindo a página. */}
      <noscript>
        <style>{`.${styles.loader}{display:none}`}</style>
      </noscript>
      <div className={styles.content}>
        <div className={styles.badge} aria-hidden="true">
          {!motionReady && (
            // eslint-disable-next-line @next/next/no-img-element -- quadro fixo de 9 KB, precisa estar no HTML
            <img className={styles.motion} src={POSTER_URL} width={70} height={70} alt="" />
          )}
          <div className={styles.motion} ref={motionRef} />
        </div>
        <p className={styles.label} style={{ fontFamily }}>Loading...</p>
      </div>
    </div>
  );
}
