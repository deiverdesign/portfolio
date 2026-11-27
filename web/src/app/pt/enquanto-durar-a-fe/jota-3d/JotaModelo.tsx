"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import styles from "../personagem-jota/jota.module.css";
import { createJotaWatchFace, JOTA_BANDS, JOTA_INK, JOTA_MODEL_URL, JOTA_PARTS, loadJotaRegions, type JotaPart } from "../personagem-jota/jotaBands";
import {
  LIGHT_DIRECTION,
  METER,
  PALETTE,
  createCelMaterial,
  createOutlineMaterial,
  disposeObject,
  skyFragmentShader,
  skyVertexShader,
} from "../animatic-material/celShading";

// Só o modelo 3D do Jota (Meshy + traço da textura + cores do site), para girar e
// aproximar à vontade. A luz fica parada no mundo: girando a câmera dá para ver o lado
// da luz e o lado da sombra. Dois modos: "cel limpo" (luz e sombra, contorno, como em
// desenho animado) e o de 4 faixas com ruído de impressão, igual ao cenário.

const HEIGHT = 1.83;
// Câmera inicial: na altura do olho do cameraman (1,64 m), olhando o peito do Jota.
const START_CAMERA = new THREE.Vector3(1, 1.64, 3.9);
const START_TARGET = new THREE.Vector3(0, 1.05, 0);

// Rosto 2D desenhado pelo Deiver (olhos, sobrancelhas, boca), colado na cabeça 3D como
// um adesivo projetado de frente. x e y: centro do desenho em metros, visto de frente
// ("esquerdo" é o lado esquerdo de quem olha). width: largura em metros; a altura segue
// a proporção do desenho. Os arquivos vêm de tools/jota_rosto.py.
const FACE_URL = "/enquanto-durar-a-fe/jota-rosto/";
const FACE_PARTS = [
  { file: "olho-esquerdo.png", x: -.083, y: 1.632, width: .044 },
  { file: "olho-direito.png", x: -.0115, y: 1.632, width: .044 },
  { file: "boca.png", x: -.05, y: 1.552, width: .046 },
  { file: "sobrancelha-esquerda.png", x: -.08, y: 1.657, width: .052 },
  { file: "sobrancelha-direita.png", x: -.015, y: 1.657, width: .038 },
];

export function JotaModelo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const resetRef = useRef<() => void>(() => {});
  const applyCleanRef = useRef<(clean: boolean) => void>(() => {});
  const cleanRef = useRef(true);
  const [clean, setClean] = useState(true);
  const [spin, setSpin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      container.dataset.webglUnavailable = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.ink);
    const camera = new THREE.PerspectiveCamera(30, 1, .05, 400);

    const sun = new THREE.DirectionalLight("#ffffff", 1);
    sun.position.copy(LIGHT_DIRECTION).multiplyScalar(12);
    sun.castShadow = true;
    // Sombra justa no corpo e em alta resolução: a borda da sombra no rosto fica lisa.
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.left = -3;
    sun.shadow.camera.right = 3;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -3;
    sun.shadow.bias = -.0006;
    sun.shadow.normalBias = .02;
    scene.add(sun, sun.target);

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(300, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color("#0b2457") },
          uHigh: { value: new THREE.Color("#145a82") },
          uMiddle: { value: new THREE.Color("#1fa27c") },
          uLow: { value: new THREE.Color("#b5dd3e") },
          uHorizon: { value: new THREE.Color("#f3f03c") },
        },
        vertexShader: skyVertexShader,
        fragmentShader: skyFragmentShader,
      }),
    );
    scene.add(sky);

    // Tudo em metros, escalado para as unidades do site.
    const world = new THREE.Group();
    world.scale.setScalar(METER);
    scene.add(world);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), createCelMaterial({ lit: PALETTE.cobaltLight, mid: PALETTE.cobalt, shade: PALETTE.cobaltDark, deep: PALETTE.navy }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.add(ground);

    const outlineMaterial = createOutlineMaterial({ color: JOTA_INK, worldWidth: .006 * METER });
    // Cada parte tem os dois materiais prontos; o botão só troca qual está em uso.
    const variants: { mesh: THREE.Mesh; banded: THREE.Material; clean: THREE.Material; outline: THREE.Mesh }[] = [];
    const applyClean = (useClean: boolean) => {
      variants.forEach((variant) => {
        variant.mesh.material = useClean ? variant.clean : variant.banded;
        variant.outline.visible = useClean;
      });
    };
    applyCleanRef.current = applyClean;

    // Os adesivos do rosto ficam fora do grupo "world": a geometria deles já sai pronta,
    // nas coordenadas da cena.
    const face = new THREE.Group();
    scene.add(face);
    const faceTextures: THREE.Texture[] = [];

    let disposed = false;
    let regionMap: THREE.Texture | undefined;
    // O modelo e o mapa de regiões chegam juntos: cada parte só desenha os seus pixels.
    Promise.all([new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(JOTA_MODEL_URL), loadJotaRegions()]).then(([gltf, regions]) => {
      regionMap = regions;
      if (disposed) { regions.dispose(); return; }
      const model = gltf.scene;
      const meshes: THREE.Mesh[] = [];
      model.traverse((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
      let skin: THREE.Mesh | undefined;
      meshes.forEach((mesh) => {
        const original = mesh.material as THREE.MeshStandardMaterial;
        const band = JOTA_BANDS[original.name as JotaPart] ?? JOTA_BANDS.shirt;
        // inkMedian vem do arquivo: o tom médio da textura naquela região.
        const median = (original.userData.inkMedian as number | undefined) ?? .5;
        // O traço da textura só entra na pele (olhos, barba) e na camisa (colarinho, costuras,
        // alça). Na calça, sapato, bolsa e relógio ele virava manchas.
        const part = original.name as JotaPart;
        if (part === "skin") skin = mesh;
        const id = JOTA_PARTS.indexOf(part);
        const region = id >= 0 ? { map: regions, id } : undefined;
        const ink = original.map && (part === "skin" || part === "shirt")
          ? { map: original.map, median, cut: part === "skin" ? .3 : 0 }
          : undefined;
        const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
        mesh.add(outline);
        variants.push({ mesh, outline, banded: createCelMaterial({ ...band, ink, region }), clean: createCelMaterial({ ...band, ink, region, clean: true, cleanTones: original.name === "skin" ? 3 : 2 }) });
        original.dispose();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });
      applyClean(cleanRef.current);
      // Pés no chão, centralizado e com 1,83 m.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = HEIGHT / size.y;
      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
      world.add(model);
      // Caixa do relógio em 3D, com o mesmo azul-marinho e o mesmo contorno do resto.
      const watchClean = createCelMaterial({ ...JOTA_BANDS.watch, clean: true, cleanTones: 2 });
      const watchFace = createJotaWatchFace(watchClean);
      watchFace.castShadow = true;
      watchFace.receiveShadow = true;
      const watchOutline = new THREE.Mesh(watchFace.geometry, outlineMaterial);
      watchFace.add(watchOutline);
      world.add(watchFace);
      variants.push({ mesh: watchFace, outline: watchOutline, banded: createCelMaterial(JOTA_BANDS.watch), clean: watchClean });
      applyClean(cleanRef.current);
      world.updateMatrixWorld(true);
      setLoading(false);

      const textureLoader = new THREE.TextureLoader();
      FACE_PARTS.forEach((facePart, index) => {
        textureLoader.load(FACE_URL + facePart.file, (paint) => {
          if (disposed || !skin) return;
          paint.colorSpace = THREE.SRGBColorSpace;
          paint.anisotropy = renderer.capabilities.getMaxAnisotropy();
          faceTextures.push(paint);
          const aspect = paint.image.height / paint.image.width;
          // A caixa de projeção vai do nariz até o fundo dos olhos.
          const size = new THREE.Vector3(facePart.width, facePart.width * aspect, .1).multiplyScalar(METER);
          const position = new THREE.Vector3(facePart.x, facePart.y, .07).multiplyScalar(METER);
          const material = createCelMaterial({ ...JOTA_BANDS.skin, paint, clean: true, cleanTones: 3 });
          // Puxa o adesivo para a frente da pele; as sobrancelhas (por último) ficam por cima.
          material.polygonOffset = true;
          material.polygonOffsetFactor = -2;
          material.polygonOffsetUnits = -2 - index * 2;
          const decal = new THREE.Mesh(new DecalGeometry(skin, position, new THREE.Euler(), size), material);
          decal.receiveShadow = true;
          decal.renderOrder = 1 + index;
          face.add(decal);
        });
      });
    });

    // Arrastar gira em volta do Jota; roda do mouse ou pinça aproxima. Não deixa a câmera
    // passar para baixo do chão nem entrar no corpo.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .08;
    controls.enablePan = true;
    controls.minDistance = .35 * METER;
    controls.maxDistance = 7 * METER;
    controls.maxPolarAngle = Math.PI / 2 - .04;
    controls.autoRotateSpeed = 1.6;
    // A roda aproxima na direção do cursor: aponte para o rosto e role.
    controls.zoomToCursor = true;
    controlsRef.current = controls;
    const reset = () => {
      camera.position.copy(START_CAMERA).multiplyScalar(METER);
      controls.target.copy(START_TARGET).multiplyScalar(METER);
      controls.update();
    };
    resetRef.current = reset;
    reset();

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      renderer.getDrawingBufferSize(outlineMaterial.uniforms.uResolution.value);
      const ratio = renderer.getPixelRatio();
      outlineMaterial.uniforms.uMinPixels.value = 1.5 * ratio;
      outlineMaterial.uniforms.uMaxPixels.value = 4 * ratio;
      camera.aspect = width / height;
      // No celular a tela é estreita: abre um pouco o campo para o corpo inteiro caber.
      camera.fov = camera.aspect < .8 ? 42 : 30;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const render = () => {
      controls.update();
      sky.position.copy(camera.position);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
      controls.dispose();
      controlsRef.current = null;
      variants.forEach((variant) => { variant.banded.dispose(); variant.clean.dispose(); });
      outlineMaterial.dispose();
      disposeObject(world);
      disposeObject(face);
      faceTextures.forEach((texture) => texture.dispose());
      regionMap?.dispose();
      sky.geometry.dispose();
      sky.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const toggleSpin = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotate = !controls.autoRotate && !reducedMotion;
    setSpin(controls.autoRotate);
  };

  const toggleClean = () => {
    cleanRef.current = !cleanRef.current;
    setClean(cleanRef.current);
    applyCleanRef.current(cleanRef.current);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>ENQUANTO DURAR A FÉ <span>· JOTA 3D</span></p>
        <a href="/pt/enquanto-durar-a-fe/personagem-jota">Ver teste de corpo ↗</a>
      </header>

      <section className={styles.stage} aria-labelledby="jota3d-title">
        <div className={styles.canvasShell} ref={containerRef} role="img" aria-label="Modelo 3D do Jota, 1,83 m, de camisa clara, calça escura e bolsa transversal, na luz amarela de fim de tarde. Arraste para girar e use a roda do mouse ou dois dedos para aproximar." style={{ touchAction: "none", cursor: "grab" }} />
        <div className={styles.copy}>
          <p>{loading ? "CARREGANDO O MODELO…" : "ARRASTE PARA GIRAR · ROLE OU PINCE PARA APROXIMAR"}</p>
          <h1 id="jota3d-title">Jota 3D</h1>
          <span>Modelo do Meshy com o traço da textura e as cores do site. &ldquo;Cel limpo&rdquo; liga contorno e cores simples (3 no rosto, 2 no resto); desligado, volta às 4 faixas do cenário.</span>
        </div>
        <nav className={styles.controls} aria-label="Câmera">
          <button type="button" aria-pressed={clean} onClick={toggleClean}>Cel limpo</button>
          <button type="button" aria-pressed={spin} onClick={toggleSpin}>Girar sozinho</button>
          <button type="button" onClick={() => resetRef.current()}>Voltar ao início</button>
        </nav>
      </section>
    </main>
  );
}
