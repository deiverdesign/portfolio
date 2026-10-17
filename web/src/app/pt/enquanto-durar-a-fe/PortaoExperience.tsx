"use client";

import { useEffect, useRef } from "react";
import styles from "./portao.module.css";

function Tree({ className }: { className: string }) {
  return (
    <div className={`${styles.tree} ${className}`} aria-hidden="true">
      <i />
      <b />
      <em />
    </div>
  );
}

function City() {
  return (
    <div className={styles.city} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <b />
    </div>
  );
}

function Jota() {
  return (
    <div className={styles.jota} aria-label="Silhueta simples de Jota, diante do portão">
      <span className={styles.head} />
      <span className={styles.torso} />
      <span className={styles.arm} />
      <span className={styles.bag} />
      <span className={styles.bible}>BÍBLIA</span>
      <span className={styles.legLeft} />
      <span className={styles.legRight} />
    </div>
  );
}

function House() {
  return (
    <div className={styles.house} aria-hidden="true">
      <i className={styles.roof} />
      <i className={styles.houseMain} />
      <i className={styles.porch} />
      <i className={styles.windowOne} />
      <i className={styles.windowTwo} />
      <i className={styles.door} />
    </div>
  );
}

export function PortaoExperience() {
  const experienceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const experience = experienceRef.current;
    if (!experience) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const setProgress = () => {
      const bounds = experience.getBoundingClientRect();
      const distance = Math.max(experience.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / distance));
      experience.style.setProperty("--scroll-progress", progress.toFixed(4));
      frame = 0;
    };

    const requestProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(setProgress);
    };

    const setReducedMotion = () => {
      if (motionQuery.matches) {
        experience.dataset.reducedMotion = "true";
        experience.style.setProperty("--scroll-progress", "0.64");
        window.removeEventListener("scroll", requestProgress);
      } else {
        delete experience.dataset.reducedMotion;
        window.addEventListener("scroll", requestProgress, { passive: true });
        requestProgress();
      }
    };

    setReducedMotion();
    window.addEventListener("resize", requestProgress);
    motionQuery.addEventListener("change", setReducedMotion);

    return () => {
      window.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", requestProgress);
      motionQuery.removeEventListener("change", setReducedMotion);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className={styles.experience} ref={experienceRef}>
      <header className={styles.header}>
        <p>
          <span>Enquanto durar a fé</span>
          <small>um romance de Deiver Brito</small>
        </p>
        <a href="#fim">Ler na Amazon <span aria-hidden="true">↗</span></a>
      </header>

      <section className={styles.stage} aria-labelledby="portao-title">
        <div className={styles.intro}>
          <p className={styles.kicker}>Experiência de livro · POC 01</p>
          <h1 id="portao-title">Portão</h1>
          <p>Uma rua. Uma visita. Um homem que parece saber demais.</p>
        </div>

        <div className={styles.scene} aria-label="Uma ladeira residencial brasileira vista enquanto a câmera se afasta">
          <div className={styles.sunGlow} aria-hidden="true" />
          <div className={styles.horizon} aria-hidden="true" />
          <City />

          <div className={styles.world} aria-hidden="true">
            <div className={styles.hillBack} />
            <div className={styles.street}>
              <span /><span /><span /><span /><span /><span /><span /><span />
            </div>
            <div className={styles.wallLeft} />
            <div className={styles.wallRight} />
            <House />
            <Tree className={styles.treeOne} />
            <Tree className={styles.treeTwo} />
            <Tree className={styles.palm} />
            <div className={styles.utilityPole}><i /><i /><b /></div>
            <div className={styles.wireOne} />
            <div className={styles.wireTwo} />
            <div className={styles.gate}>
              <i /><i /><i /><i /><i /><i /><i />
            </div>
            <Jota />
            <div className={styles.dog} />
          </div>

          <blockquote className={styles.fragment}>
            <span>“Enfim a última casa desta rua.”</span>
            <cite>ENQUANTO DURAR A FÉ</cite>
          </blockquote>
        </div>

        <div className={styles.progress} aria-hidden="true"><i /></div>
        <p className={styles.scrollHint}>Role para se afastar</p>
        <p className={styles.reducedNote}>Cena estática por preferência de movimento reduzido.</p>
      </section>

      <section id="fim" className={styles.afterword}>
        <p>O contexto muda quando se ganha distância.</p>
        <span>Continua em breve: Cozinha · Opala</span>
      </section>
    </main>
  );
}
