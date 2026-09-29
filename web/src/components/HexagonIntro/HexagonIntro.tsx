"use client";

import { useEffect, useId, useRef } from "react";
import * as THREE from "three";
import styles from "./HexagonIntro.module.css";

/* The opening of the v3.0 portfolio: a square becomes a cube, the cube's
   silhouette is a hexagon, the hexagon is cut in two, and the halves become the
   D and E of DEIVER.

   READ FIRST: `NORTE.md` section 6.6 — it carries the decisions this file cannot
   express, including why the sequence is meant to play in REVERSE (the canonical
   plan is now Figma node 1110:6181, not the 1084:17125 these keyframes came
   from) and why the square must cover the page rather than open as a mask.
   The reversal is not implemented here yet.

   Figma file zpaQNzgjhG5ZKafe2cxnkm. Scope is currently frames 01–16 only; the
   expansion into the homepage waits on the Home being defined. */

export interface HexagonIntroProps {
  /** Reproduz a introdução automaticamente. */
  autoPlay?: boolean;
  /** Reinicia a demonstração depois da pausa no Step 14. */
  loop?: boolean;
  /** Pausa inicial para o quadrado ser percebido antes de se mover. */
  introHoldMs?: number;
  /** Duração de cada ciclo quadrado → cubo/hexágono → quadrado. */
  loaderCycleMs?: number;
  /** Quantidade de ciclos completos antes de resolver para o logo. */
  loaderCycles?: number;
  /** Duração só do giro quadrado ↔ cubo. Independente de tudo o mais. */
  rotationMs?: number;
  /** Duração de tudo depois do giro: achatamento, corte e montagem das letras. */
  resolveMs?: number;
  /** Tempo de leitura do símbolo montado antes de reiniciar. */
  finalHoldMs?: number;
  /**
   * `forward` monta o símbolo a partir do quadrado. `reverse` parte do símbolo
   * montado e o decompõe até o quadrado — é a direção decidida para a abertura
   * real do site. Ver `NORTE.md` 6.6.
   */
  direction?: "forward" | "reverse";
  /** Chamado uma vez quando uma execução não-looping alcança seu estado final. */
  onComplete?: () => void;
  className?: string;
}

type PieceName = "d" | "e1" | "i" | "v" | "e2" | "r" | "cutout";

interface PieceState {
  x: number;
  y: number;
  sx: number;
  sy: number;
  opacity: number;
}

type LogoFrame = Record<PieceName, PieceState>;

const VIEWBOX_WIDTH = 1472;
const VIEWBOX_HEIGHT = 779;
const DEFAULT_INTRO_HOLD_MS = 700;
const DEFAULT_LOADER_CYCLE_MS = 1_600;
const DEFAULT_LOADER_CYCLES = 2;
/* Codex put the useful range for the square-to-cube turn at 450–600 ms: below
   that the volume does not register as volume. */
const DEFAULT_ROTATION_MS = 480;
const DEFAULT_RESOLVE_MS = 2_400;
const DEFAULT_FINAL_HOLD_MS = 700;
const RESET_FADE_MS = 240;
const MIN_LOADER_CYCLE_MS = 900;
const MIN_RESOLVE_MS = 900;
const PIECE_BASE = {
  d: { width: 26.0652, height: 58.4989 },
  e1: { width: 21.762, height: 45.1115 },
  i: { width: 17.7047, height: 39.8356 },
  v: { width: 13.2785, height: 33.0734 },
  e2: { width: 8.60645, height: 28.1222 },
  r: { width: 5.04092, height: 24.9587 },
  cutout: { width: 11.3408, height: 31.9639 },
} as const;

const PATHS = {
  d: "M0 1.027C0 .389.532-.139 1.147.033c.362.101.714.248 1.048.44l21.588 12.419a4.547 4.547 0 0 1 2.282 3.939v24.837a4.547 4.547 0 0 1-2.282 3.94L2.195 58.026a4.55 4.55 0 0 1-1.048.44C.532 58.638 0 58.11 0 57.472V1.027Z",
  e1: "M21.762 44.513c0 .46-.498.747-.896.518L2.279 34.317A4.548 4.548 0 0 1 0 30.375V14.736c0-1.626.869-3.128 2.279-3.941L20.866.081c.398-.23.896.058.896.517v43.915Z",
  i: "M6.584.609a4.547 4.547 0 0 1 4.545 0l6.006 3.47c.353.205.57.581.57.989v29.7c0 .407-.218.784-.57.988l-6.006 3.47a4.547 4.547 0 0 1-4.545 0L.57 35.751A1.143 1.143 0 0 1 0 34.763V5.072c0-.407.217-.784.57-.988L6.584.609Z",
  v: "M13.279 0v30.064l-4.265 2.453a4.55 4.55 0 0 1-1.592.556H5.769a4.55 4.55 0 0 1-1.592-.556L0 30.114V0h13.279Z",
  e2: "M8.606 27.85c0 .21-.227.34-.408.235l-5.945-3.47A4.547 4.547 0 0 1 0 20.67V7.452a4.547 4.547 0 0 1 2.253-3.945L8.198.037c.181-.105.408.025.408.235V27.85Z",
  r: "M2.765 1.216a4.547 4.547 0 0 1 2.276 3.941V12.6H.543c.116.054.23.114.343.179l1.46.843a5.39 5.39 0 0 1 2.695 4.667v6.67H0V.522C0 .121.435-.13.782.071l1.983 1.145Z",
} as const;

function state(
  name: keyof typeof PIECE_BASE,
  x: number,
  y: number,
  width: number = PIECE_BASE[name].width,
  height: number = PIECE_BASE[name].height,
  opacity = 1,
): PieceState {
  return {
    x,
    y,
    sx: width / PIECE_BASE[name].width,
    sy: height / PIECE_BASE[name].height,
    opacity,
  };
}

function frame(values: Partial<Record<PieceName, PieceState>>): LogoFrame {
  /* Only the cutout still falls back to this. It is a hole, so it cannot hide
     behind the D the way the letters do — it opens in place instead. */
  const hidden = state("cutout", 703.479, 373.659, 0.01, 0.01, 0);
  return {
    d: values.d ?? hidden,
    e1: values.e1 ?? hidden,
    i: values.i ?? hidden,
    v: values.v ?? hidden,
    e2: values.e2 ?? hidden,
    r: values.r ?? hidden,
    cutout: values.cutout ?? hidden,
  };
}

/* Positions and proportions are transcribed from the Figma Step frames.
   Timing between those states is authored below because the frames contain
   geometry, not transition durations or easing. */
const LOGO_FRAMES: LogoFrame[] = [
  /* The other letters are already here, at full size, stacked behind the D.
     They are hidden by occlusion rather than by opacity, so they slide out from
     under it instead of growing out of nothing in the middle of the screen —
     which is the whole point of this passage: the shapes were always cuts of
     the same block. The Figma Steps have no layers for them yet, so these two
     positions are authored; from Step 07 on the frames take over. */
  frame({
    e1: state("e1", 713.139, 366.692, 19.403, 45.797),
    d: state("d", 724.856, 348.161, 39.729, 109.884),
    i: state("i", 731, 369.828),
    v: state("v", 733, 374.009),
    e2: state("e2", 735, 375.562),
    r: state("r", 737, 376.59),
  }),
  frame({
    e1: state("e1", 710.757, 366.692, 19.403, 45.797),
    d: state("d", 715.197, 348.161, 39.729, 109.884),
    i: state("i", 722, 369.828),
    v: state("v", 724, 374.009),
    e2: state("e2", 726, 375.562),
    r: state("r", 728, 376.59),
  }),
  frame({
    d: state("d", 699.284, 358.846, 25.958, 61.75),
    e1: state("e1", 703.479, 367.19),
    i: state("i", 700.16, 369.828),
    v: state("v", 711.307, 374.009),
    e2: state("e2", 708.479, 375.562),
    r: state("r", 719.544, 376.59),
  }),
  frame({
    d: state("d", 693.479, 358.846),
    e1: state("e1", 700.426, 367.19),
    i: state("i", 714.16, 369.828),
    v: state("v", 715.307, 374.009),
    e2: state("e2", 719.479, 375.562),
    r: state("r", 717.544, 376.59),
  }),
  frame({
    d: state("d", 690.447, 360.25),
    e1: state("e1", 701.39, 367.19),
    i: state("i", 729.189, 369.828),
    v: state("v", 732.373, 374.009),
    e2: state("e2", 729.435, 375.562),
    r: state("r", 737.545, 376.59),
  }),
  frame({
    d: state("d", 689.364, 360.25),
    e1: state("e1", 702.397, 367.19),
    cutout: state("cutout", 702.396, 373.121, 13.033, 33.002),
    i: state("i", 730.16, 369.828),
    v: state("v", 740.373, 374.009),
    e2: state("e2", 731.436, 375.562),
    r: state("r", 747.545, 376.59),
  }),
  frame({
    d: state("d", 688.755, 360.25),
    e1: state("e1", 703.479, 367.19),
    cutout: state("cutout", 703.479, 373.659),
    i: state("i", 730.16, 369.828),
    v: state("v", 749.215, 374.009),
    e2: state("e2", 753.436, 375.562),
    r: state("r", 755.545, 376.59),
  }),
  frame({
    d: state("d", 688.755, 360.25),
    e1: state("e1", 703.479, 367.19),
    cutout: state("cutout", 703.479, 373.659),
    i: state("i", 730.16, 369.828),
    v: state("v", 751.307, 374.009),
    e2: state("e2", 763.436, 375.562),
    r: state("r", 766.545, 376.59),
  }),
  frame({
    d: state("d", 688.295, 360.25),
    e1: state("e1", 703.479, 367.19),
    cutout: state("cutout", 703.479, 373.823, 10.881, 31.649),
    i: state("i", 730.16, 369.828),
    v: state("v", 751.307, 374.009),
    e2: state("e2", 767.536, 375.562),
    r: state("r", 774.579, 376.59),
  }),
  frame({
    d: state("d", 688.755, 360.25),
    e1: state("e1", 703.479, 367.19),
    cutout: state("cutout", 703.479, 373.659),
    i: state("i", 730.16, 369.828),
    v: state("v", 751.307, 374.009),
    e2: state("e2", 767.536, 375.562),
    r: state("r", 778.602, 376.59),
  }),
];

/* Nine equally weighted frame gaps read as a list of eight separate events. The
   pieces arrive in three waves instead, each starting a beat after the last:
   the pair the hexagon splits into, then the letters that read first, then the
   tail. Every wave still lands on Step 14 by the end of the build. */
const PIECE_WAVE: Record<PieceName, number> = {
  d: 0,
  e1: 0,
  cutout: 0,
  i: 1,
  v: 1,
  e2: 2,
  r: 2,
};
const WAVE_COUNT = 3;
const WAVE_STAGGER = 0.12;
const WAVE_SPAN = 1 - WAVE_STAGGER * (WAVE_COUNT - 1);

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smootherStep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

/* Easing each keyframe gap on its own curve meant every piece reached zero
   velocity at all ten frames — nine accelerations and nine dead stops, which is
   what reads as a robot walking. A Catmull-Rom spline carries velocity through
   the keyframes instead, and the ease is applied once across the whole phase,
   so the build accelerates once and settles once. The keyframes are still hit
   exactly: at t = 0 the spline returns p1, at t = 1 it returns p2. */
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

function frameAt(index: number, name: PieceName): PieceState {
  const clamped = Math.min(LOGO_FRAMES.length - 1, Math.max(0, index));
  return LOGO_FRAMES[clamped][name];
}

function getFrameState(progress: number, name: PieceName): PieceState {
  const staggered = smootherStep(
    clamp01((clamp01(progress) - PIECE_WAVE[name] * WAVE_STAGGER) / WAVE_SPAN),
  );
  const position = staggered * (LOGO_FRAMES.length - 1);
  const index = Math.min(LOGO_FRAMES.length - 2, Math.floor(position));
  const t = position - index;

  const before = frameAt(index - 1, name);
  const from = frameAt(index, name);
  const to = frameAt(index + 1, name);
  const after = frameAt(index + 2, name);

  return {
    x: catmullRom(before.x, from.x, to.x, after.x, t),
    y: catmullRom(before.y, from.y, to.y, after.y, t),
    sx: Math.max(0, catmullRom(before.sx, from.sx, to.sx, after.sx, t)),
    sy: Math.max(0, catmullRom(before.sy, from.sy, to.sy, after.sy, t)),
    /* A piece turns solid well before it finishes growing, so it never lingers
       on screen as a translucent ghost the way a linear fade left it. */
    opacity: clamp01(mix(from.opacity, to.opacity, clamp01(t * 3))),
  };
}

function Piece({
  name,
}: {
  name: Exclude<PieceName, "cutout">;
}) {
  return (
    <g data-piece={name}>
      <path d={PATHS[name]} fill="#246963" />
    </g>
  );
}

export function HexagonIntro({
  autoPlay = true,
  loop = true,
  introHoldMs = DEFAULT_INTRO_HOLD_MS,
  loaderCycleMs = DEFAULT_LOADER_CYCLE_MS,
  loaderCycles = DEFAULT_LOADER_CYCLES,
  rotationMs = DEFAULT_ROTATION_MS,
  resolveMs = DEFAULT_RESOLVE_MS,
  finalHoldMs = DEFAULT_FINAL_HOLD_MS,
  direction = "forward",
  onComplete,
  className,
}: HexagonIntroProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGGElement | null>(null);
  const bridgeRef = useRef<SVGGElement | null>(null);
  const bridgeLeftRef = useRef<SVGPathElement | null>(null);
  const bridgeRightRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const bridgeShadowId = useId().replaceAll(":", "");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    /* Zero cycles is the real opening: the square rotates straight through to
       the hexagon. Any cycle count above zero is the loader study, which returns
       to the square between turns and reads as hesitation in a one-shot intro. */
    const completeLoaderCycles = Math.max(0, Math.round(loaderCycles));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -VIEWBOX_WIDTH / 2,
      VIEWBOX_WIDTH / 2,
      VIEWBOX_HEIGHT / 2,
      -VIEWBOX_HEIGHT / 2,
      0.1,
      2_000,
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.domElement.className = styles.canvas;
    stage.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(35, 35, 35);
    const faceColors = [0x246963, 0x1c5550, 0x2d746e, 0x174b47, 0x246963, 0x133f3b].map(
      (color) => new THREE.Color(color),
    );
    const flatColor = new THREE.Color(0x246963);
    const materials = faceColors.map(
      (color) =>
        new THREE.MeshBasicMaterial({
          color: color.clone(),
          transparent: true,
          opacity: 1,
          depthWrite: false,
        }),
    );
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    /* Draining the six face tones into one flat colour is what turns the solid
       into a graphic. It also makes the handoff to the SVG invisible: by the
       time it happens, both are the same flat hexagon in the same colour. */
    const setCubeFlatness = (amount: number) => {
      const value = clamp01(amount);
      materials.forEach((material, index) => {
        material.color.copy(faceColors[index]).lerp(flatColor, value);
      });
    };

    const setCubeRotation = (x: number, y: number, z: number) => {
      cube.rotation.set(
        THREE.MathUtils.degToRad(x),
        THREE.MathUtils.degToRad(y),
        THREE.MathUtils.degToRad(z),
        "XYZ",
      );
    };

    const applyPiece = (name: PieceName, progress: number) => {
      const node = svgRef.current?.querySelector<SVGGElement>(`[data-piece="${name}"]`);
      if (!node) return;
      const value = getFrameState(progress, name);
      node.setAttribute(
        "transform",
        `translate(${value.x} ${value.y}) scale(${value.sx} ${value.sy})`,
      );
      node.setAttribute("opacity", String(value.opacity));
    };

    const setCubeOpacity = (opacity: number) => {
      materials.forEach((material) => {
        material.opacity = opacity;
      });
    };

    const renderLogo = (progress: number, opacity: number) => {
      if (logoRef.current) logoRef.current.setAttribute("opacity", String(opacity));
      (["d", "e1", "i", "v", "e2", "r", "cutout"] as PieceName[]).forEach((name) =>
        applyPiece(name, progress),
      );
    };

    const hideBridge = () => {
      bridgeRef.current?.setAttribute("opacity", "0");
    };

    /* Step 04B is a passing pose, not another scene. The projected cube first
       becomes one flat hexagon. Only after a short settle do its two halves
       reveal themselves and become the D/E pair. */
    const renderBridge = (progress: number, opacity: number) => {
      const group = bridgeRef.current;
      const left = bridgeLeftRef.current;
      const right = bridgeRightRef.current;
      if (!group || !left || !right) return;

      const p = clamp01(progress);
      const tone = smootherStep(clamp01((p - 0.04) / 0.2));
      /* The cut has to be seen to be understood, so the two halves pull fully
         apart — white showing between them — before they take up their D and E
         positions, where they overlap again. Receding one behind the other is
         what killed the earlier spikes, but it also meant the split was never
         visible: a hexagon simply turned into a D. */
      const part = smootherStep(clamp01((p - 0.08) / 0.44));
      const settle = smootherStep(clamp01((p - 0.55) / 0.45));
      const gap = 5;

      const leftX = mix(mix(0, -gap, part), -4, settle);
      const leftScaleX = mix(1, 0.72, settle);
      const leftScaleY = mix(1, 0.74, settle);
      const rightX = mix(mix(0, gap, part), -11, settle);
      const rightY = mix(0, 13.5, settle);
      const rightScaleX = mix(1, 1.47, settle);
      const rightScaleY = mix(1, 1.77, settle);

      group.setAttribute("opacity", String(opacity));
      left.setAttribute(
        "transform",
        `translate(${leftX} 0) scale(${leftScaleX} ${leftScaleY})`,
      );
      right.setAttribute(
        "transform",
        `translate(${rightX} ${rightY}) scale(${rightScaleX} ${rightScaleY})`,
      );

      // A 3% luminance shift hints at the split without drawing a seam.
      left.setAttribute("fill", `rgb(${Math.round(mix(36, 43, tone))} 105 99)`);
      right.setAttribute("fill", "#246963");

      // The shadow only earns its place while D is travelling back across E.
      const depth = settle * (1 - settle) * 4;
      right.setAttribute("filter", depth > 0.15 ? `url(#${bridgeShadowId})` : "none");
    };

    const renderSquare = (opacity = 1) => {
      setCubeRotation(0, 0, 0);
      cube.scale.setScalar(1);
      setCubeFlatness(0);
      setCubeOpacity(opacity);
      hideBridge();
      renderLogo(0, 0);
      renderer.render(scene, camera);
    };

    const renderLoaderCycle = (progress: number, cycleIndex: number, opacity = 1) => {
      const p = clamp01(progress);
      const baseY = cycleIndex * -90;
      let from = { x: 0, y: baseY, z: 0 };
      let to = from;
      let amount = 0;

      if (p < 0.18) {
        amount = 0;
      } else if (p < 0.4) {
        to = { x: 24, y: baseY - 31, z: 7 };
        amount = smootherStep((p - 0.18) / 0.22);
      } else if (p < 0.52) {
        from = { x: 24, y: baseY - 31, z: 7 };
        to = { x: 35.264, y: baseY - 45, z: 0 };
        amount = smootherStep((p - 0.4) / 0.12);
      } else if (p < 0.62) {
        from = { x: 35.264, y: baseY - 45, z: 0 };
        to = from;
        amount = 1;
      } else if (p < 0.74) {
        from = { x: 35.264, y: baseY - 45, z: 0 };
        to = { x: 24, y: baseY - 59, z: -7 };
        amount = smootherStep((p - 0.62) / 0.12);
      } else if (p < 0.9) {
        from = { x: 24, y: baseY - 59, z: -7 };
        to = { x: 0, y: baseY - 90, z: 0 };
        amount = smootherStep((p - 0.74) / 0.16);
      } else {
        from = { x: 0, y: baseY - 90, z: 0 };
        to = from;
        amount = 1;
      }

      setCubeRotation(
        mix(from.x, to.x, amount),
        mix(from.y, to.y, amount),
        mix(from.z, to.z, amount),
      );
      const breathingScale = 1 + 0.16 * Math.sin(Math.PI * smootherStep(p));
      cube.scale.setScalar(breathingScale);
      setCubeFlatness(0);
      setCubeOpacity(opacity);
      hideBridge();
      renderLogo(0, 0);
      renderer.render(scene, camera);
    };

    /* 1.0847 is the scale at which the cube's projected silhouette measures the
       same 31-unit circumradius as the SVG hexagon it hands over to, so the swap
       does not change the shape's size. */
    const ISOMETRIC_SCALE = 1.0847;

    /* The square turning into a cube is its own phase with its own duration,
       not a share of the resolve. It was 7% of resolveMs, which at the pacing
       being tested gave it about 105 ms — too fast for the volume to register.
       Codex had already put the useful range at 450–600 ms. */
    const renderRotation = (progress: number, opacity = 1) => {
      const t = smootherStep(clamp01(progress));
      const loaderExitY = completeLoaderCycles * -90;
      setCubeRotation(
        mix(0, 35.264, t),
        mix(loaderExitY, loaderExitY - 45, t),
        0,
      );
      cube.scale.setScalar(mix(1, ISOMETRIC_SCALE, t));
      setCubeFlatness(0);
      setCubeOpacity(opacity);
      hideBridge();
      renderLogo(0, 0);
      renderer.render(scene, camera);
    };

    const renderResolve = (progress: number, opacity = 1) => {
      const p = clamp01(progress);
      // The turn is over by now; this phase holds the isometric pose throughout.
      setCubeRotation(35.264, completeLoaderCycles * -90 - 45, 0);
      cube.scale.setScalar(ISOMETRIC_SCALE);

      /* Its own beat: the light drains out of the solid and it becomes a flat
         graphic. Only a shape that has stopped being an object can be cut. */
      setCubeFlatness(smootherStep(clamp01(p / 0.18)));

      const bridgeIn = smootherStep(clamp01((p - 0.18) / 0.04));
      /* Two layers cross-fading never sum to opaque: at the midpoint the shape
         composites to roughly 75% and reads as an unexplained blink. So the
         outgoing layer stays solid and only switches off once the incoming one
         covers it. The SVG already paints above the WebGL canvas, and the logo
         above the bridge, so the covering order needs nothing else. */
      setCubeOpacity((bridgeIn < 1 ? 1 : 0) * opacity);

      const bridgeProgress = clamp01((p - 0.2) / 0.33);
      /* The swap waits for the bridge to finish settling: cross-fading a still
         moving hexagon over a static logo read as a double image. */
      const bridgeToLogo = smootherStep(clamp01((p - 0.53) / 0.05));
      renderBridge(bridgeProgress, (bridgeToLogo < 1 ? bridgeIn : 0) * opacity);

      const logoProgress = clamp01((p - 0.58) / 0.42);
      renderLogo(logoProgress, bridgeToLogo * opacity);
      renderer.render(scene, camera);
    };

    const renderFinal = (opacity = 1) => {
      setCubeOpacity(0);
      hideBridge();
      renderLogo(1, opacity);

      renderer.render(scene, camera);
    };

    const resize = () => {
      const width = Math.max(1, stage.clientWidth);
      const height = Math.max(1, stage.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      // Forward opens on the square; reverse opens on the assembled symbol.
      if (autoPlay && direction === "forward") renderSquare();
      else renderFinal();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    const introDuration = Math.max(0, introHoldMs);
    const oneLoaderCycle = Math.max(MIN_LOADER_CYCLE_MS, loaderCycleMs);
    const loaderDuration = oneLoaderCycle * completeLoaderCycles;
    const resolutionDuration = Math.max(MIN_RESOLVE_MS, resolveMs);
    const holdDuration = Math.max(0, finalHoldMs);
    const fadeDuration = loop ? RESET_FADE_MS : 0;
    const rotationDuration = Math.max(0, rotationMs);
    const resolveStart = introDuration + loaderDuration;
    const rotationEnd = resolveStart + rotationDuration;
    const finalStart = rotationEnd + resolutionDuration;
    const fadeStart = finalStart + holdDuration;
    const cycleDuration = fadeStart + fadeDuration;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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
      const elapsed = now - cycleStart;
      const raw = loop ? elapsed % cycleDuration : Math.min(elapsed, cycleDuration);
      /* Every frame is a pure function of where we are in the cycle — nothing
         accumulates between frames — so playing the whole sequence backwards is
         just mirroring the clock before the phases are dispatched. None of the
         render functions below know which way time is running. */
      const inCycle = direction === "reverse" ? cycleDuration - raw : raw;
      if (inCycle < introDuration) {
        renderSquare();
      } else if (inCycle < resolveStart) {
        const loaderElapsed = inCycle - introDuration;
        const loaderCycleIndex = Math.floor(loaderElapsed / oneLoaderCycle);
        renderLoaderCycle(
          (loaderElapsed % oneLoaderCycle) / oneLoaderCycle,
          loaderCycleIndex,
        );
      } else if (inCycle < rotationEnd) {
        renderRotation((inCycle - resolveStart) / rotationDuration);
      } else if (inCycle < finalStart) {
        renderResolve((inCycle - rotationEnd) / resolutionDuration);
      } else if (inCycle < fadeStart || fadeDuration === 0) {
        renderFinal();
      } else {
        const fade = 1 - smootherStep((inCycle - fadeStart) / fadeDuration);
        renderFinal(fade);
      }

      // Each direction rests on its own end: the symbol forward, the square back.
      if (!loop && elapsed >= (direction === "reverse" ? cycleDuration : finalStart)) {
        stop();
        if (direction === "reverse") renderSquare();
        else renderFinal();
        onCompleteRef.current?.();
        return;
      }
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
      } else {
        stop();
        /* Reduced motion lands on the assembled symbol in both directions: it is
           the only frame that carries meaning on its own. */
        if (prefersReducedMotion || !autoPlay || direction === "reverse") renderFinal();
        else renderSquare();
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updatePlayback();
    });
    visibilityObserver.observe(stage);

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
      if (renderer.domElement.parentNode === stage) stage.removeChild(renderer.domElement);
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, [
    autoPlay,
    direction,
    finalHoldMs,
    introHoldMs,
    loaderCycleMs,
    loaderCycles,
    loop,
    resolveMs,
    rotationMs,
    bridgeShadowId,
  ]);

  const classes = [styles.stage, className].filter(Boolean).join(" ");

  return (
    <div ref={stageRef} className={classes} aria-hidden="true">
      <svg
        ref={svgRef}
        className={styles.logo}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        focusable="false"
      >
        <defs>
          <filter
            id={bridgeShadowId}
            x="-30%"
            y="-20%"
            width="170%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="2"
              dy="0"
              stdDeviation="1.5"
              floodColor="#082825"
              floodOpacity="0.18"
            />
          </filter>
        </defs>
        <g
          ref={bridgeRef}
          data-transition="step04b"
          opacity="0"
          transform="translate(736 389.5)"
        >
          <path
            ref={bridgeLeftRef}
            d="M0 -31 -27 -15.5V15.5L0 31Z"
            fill="#246963"
          />
          <path
            ref={bridgeRightRef}
            d="M0 -31 27 -15.5V15.5L0 31Z"
            fill="#246963"
          />
        </g>
        <g ref={logoRef}>
          {/* D paints above the other letters so they can hide behind it and
              slide out. Every letter shares one fill, so raising it changes
              nothing in the assembled symbol. */}
          <Piece name="e1" />
          <Piece name="i" />
          <Piece name="v" />
          <Piece name="e2" />
          <Piece name="r" />
          <Piece name="d" />
          <g data-piece="cutout">
            <path
              d="M5.67 0 11.34 3.55v24.86l-5.67 3.55L0 28.41V3.55L5.67 0Z"
              fill="#ffffff"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
