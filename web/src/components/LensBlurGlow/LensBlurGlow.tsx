"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./LensBlurGlow.module.css";

/**
 * Adaptado de "Shape Lens Blur Effect with SDFs and WebGL" (Codrops, por
 * Guillaume Lanier — https://github.com/guilanier/codrops-sdf-lensblur,
 * MIT). O shader original não borra de verdade o que está atrás da forma:
 * ele desenha um círculo via SDF e usa a distância até o mouse como uma
 * "máscara de proximidade" — essa máscara vira a borda (edge) do círculo
 * PONTO A PONTO, não um valor único pro círculo inteiro. É por isso que no
 * demo original só o lado da forma mais perto do cursor fica borrado, o
 * resto continua nítido. Aqui: mesma lógica (u_mouse real, seguido com
 * THREE.MathUtils.damp), só troco a cor por laranja e adiciono a
 * flutuação lenta do centro (u_time).
 */
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_pixelRatio;
  uniform float u_hoverAmount;
  uniform float u_time;

  vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
      p.x *= u_resolution.x / u_resolution.y;
      p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
      p.y *= u_resolution.y / u_resolution.x;
      p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
  }

  float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
  }

  float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
  }

  void main() {
    vec2 st = coord(gl_FragCoord.xy) + 0.5;
    vec2 posMouse = coord(u_mouse * u_pixelRatio) * vec2(1.0, -1.0) + 0.5;

    /* flutua devagar em X e Y, presa perto do centro do próprio slot */
    vec2 center = vec2(0.5) + vec2(sin(u_time * 0.3), cos(u_time * 0.37)) * 0.05;

    float circleSize = 0.5; /* ~1.5x o valor original (0.34) */

    /* máscara de proximidade do mouse: grande e bem suave (edge=0.5 é
       enorme perto do size=0.3), então vira um gradiente por pixel, não
       um círculo com borda definida. u_hoverAmount (0/1, suavizado)
       apaga a máscara inteira quando o mouse não está em cima. */
    float proximity = fill(sdCircle(st, posMouse), 0.3, 0.5) * u_hoverAmount;

    /* essa máscara vira a borda do círculo principal — ponto a ponto,
       não um valor só: o lado perto do mouse fica borrado, o resto não. */
    float edge = mix(0.06, 0.4, proximity);

    float sdf = fill(sdCircle(st, center), circleSize, edge);

    /* partículas — bolinhas bem menores espalhadas ao redor da principal,
       cada uma com sua própria órbita lenta (fase/velocidade diferentes
       pra não flutuarem em sincronia). Ficam logo fora do raio da bola
       principal (offsets ~0.4-0.5), blur pequeno e fixo (não reage ao
       mouse — só a bola grande faz isso). */
    float particles = 0.0;
    particles += fill(sdCircle(st, center + vec2(0.36, 0.10) + vec2(sin(u_time * 0.4), cos(u_time * 0.5)) * 0.02), 0.045, 0.025);
    particles += fill(sdCircle(st, center + vec2(-0.09, 0.41) + vec2(sin(u_time * 0.35 + 1.3), cos(u_time * 0.45 + 1.3)) * 0.02), 0.03, 0.02);
    particles += fill(sdCircle(st, center + vec2(0.26, -0.34) + vec2(sin(u_time * 0.5 + 2.6), cos(u_time * 0.3 + 2.6)) * 0.025), 0.035, 0.02);
    particles += fill(sdCircle(st, center + vec2(-0.37, -0.13) + vec2(sin(u_time * 0.45 + 3.9), cos(u_time * 0.4 + 3.9)) * 0.017), 0.025, 0.015);
    particles += fill(sdCircle(st, center + vec2(-0.17, -0.36) + vec2(sin(u_time * 0.3 + 5.2), cos(u_time * 0.55 + 5.2)) * 0.025), 0.02, 0.015);
    particles = clamp(particles, 0.0, 1.0);

    vec3 colorCore = vec3(0.9765, 0.3137, 0.1294); /* #f95021 */
    vec3 colorEdge = vec3(0.2275, 0.0314, 0.0353); /* #3a0809 */
    vec3 color = mix(colorEdge, colorCore, max(sdf, particles));

    /* alpha separado por elemento: bola principal a 80%, partículas a
       30% — o degradê de cor acima usa a cobertura cheia (senão o miolo
       fica achatado), só o canal de transparência final é limitado. */
    float alpha = max(sdf * 0.8, particles * 0.3);

    gl_FragColor = vec4(color, alpha);
  }
`;

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function LensBlurGlow() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    /* .heroVisual (o pai) já é display:none abaixo de 1024px (ver
       responsive-rules.md) — sem essa checagem, o WebGL context ainda
       seria criado e ficaria renderizando à toa, escondido, gastando
       bateria/GPU no mobile por nada. */
    if (!window.matchMedia("(min-width: 1025px)").matches) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* área de hover maior que o glow em si — do jeito que já era com o
       glow decorativo antigo, ele fica parcialmente atrás da foto, então
       o alvo do hover é o conjunto foto+glow (.heroVisual), não só o canvas. */
    const hoverTarget = container.closest<HTMLElement>("[data-glow-hover-target]") ?? container;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const resolution = new THREE.Vector2();
    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const hover = { current: 0, target: 0 };
    let canvasRect = container.getBoundingClientRect();

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        u_resolution: { value: resolution },
        u_mouse: { value: vMouseDamp },
        u_pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        u_hoverAmount: { value: 0 },
        u_time: { value: 0 },
      },
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      canvasRect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(canvasRect.width, canvasRect.height);
      renderer.setPixelRatio(dpr);
      resolution.set(canvasRect.width, canvasRect.height).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const handleEnter = () => {
      hover.target = 1;
    };
    const handleLeave = () => {
      hover.target = 0;
    };
    /* posição do mouse relativa ao canvas (não à página, diferente do
       demo original) — é o que os uniforms u_resolution/u_pixelRatio
       esperam pra essa forma específica. */
    const handleMove = (e: PointerEvent) => {
      vMouse.set(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
    };
    hoverTarget.addEventListener("pointerenter", handleEnter);
    hoverTarget.addEventListener("pointerleave", handleLeave);
    hoverTarget.addEventListener("pointermove", handleMove);

    let raf = 0;
    let lastTime = performance.now() * 0.001;
    const clockStart = lastTime;

    const tick = () => {
      const now = performance.now() * 0.001;
      const dt = now - lastTime;
      lastTime = now;

      hover.current = THREE.MathUtils.damp(hover.current, hover.target, 6, dt);
      material.uniforms.u_hoverAmount.value = hover.current;
      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);
      material.uniforms.u_time.value = prefersReducedMotion ? 0 : now - clockStart;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      hoverTarget.removeEventListener("pointerenter", handleEnter);
      hoverTarget.removeEventListener("pointerleave", handleLeave);
      hoverTarget.removeEventListener("pointermove", handleMove);
      container.removeChild(renderer.domElement);
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={styles.canvasContainer} aria-hidden="true" />;
}
