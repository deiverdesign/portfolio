"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HexagonMorph.module.css";

export type HexagonMorphState = "hexagon" | "rectangle";

export interface HexagonMorphProps {
  /** Reproduz continuamente a sequência: hexágono, retângulo, pausa e retorno. */
  autoPlay?: boolean;
  /** Estado mostrado quando autoPlay está desligado. */
  state?: HexagonMorphState;
  /** Tempo de cada transformação. Valores menores deixam o giro mais rápido. */
  transitionDurationMs?: number;
  className?: string;
}

const DEFAULT_TRANSITION_MS = 650;
const MIN_TRANSITION_MS = 150;
const HEXAGON_HOLD_MS = 450;
const RECTANGLE_HOLD_MS = 1_400;

const FACE_COLORS = [
  0x121212, // direita
  0x141414, // esquerda
  0x222222, // topo
  0x101010, // base
  0x181818, // frente
  0x0e0e0e, // fundo
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/* Smootherstep: velocidade E aceleração chegam a zero nas duas pontas.
   Isso remove o pequeno tranco que ainda existe no smoothstep comum. */
function smootherStep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function getTimeline(transitionDurationMs: number) {
  const duration = Math.max(MIN_TRANSITION_MS, transitionDurationMs);
  const toRectangleEnd = HEXAGON_HOLD_MS + duration;
  const rectangleHoldEnd = toRectangleEnd + RECTANGLE_HOLD_MS;
  const toHexagonEnd = rectangleHoldEnd + duration;

  return {
    duration,
    toRectangleEnd,
    rectangleHoldEnd,
    toHexagonEnd,
    cycle: toHexagonEnd + HEXAGON_HOLD_MS,
  };
}

function getRectangleProgress(elapsedMs: number, timeline: ReturnType<typeof getTimeline>) {
  if (elapsedMs < HEXAGON_HOLD_MS) return 0;

  if (elapsedMs < timeline.toRectangleEnd) {
    return smootherStep((elapsedMs - HEXAGON_HOLD_MS) / timeline.duration);
  }

  if (elapsedMs < timeline.rectangleHoldEnd) return 1;

  if (elapsedMs < timeline.toHexagonEnd) {
    return 1 - smootherStep((elapsedMs - timeline.rectangleHoldEnd) / timeline.duration);
  }

  return 0;
}

export function HexagonMorph({
  autoPlay = true,
  state = "hexagon",
  transitionDurationMs = DEFAULT_TRANSITION_MS,
  className,
}: HexagonMorphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1.6, 1.6, 1.6, -1.6, 0.1, 10);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = styles.canvas;
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = FACE_COLORS.map((color) => new THREE.MeshBasicMaterial({ color }));
    const solid = new THREE.Mesh(geometry, materials);
    scene.add(solid);

    const hexagonRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(THREE.MathUtils.degToRad(35.264), THREE.MathUtils.degToRad(-45), 0, "XYZ"),
    );
    const rectangleRotation = new THREE.Quaternion();

    const renderProgress = (progress: number) => {
      /* Quaternion faz X e Y comporem uma única rotação contínua. Animar
         os dois ângulos separadamente produz a sensação de correção manual
         entre eixos que aparece na gravação de referência. */
      solid.quaternion.slerpQuaternions(hexagonRotation, rectangleRotation, progress);
      renderer.render(scene, camera);
    };

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const aspect = width / height;
      const halfView = 1.35;

      if (aspect >= 1) {
        camera.left = -halfView * aspect;
        camera.right = halfView * aspect;
        camera.top = halfView;
        camera.bottom = -halfView;
      } else {
        camera.left = -halfView;
        camera.right = halfView;
        camera.top = halfView / aspect;
        camera.bottom = -halfView / aspect;
      }

      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderProgress(autoPlay ? 0 : state === "rectangle" ? 1 : 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timeline = getTimeline(transitionDurationMs);
    let prefersReducedMotion = reducedMotionQuery.matches;
    let isVisible = false;
    let frameId = 0;
    let cycleStart = performance.now();
    let isRunning = false;

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
    };

    const tick = (now: number) => {
      if (!isRunning) return;
      renderProgress(getRectangleProgress((now - cycleStart) % timeline.cycle, timeline));
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (isRunning || !autoPlay || prefersReducedMotion || !isVisible || document.hidden) return;
      isRunning = true;
      cycleStart = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    const updatePlayback = () => {
      if (autoPlay && !prefersReducedMotion && isVisible && !document.hidden) {
        start();
        return;
      }

      stop();
      renderProgress(autoPlay ? 0 : state === "rectangle" ? 1 : 0);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updatePlayback();
    });
    visibilityObserver.observe(container);

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      updatePlayback();
    };
    const handleVisibilityChange = () => updatePlayback();

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, [autoPlay, state, transitionDurationMs]);

  const classes = [styles.container, className].filter(Boolean).join(" ");

  return <div ref={containerRef} className={classes} aria-hidden="true" />;
}
