"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./jota.module.css";
import { JOTA_BANDS, JOTA_MODEL_URL, JOTA_PARTS, loadJotaRegions, type JotaPart } from "./jotaBands";
import {
  LIGHT_DIRECTION,
  METER,
  PALETTE,
  createCelMaterial,
  disposeObject,
  skyFragmentShader,
  skyVertexShader,
} from "../animatic-material/celShading";

// Teste de corpo do Jota: três graus de estiramento e as medidas do desenho 2D,
// todos com 1,83 m, ao lado do cameraman de 1,75 m. Não é o personagem final: é um
// boneco de primitivas para acertar a proporção antes de modelar.

// Medidas em metros. NORMAL é um corpo comum; NOIVA_CADAVER é o extremo do
// Tim Burton. Cada grau mistura os dois.
type Body = {
  headHeight: number; headWidth: number; headDepth: number;
  neckLength: number; neckRadius: number;
  shoulderHalf: number; chestWidth: number; chestDepth: number; waistWidth: number; hipWidth: number;
  legLength: number; thighRadius: number; kneeRadius: number; ankleRadius: number;
  armLength: number; upperArmRadius: number; wristRadius: number;
  handLength: number; footLength: number;
};

const NORMAL: Body = {
  headHeight: .23, headWidth: .155, headDepth: .2,
  neckLength: .07, neckRadius: .055,
  shoulderHalf: .21, chestWidth: .36, chestDepth: .22, waistWidth: .3, hipWidth: .34,
  legLength: .86, thighRadius: .085, kneeRadius: .055, ankleRadius: .035,
  armLength: .6, upperArmRadius: .05, wristRadius: .03,
  handLength: .19, footLength: .27,
};

const NOIVA_CADAVER: Body = {
  headHeight: .3, headWidth: .14, headDepth: .22,
  neckLength: .14, neckRadius: .035,
  shoulderHalf: .16, chestWidth: .26, chestDepth: .16, waistWidth: .2, hipWidth: .24,
  legLength: .98, thighRadius: .055, kneeRadius: .036, ankleRadius: .02,
  // "Braços fortes", diz o livro: o braço afina menos que o resto.
  armLength: .78, upperArmRadius: .038, wristRadius: .017,
  handLength: .23, footLength: .31,
};

const HEIGHT = 1.83;
const CAMERAMAN_HEIGHT = 1.75;
// Distância entre as figuras, em metros.
const SPACING = 1.25;

const mixBody = (amount: number) => Object.fromEntries(
  Object.keys(NORMAL).map((key) => {
    const k = key as keyof Body;
    return [k, THREE.MathUtils.lerp(NORMAL[k], NOIVA_CADAVER[k], amount)];
  }),
) as Body;

// Medido no desenho 2D aprovado (Preparation/Personagens/Jota/Ready, vista de frente),
// convertendo pixels para metros com a altura de 1,83 m. Pernas longas como no
// "forte", ombros e cintura ainda mais estreitos, mas o braço tem alcance normal:
// a ponta dos dedos para no meio da coxa.
const DESENHO: Body = {
  headHeight: .25, headWidth: .15, headDepth: .21,
  neckLength: .1, neckRadius: .038,
  shoulderHalf: .14, chestWidth: .28, chestDepth: .17, waistWidth: .18, hipWidth: .22,
  legLength: .97, thighRadius: .055, kneeRadius: .04, ankleRadius: .028,
  armLength: .55, upperArmRadius: .036, wristRadius: .022,
  handLength: .22, footLength: .31,
};

const VARIANTS = [
  { name: "Leve", body: mixBody(.25) },
  { name: "Médio", body: mixBody(.5) },
  { name: "Forte", body: mixBody(.8) },
  { name: "Desenho", body: DESENHO },
];

const VIEWS = [
  { label: "Frente", angle: 0 },
  { label: "3/4", angle: Math.PI / 4 },
  { label: "Perfil", angle: Math.PI / 2 },
  { label: "Costas", angle: Math.PI },
];

// Modelo gerado no Meshy a partir do desenho de frente, reduzido de 649 mil para 32 mil
// faces. As regiões (pele, camisa, calça...) vêm separadas no arquivo, pintadas a partir
// do desenho de frente e de costas; cada uma recebe o mesmo material dos bonecos.
const MESHY_URL = "/enquanto-durar-a-fe/jota-meshy-web.glb";
const MESHY_TEXTURE_URL = JOTA_MODEL_URL;

type Materials = Record<JotaPart, THREE.Material>;

// Um segmento de membro: cilindro afunilado entre dois pontos, com uma esfera na ponta
// para a junta não abrir quando o boneco gira.
function addSegment(group: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, fromRadius: number, toRadius: number, material: THREE.Material) {
  const length = from.distanceTo(to);
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(toRadius, fromRadius, length, 12), material);
  cylinder.position.copy(from).add(to).multiplyScalar(.5);
  cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  const joint = new THREE.Mesh(new THREE.SphereGeometry(toRadius, 12, 8), material);
  joint.position.copy(to);
  group.add(cylinder, joint);
}

function buildJota(body: Body, materials: Materials) {
  const jota = new THREE.Group();
  const ankleY = .09;
  const hipY = body.legLength;
  const neckBaseY = HEIGHT - body.headHeight - body.neckLength;
  const shoulderY = neckBaseY - .03;
  const hipX = body.hipWidth * .28;

  // Pernas e sapatos.
  [-1, 1].forEach((side) => {
    const hip = new THREE.Vector3(side * hipX, hipY, 0);
    const knee = new THREE.Vector3(side * hipX * .92, (hipY + ankleY) * .5, .01);
    const ankle = new THREE.Vector3(side * hipX * .85, ankleY, 0);
    addSegment(jota, hip, knee, body.thighRadius, body.kneeRadius, materials.trousers);
    addSegment(jota, knee, ankle, body.kneeRadius, body.ankleRadius, materials.trousers);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(.1, .09, body.footLength), materials.shoes);
    shoe.position.set(side * hipX * .85, .045, body.footLength * .3);
    jota.add(shoe);
  });

  // Quadril, tronco (camisa por dentro da calça) e ombros.
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 10), materials.trousers);
  pelvis.scale.set(body.hipWidth, .2, body.chestDepth * .95);
  pelvis.position.y = hipY + .03;
  const torsoHeight = shoulderY - (hipY + .08);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(body.chestWidth / 2, body.waistWidth / 2, torsoHeight, 16), materials.shirt);
  torso.scale.z = body.chestDepth / body.chestWidth;
  torso.position.y = hipY + .08 + torsoHeight / 2;
  const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(body.upperArmRadius * 1.15, body.shoulderHalf * 2 - body.upperArmRadius * 2, 4, 10), materials.shirt);
  shoulders.rotation.z = Math.PI / 2;
  shoulders.position.y = shoulderY;
  jota.add(pelvis, torso, shoulders);

  // Pescoço e cabeça longa e fina: mais alta que larga, queixo estreito.
  const neckTop = new THREE.Vector3(0, neckBaseY + body.neckLength + .02, .01);
  addSegment(jota, new THREE.Vector3(0, neckBaseY - .02, 0), neckTop, body.neckRadius, body.neckRadius * .95, materials.skin);
  const headGeometry = new THREE.SphereGeometry(.5, 24, 18);
  const position = headGeometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i);
    // A metade de baixo afina até o queixo.
    const taper = y < 0 ? 1 + y * .9 : 1;
    position.setX(i, position.getX(i) * taper);
  }
  headGeometry.computeVertexNormals();
  const head = new THREE.Mesh(headGeometry, materials.skin);
  head.scale.set(body.headWidth, body.headHeight, body.headDepth);
  head.position.set(0, HEIGHT - body.headHeight / 2, .015);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.5, 20, 12, 0, Math.PI * 2, 0, Math.PI * .42), materials.hair);
  // Cabelo cheio e bagunçado: passa da cabeça para os lados e para cima.
  hair.scale.set(body.headWidth * 1.35, body.headHeight * 1.2, body.headDepth * 1.15);
  hair.position.set(0, HEIGHT - body.headHeight / 2 - .01, -.005);
  hair.rotation.x = -.25;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.018, .06, 8), materials.skin);
  nose.rotation.x = Math.PI / 2 + .35;
  nose.position.set(0, HEIGHT - body.headHeight * .55, .015 + body.headDepth / 2 + .012);
  jota.add(head, hair, nose);
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(.5, 10, 8), materials.skin);
    ear.scale.set(.02, .065, .04);
    ear.position.set(side * body.headWidth * .5, HEIGHT - body.headHeight * .5, 0);
    jota.add(ear);
  });

  // Braços levemente afastados (pose neutra para modelagem), mangas compridas.
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Vector3(side * body.shoulderHalf, shoulderY, 0);
    const direction = new THREE.Vector3(side * Math.sin(.14), -Math.cos(.14), 0);
    const elbow = shoulder.clone().addScaledVector(direction, body.armLength * .52);
    const wrist = shoulder.clone().addScaledVector(direction, body.armLength);
    addSegment(jota, shoulder, elbow, body.upperArmRadius, body.upperArmRadius * .82, materials.shirt);
    // Mangas dobradas até logo abaixo do cotovelo, como no desenho: antebraço de fora.
    addSegment(jota, elbow, wrist, body.upperArmRadius * .78, body.wristRadius, materials.skin);
    const cuffEnd = elbow.clone().addScaledVector(direction, .07);
    addSegment(jota, elbow.clone().addScaledVector(direction, -.02), cuffEnd, body.upperArmRadius * 1.12, body.upperArmRadius * 1.08, materials.shirt);
    const hand = new THREE.Mesh(new THREE.CapsuleGeometry(body.wristRadius * 1.25, body.handLength * .7, 4, 8), materials.skin);
    hand.scale.z = 1.9;
    hand.position.copy(wrist).addScaledVector(direction, body.handLength * .5);
    hand.rotation.z = side * .14;
    jota.add(hand);
    // O relógio que ele olha o tempo todo, no pulso esquerdo.
    if (side === 1) {
      const watch = new THREE.Mesh(new THREE.CylinderGeometry(body.wristRadius * 1.35, body.wristRadius * 1.35, .03, 12), materials.watch);
      watch.position.copy(wrist).addScaledVector(direction, -.03);
      watch.rotation.z = .14;
      jota.add(watch);
    }
  });

  // Bolsa transversal de imitação de couro: alça do ombro direito ao quadril esquerdo.
  // Mais alta que larga e pendurada na altura do quadril, como no desenho.
  const bag = new THREE.Mesh(new THREE.BoxGeometry(.21, .27, .1), materials.bag);
  bag.position.set(body.hipWidth * .5 + .06, hipY - .02, .03);
  bag.rotation.z = -.08;
  const strapFrom = new THREE.Vector3(-body.shoulderHalf * .7, shoulderY + .02, 0);
  const strapTo = new THREE.Vector3(body.hipWidth * .5 + .05, hipY + .11, 0);
  const strapLength = strapFrom.distanceTo(strapTo);
  [1, -1].forEach((face) => {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(.035, strapLength, .012), materials.bag);
    strap.position.copy(strapFrom).add(strapTo).multiplyScalar(.5);
    strap.position.z = face * (body.chestDepth / 2 + .006);
    strap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), strapTo.clone().sub(strapFrom).normalize());
    jota.add(strap);
  });
  jota.add(bag);

  jota.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });
  return jota;
}

// O cameraman é só uma silhueta de referência, para comparar alturas.
function buildCameraman(material: THREE.Material) {
  const person = new THREE.Group();
  const headRadius = .11;
  const legs = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .7, 4, 10), material);
  legs.position.y = .48;
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.2, .42, 4, 12), material);
  torso.scale.z = .6;
  torso.position.y = 1.22;
  const head = new THREE.Mesh(new THREE.SphereGeometry(headRadius, 16, 12), material);
  head.position.y = CAMERAMAN_HEIGHT - headRadius;
  person.add(legs, torso, head);
  person.traverse((child) => { child.castShadow = true; });
  return person;
}

const describe = (body: Body) => `pernas ${Math.round(body.legLength * 100)} cm · braço ${Math.round(body.armLength * 100)} cm · cabeça ${Math.round(body.headHeight * 100)} cm`;

export function JotaCorpo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const targetAngle = useRef(0);
  const spinning = useRef(false);
  const [view, setView] = useState(0);
  const [spin, setSpin] = useState(false);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.ink);
    const camera = new THREE.PerspectiveCamera(28, 1, .1, 400);

    const sun = new THREE.DirectionalLight("#ffffff", 1);
    sun.position.copy(LIGHT_DIRECTION).multiplyScalar(30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.bias = -.0006;
    sun.shadow.normalBias = .03;
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

    const bands = JOTA_BANDS;
    const materials = {} as Materials;
    (Object.keys(bands) as (keyof Materials)[]).forEach((name) => { materials[name] = createCelMaterial(bands[name]); });
    const cameramanMaterial = createCelMaterial({ lit: "#3a3f7e", mid: "#2b2f66", shade: "#1d2050", deep: "#151840", rim: PALETTE.pale, rimAmount: .15 });

    // Tudo é montado em metros e escalado para as unidades do site.
    const world = new THREE.Group();
    world.scale.setScalar(METER);
    scene.add(world);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), createCelMaterial({ lit: PALETTE.cobaltLight, mid: PALETTE.cobalt, shade: PALETTE.cobaltDark, deep: PALETTE.navy }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.add(ground);

    // Parede de alturas atrás deles: 0,5 / 1,0 / 1,5 m, e as duas que importam:
    // 1,75 m (cameraman) e 1,83 m (Jota).
    const wall = new THREE.Mesh(new THREE.BoxGeometry(10.5, 2, .1), createCelMaterial({ lit: PALETTE.pale, mid: "#6f7cc4", shade: PALETTE.cobaltDark, deep: PALETTE.navy }));
    wall.position.set(SPACING, 1, -.55);
    wall.receiveShadow = true;
    world.add(wall);
    const lineMaterial = createCelMaterial({ lit: PALETTE.navy, mid: PALETTE.navy, shade: PALETTE.ink, deep: PALETTE.ink });
    const markMaterial = createCelMaterial({ lit: PALETTE.orange, mid: PALETTE.orange, shade: "#b5602a", deep: "#7a3a2a" });
    const jotaMarkMaterial = createCelMaterial({ lit: PALETTE.yellow, mid: PALETTE.yellow, shade: "#9aa848", deep: "#6e7a3a" });
    [[.5, lineMaterial], [1, lineMaterial], [1.5, lineMaterial], [CAMERAMAN_HEIGHT, markMaterial], [HEIGHT, jotaMarkMaterial]].forEach(([y, material]) => {
      const line = new THREE.Mesh(new THREE.BoxGeometry(10.5, .012, .02), material as THREE.Material);
      line.position.set(SPACING, y as number, -.49);
      world.add(line);
    });

    const figures: THREE.Group[] = [];
    const cameraman = buildCameraman(cameramanMaterial);
    cameraman.position.x = -2 * SPACING;
    world.add(cameraman);
    VARIANTS.forEach((variant, index) => {
      const jota = buildJota(variant.body, materials);
      jota.position.x = (index - 1) * SPACING;
      world.add(jota);
      figures.push(jota);
    });
    let disposed = false;
    const loadMeshy = (url: string, x: number, dress: (mesh: THREE.Mesh) => void) => {
      const holder = new THREE.Group();
      holder.position.x = x;
      world.add(holder);
      figures.push(holder);
      new GLTFLoader().load(url, (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          dress(child);
          child.castShadow = true;
        });
        // Põe os pés no chão, centraliza e escala para 1,83 m.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = HEIGHT / size.y;
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        holder.add(model);
      });
    };
    loadMeshy(MESHY_URL, 3 * SPACING, (mesh) => {
      mesh.material = materials[(mesh.material as THREE.Material).name as keyof Materials] ?? materials.shirt;
      mesh.receiveShadow = true;
    });
    // O mapa de regiões diz, pixel a pixel, a que parte cada pedaço da textura pertence.
    const regionsLoaded = loadJotaRegions();
    loadMeshy(MESHY_TEXTURE_URL, 4 * SPACING, (mesh) => {
      const original = mesh.material as THREE.MeshStandardMaterial;
      const band = bands[original.name as keyof Materials] ?? bands.shirt;
      // inkMedian vem do arquivo: o tom médio da textura naquela região.
      const median = (original.userData.inkMedian as number | undefined) ?? .5;
      mesh.visible = false;
      regionsLoaded.then((regions) => {
        if (disposed) return;
        const id = JOTA_PARTS.indexOf(original.name as JotaPart);
        const region = id >= 0 ? { map: regions, id } : undefined;
        if (original.map) mesh.material = createCelMaterial({ ...band, ink: { map: original.map, median }, region });
        mesh.visible = true;
        original.dispose();
      });
      mesh.receiveShadow = true;
    });
    const labelAnchors = [cameraman, ...figures];

    // A lente fica na altura do olho do cameraman (1,64 m), como no site.
    const EYE = 1.64;
    // Centro da fila: do cameraman (-2,5 m) ao Meshy com textura (5 m).
    const CENTER_X = SPACING;
    const target = new THREE.Vector3(CENTER_X * METER, .95 * METER, 0);
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
      const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
      const sceneHalfWidth = 4.3 * METER;
      const sceneHalfHeight = 1.25 * METER;
      const distance = Math.max(sceneHalfWidth / Math.tan(halfH), sceneHalfHeight / Math.tan(halfV)) + .6 * METER;
      camera.position.set(CENTER_X * METER, EYE * METER, distance);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const projected = new THREE.Vector3();
    let angle = 0;
    let previous = performance.now();
    let frame = 0;
    const render = (now: number) => {
      const delta = Math.min((now - previous) / 1000, .05);
      previous = now;
      if (spinning.current && !reducedMotion) {
        angle += delta * .5;
        targetAngle.current = angle;
      } else {
        angle = reducedMotion ? targetAngle.current : THREE.MathUtils.damp(angle, targetAngle.current, 6, delta);
      }
      figures.forEach((figure) => { figure.rotation.y = angle; });
      cameraman.rotation.y = angle;

      sky.position.copy(camera.position);
      renderer.render(scene, camera);

      // Legendas em HTML presas aos pés de cada figura.
      labelAnchors.forEach((anchor, index) => {
        const label = labelsRef.current[index];
        if (!label) return;
        anchor.getWorldPosition(projected).project(camera);
        label.style.transform = `translate(${(projected.x * .5 + .5) * container.clientWidth}px, ${(-projected.y * .5 + .5) * container.clientHeight + 14}px) translateX(-50%)`;
      });
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
      disposeObject(world);
      regionsLoaded.then((regions) => regions.dispose());
      cameramanMaterial.dispose();
      Object.values(materials).forEach((material) => material.dispose());
      sky.geometry.dispose();
      sky.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const chooseView = (index: number) => {
    spinning.current = false;
    setSpin(false);
    setView(index);
    // Volta pelo caminho mais curto quando sai do giro livre.
    const current = targetAngle.current;
    const wanted = VIEWS[index].angle;
    targetAngle.current = current + Math.atan2(Math.sin(wanted - current), Math.cos(wanted - current));
  };

  const toggleSpin = () => {
    spinning.current = !spinning.current;
    setSpin(spinning.current);
  };

  const labels = [
    { title: "Cameraman", detail: "1,75 m · referência" },
    ...VARIANTS.map((variant) => ({ title: `Jota · ${variant.name}`, detail: describe(variant.body) })),
    { title: "Jota · Meshy", detail: "cores do site · 32 mil faces" },
    { title: "Jota · Meshy textura", detail: "traço da textura + cores do site · 39 mil faces" },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>ENQUANTO DURAR A FÉ <span>· JOTA / CORPO</span></p>
        <a href="/pt/enquanto-durar-a-fe/animatic-material">Ver Portão material ↗</a>
      </header>

      <section className={styles.stage} aria-labelledby="jota-title">
        <div className={styles.canvasShell} ref={containerRef} role="img" aria-label="Quatro bonecos do Jota com 1,83 m, do corpo quase normal ao mais esticado e o medido no desenho, mais o modelo 3D gerado no Meshy com as cores do site, sem e com o traço da textura, ao lado de um cameraman de 1,75 m, numa luz de fim de tarde" />
        <div className={styles.labels} aria-hidden="true">
          {labels.map((label, index) => (
            <div key={label.title} className={styles.label} ref={(element) => { labelsRef.current[index] = element; }}>
              <strong>{label.title}</strong>
              <span>{label.detail}</span>
            </div>
          ))}
        </div>
        <div className={styles.copy}>
          <p>TESTE DE CORPO · NÃO É O PERSONAGEM FINAL</p>
          <h1 id="jota-title">Jota / corpo</h1>
          <span>Mesma altura: três graus de estiramento, as medidas do desenho 2D aprovado e, na ponta, o modelo do Meshy com as cores do site, sem e com o traço da textura.</span>
        </div>
        <nav className={styles.controls} aria-label="Ângulo dos bonecos">
          {VIEWS.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={!spin && view === index} onClick={() => chooseView(index)}>{item.label}</button>
          ))}
          <button type="button" aria-pressed={spin} onClick={toggleSpin}>Girar</button>
        </nav>
      </section>
    </main>
  );
}
