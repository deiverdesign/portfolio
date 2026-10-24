"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./animatic.module.css";

const ROAD_SLOPE = 0.14;
const roadY = (z: number) => 1.8 - ROAD_SLOPE * (z + 8);

function createTextTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 620;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#deded7";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#20211f";
  context.font = "600 71px Georgia";
  context.fillText("Enfim a última casa", 86, 255);
  context.fillText("desta rua.", 86, 337);
  context.fillStyle = "#6c6d68";
  context.font = "500 25px monospace";
  context.fillText("ENQUANTO DURAR A FÉ", 89, 458);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      const materialWithMap = material as THREE.MeshStandardMaterial;
      materialWithMap.map?.dispose();
      material.dispose();
    });
  });
}

export function PortaoAnimatic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollArea = scrollRef.current;
    if (!container || !scrollArea) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      container.dataset.webglUnavailable = "true";
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#70716c");
    scene.fog = new THREE.Fog("#70716c", 32, 150);

    const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 180);
    const ambient = new THREE.HemisphereLight("#f2f2ed", "#20211f", 2.2);
    const keyLight = new THREE.DirectionalLight("#ffffff", 1.35);
    keyLight.position.set(-12, 18, 10);
    scene.add(ambient, keyLight);

    const world = new THREE.Group();
    scene.add(world);
    const standard = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 });
    const dark = standard("#242623");
    const mid = standard("#535550");
    const light = standard("#a5a6a0");
    const pale = standard("#c4c5be");
    const roadMaterial = standard("#777872");
    const treeMaterial = standard("#3c3e3a");

    const addBox = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      material = mid,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z);
      world.add(mesh);
      return mesh;
    };

    const slopeAngle = Math.atan(ROAD_SLOPE);
    const street = new THREE.Mesh(new THREE.BoxGeometry(17, 0.22, 58), roadMaterial);
    street.position.set(0, roadY(14) - 0.14, 14);
    street.rotation.x = slopeAngle;
    world.add(street);

    const cobbleGeometry = new THREE.BoxGeometry(1.48, 0.1, 1.04);
    for (let row = 0; row < 37; row += 1) {
      const z = -4 + row * 1.18;
      for (let column = -5; column <= 5; column += 1) {
        const color = (row + column) % 3 === 0 ? "#898a84" : (row + column) % 2 === 0 ? "#73746e" : "#7e7f79";
        const cobble = new THREE.Mesh(cobbleGeometry, standard(color));
        cobble.position.set(column * 1.47 + (row % 2 ? .35 : 0), roadY(z) + .02, z);
        cobble.rotation.x = slopeAngle;
        world.add(cobble);
      }
    }

    const leftWall = addBox(1.15, 2.5, 42, -9.1, roadY(13) + 1.1, 13, mid);
    leftWall.rotation.x = slopeAngle;
    const rightWall = addBox(1.15, 2.5, 42, 9.1, roadY(13) + 1.1, 13, mid);
    rightWall.rotation.x = slopeAngle;

    const house = new THREE.Group();
    house.position.set(0, roadY(-13), -13);
    const houseBody = new THREE.Mesh(new THREE.BoxGeometry(8, 4.8, 4.8), pale);
    houseBody.position.y = 2.4;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5.65, 2.4, 4), dark);
    roof.position.y = 6;
    roof.rotation.y = Math.PI / 4;
    const porch = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.6, 2), light);
    porch.position.set(-2.6, 1.3, 2.8);
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.5, .14), dark);
    door.position.set(1.4, 1.25, 2.48);
    const windowMaterial = standard("#454743");
    [-1.1, 2.7].forEach((x) => {
      const window = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.25, .16), windowMaterial);
      window.position.set(x, 3.1, 2.5);
      house.add(window);
    });
    house.add(houseBody, roof, porch, door);
    world.add(house);

    const gate = new THREE.Group();
    gate.position.set(0, roadY(-5.1), -5.1);
    const gateMaterial = standard("#282a27");
    [-4.6, -3.3, -2.1, -1, 0, 1, 2.1, 3.3, 4.6].forEach((x) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(.18, 4.7, .18), gateMaterial);
      bar.position.set(x, 2.35, 0);
      gate.add(bar);
    });
    const gateTop = new THREE.Mesh(new THREE.BoxGeometry(10, .3, .25), gateMaterial);
    gateTop.position.y = 4.55;
    const gateBase = new THREE.Mesh(new THREE.BoxGeometry(10, .3, .25), gateMaterial);
    gateBase.position.y = .15;
    gate.add(gateTop, gateBase);
    world.add(gate);

    const jota = new THREE.Group();
    jota.position.set(0, roadY(-6.25), -6.25);
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.58, 1.72, 5, 10), dark);
    torso.position.y = 1.55;
    const head = new THREE.Mesh(new THREE.SphereGeometry(.46, 18, 12), dark);
    head.position.y = 3.25;
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.16, 1.25, 4, 8), dark);
    arm.position.set(-.67, 1.75, .05);
    arm.rotation.z = .2;
    const bag = new THREE.Mesh(new THREE.BoxGeometry(.85, .96, .28), mid);
    bag.position.set(.72, 1.45, .12);
    jota.add(torso, head, arm, bag);
    world.add(jota);

    const bible = new THREE.Group();
    bible.position.set(2.75, roadY(10.5) + 1.15, 10.5);
    bible.rotation.set(.12, -.42, -.16);
    const bibleCover = new THREE.Mesh(new THREE.BoxGeometry(1.4, .22, 2.05), dark);
    const biblePages = new THREE.Mesh(new THREE.BoxGeometry(1.26, .19, 1.86), pale);
    biblePages.position.y = .17;
    bible.add(bibleCover, biblePages);
    world.add(bible);

    const paperTexture = createTextTexture();
    const paper = new THREE.Group();
    // O cartão fica abaixo da câmera no início e só entra no cone visual depois
    // que ela o ultrapassa; assim a passagem é consequência da trajetória real.
    paper.position.set(0, roadY(10) + 2.5, 10);
    const paperMaterial = new THREE.MeshBasicMaterial({ map: paperTexture ?? undefined, color: "#deded7", side: THREE.DoubleSide });
    const paperMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.15), paperMaterial);
    paper.add(paperMesh);
    world.add(paper);

    const makeTree = (x: number, z: number, scale: number) => {
      const tree = new THREE.Group();
      tree.position.set(x, roadY(z), z);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.16 * scale, .22 * scale, 2.1 * scale, 8), dark);
      trunk.position.y = 1.05 * scale;
      tree.add(trunk);
      [[0, 2.5], [-.6, 2.15], [.65, 2.25]].forEach(([offsetX, height]) => {
        const crown = new THREE.Mesh(new THREE.SphereGeometry(.85 * scale, 10, 8), treeMaterial);
        crown.scale.set(1, height / 2.2, 1);
        crown.position.set(offsetX * scale, height * scale, 0);
        tree.add(crown);
      });
      world.add(tree);
    };
    makeTree(-7.1, -11, 1.55);
    makeTree(7.2, -8.5, 1.25);
    makeTree(-7.3, 3.5, 1.1);

    const palm = new THREE.Group();
    palm.position.set(6.1, roadY(-14), -14);
    const palmTrunk = new THREE.Mesh(new THREE.CylinderGeometry(.2, .3, 6.5, 8), dark);
    palmTrunk.position.y = 3.25;
    palm.add(palmTrunk);
    for (let leaf = 0; leaf < 7; leaf += 1) {
      const frond = new THREE.Mesh(new THREE.CapsuleGeometry(.18, 2.2, 4, 8), treeMaterial);
      frond.position.y = 6.3;
      frond.rotation.z = (leaf / 7) * Math.PI * 2;
      frond.rotation.x = .85;
      palm.add(frond);
    }
    world.add(palm);

    [-.5, 13, 27].forEach((z, index) => {
      const pole = new THREE.Group();
      pole.position.set(index % 2 ? 7.7 : -7.7, roadY(z), z);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, 7, 8), dark);
      shaft.position.y = 3.5;
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(2.4, .13, .13), dark);
      crossbar.position.y = 6.15;
      pole.add(shaft, crossbar);
      world.add(pole);
    });

    const skyline = new THREE.Group();
    for (let index = 0; index < 18; index += 1) {
      const height = 1.8 + ((index * 13) % 6) * .55;
      const building = new THREE.Mesh(new THREE.BoxGeometry(1.75, height, 2.3), standard(index % 2 ? "#555752" : "#4a4c48"));
      // A cidade baixa senta no horizonte visível acima da crista da rua.
      // Continua suficientemente distante para quase não se deslocar no recuo.
      building.position.set(-22 + index * 2.6, 3.1 + height / 2, -27 - (index % 3) * 1.4);
      skyline.add(building);
    }
    world.add(skyline);

    const horizon = new THREE.Mesh(new THREE.PlaneGeometry(130, 36), standard("#5f615c"));
    horizon.position.set(0, 4, -66);
    world.add(horizon);

    const startPosition = new THREE.Vector3(.35, roadY(1.5) + 1.65, 1.5);
    const endPosition = new THREE.Vector3(-.5, roadY(34) + 1.9, 34);
    const startLookAt = new THREE.Vector3(0, roadY(-7) + 2.1, -7);
    const endLookAt = new THREE.Vector3(0, roadY(-3) + 2, -3);
    const cameraPosition = new THREE.Vector3();
    const lookAt = new THREE.Vector3();
    let progress = 0;
    let targetProgress = 0;
    let frame = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      paper.scale.setScalar(width < 600 ? .62 : 1);
      renderScene();
    };

    const renderScene = () => {
      cameraPosition.lerpVectors(startPosition, endPosition, progress);
      cameraPosition.x += Math.sin(progress * Math.PI) * .78;
      cameraPosition.y += Math.sin(progress * Math.PI) * .22;
      lookAt.lerpVectors(startLookAt, endLookAt, progress);
      camera.position.copy(cameraPosition);
      camera.lookAt(lookAt);
      paper.lookAt(camera.position);
      bible.rotation.y = -.42 + progress * .42;
      renderer.render(scene, camera);
    };

    const animate = () => {
      progress += (targetProgress - progress) * .075;
      renderScene();
      frame = window.requestAnimationFrame(animate);
    };

    const updateScrollProgress = () => {
      const bounds = scrollArea.getBoundingClientRect();
      const distance = Math.max(scrollArea.offsetHeight - window.innerHeight, 1);
      targetProgress = Math.min(1, Math.max(0, -bounds.top / distance));
      scrollArea.style.setProperty("--scroll-progress", targetProgress.toFixed(4));
    };

    const handleMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        scrollArea.dataset.reducedMotion = "true";
        targetProgress = .66;
        progress = .66;
        scrollArea.style.setProperty("--scroll-progress", ".66");
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        renderScene();
      } else {
        delete scrollArea.dataset.reducedMotion;
        updateScrollProgress();
        if (!frame) animate();
      }
    };

    resize();
    handleMotionPreference();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    motionQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScrollProgress);
      motionQuery.removeEventListener("change", handleMotionPreference);
      if (frame) window.cancelAnimationFrame(frame);
      disposeObject(world);
      paperTexture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <main className={styles.animatic} ref={scrollRef}>
      <header className={styles.header}>
        <p>ENQUANTO DURAR A FÉ <span>· PORTÃO / ANIMATIC 3D</span></p>
        <a href="/pt/enquanto-durar-a-fe">Ver POC CSS ↗</a>
      </header>

      <section className={styles.stage} aria-labelledby="animatic-title">
        <div className={styles.canvasShell} ref={containerRef} role="img" aria-label="Animatic espacial de uma câmera que recua por uma ladeira em direção à cidade" />
        <div className={styles.copy}>
          <p>ESTUDO DE CÂMERA · NÃO É ARTE FINAL</p>
          <h1 id="animatic-title">Portão / recuo</h1>
          <span>Jota e o portão seguram o alto da rua. O resto aparece quando a câmera ganha distância.</span>
        </div>
        <p className={styles.scrollHint}>Role para descer a ladeira de costas <i aria-hidden="true">↓</i></p>
        <p className={styles.reducedNote}>Quadro estático por preferência de movimento reduzido.</p>
        <div className={styles.progress} aria-hidden="true"><i /></div>
      </section>

      <section className={styles.ending}>
        <p>Fim do animatic espacial.</p>
        <span>O teste valida câmera e profundidade; ilustração, texto final e cenas seguintes continuam fora deste protótipo.</span>
      </section>
    </main>
  );
}
