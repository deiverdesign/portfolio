import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Cena 3 — a cidade em volta do Opala (montagem do Deiver, 13/10): uma rua comprida que some
// no fundo, prédios altos azuis à esquerda, comércio baixo com portas de enrolar à direita,
// postes com luz amarela, fios caindo entre eles e asfalto molhado refletindo tudo.
// Tudo em METROS, no mesmo espaço do carro: o carro na origem, a rua correndo no eixo z
// (o fundo da rua é -z, a câmera fica em +z). x = largura da rua.
export const CITY = {
  // Meio da rua até o meio-fio, e até a parede das construções.
  curbX: 5,
  wallX: 7.6,
  // Até onde a rua vai, para a frente (atrás da câmera) e para o fundo.
  nearZ: 26,
  farZ: -150,
  curbHeight: .16,
};

// Paleta da montagem: azuis de prédio (luz / meio / sombra), janelas, rosa do céu nas bordas
// e amarelo das lâmpadas.
const COLORS = {
  front: "#2c40ad",
  side: "#1b2a86",
  back: "#0b1655",
  roof: "#0a1350",
  window: "#0c1a5e",
  windowFrame: "#3b52c6",
  litWindow: "#f2d27c",
  band: "#3a50c2",
  shutter: "#24359c",
  shutterLine: "#101c64",
  rim: "#ff5a8c",
  haze: "#4b3a9e",
  ink: "#04071f",
  pole: "#060a28",
  lamp: "#fff3a6",
  sidewalk: "#17277a",
  curbLight: "#7083dc",
  curbDark: "#16216c",
  road: "#0f2058",
  roadFar: "#1b2a6e",
  wire: "#03051a",
};

// Postes: um de cada lado, alternados, a cada ~19 m. O braço curvo sai para o meio da rua.
export type Lamp = { base: THREE.Vector3; head: THREE.Vector3 };

// Prédio = caixa. style: x = altura de cada andar, y = largura de cada janela (coluna),
// z = altura do topo (para o fio rosa da borda de cima). kind: 0 = prédio alto, 1 = loja.
type Block = { x0: number; x1: number; z0: number; z1: number; height: number; floor: number; column: number; kind: number };

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export function buildCity() {
  const city = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // --- Construções -------------------------------------------------------------------------
  const blocks: Block[] = [];
  // Esquerda: prédios altos (8 a 13 andares), lado a lado, com pequenas variações de recuo.
  let z = CITY.nearZ;
  let i = 0;
  while (z > CITY.farZ) {
    const length = 14 + hash(i + 1) * 12;
    const floors = 8 + Math.floor(hash(i + 7) * 6);
    const setback = hash(i + 3) < .3 ? 1.2 : 0;
    blocks.push({ x0: -CITY.wallX - setback - 14, x1: -CITY.wallX - setback, z0: z - length, z1: z, height: 3.6 + floors * 3, floor: 3, column: 1.5 + hash(i + 9) * .6, kind: 0 });
    z -= length + (hash(i + 5) < .25 ? 3 : .3);
    i++;
  }
  // Direita: comércio baixo (2 andares), com um prédio médio de vez em quando.
  z = CITY.nearZ;
  i = 0;
  while (z > CITY.farZ) {
    const length = 9 + hash(i + 21) * 8;
    const tall = hash(i + 23) < .22;
    const height = tall ? 14 + hash(i + 25) * 6 : 6.6 + hash(i + 27) * 2.2;
    blocks.push({ x0: CITY.wallX, x1: CITY.wallX + 12, z0: z - length, z1: z, height, floor: 3.2, column: 2.2, kind: 1 });
    z -= length + .25;
    i++;
  }

  const pieces: THREE.BufferGeometry[] = [];
  blocks.forEach((block) => {
    const geometry = new THREE.BoxGeometry(block.x1 - block.x0, block.height, block.z1 - block.z0);
    geometry.translate((block.x0 + block.x1) / 2, block.height / 2, (block.z0 + block.z1) / 2);
    const count = geometry.getAttribute("position").count;
    const style = new Float32Array(count * 4);
    for (let v = 0; v < count; v++) style.set([block.floor, block.column, block.height, block.kind], v * 4);
    geometry.setAttribute("aStyle", new THREE.BufferAttribute(style, 4));
    pieces.push(geometry);
  });
  const buildingGeometry = mergeGeometries(pieces)!;
  pieces.forEach((piece) => piece.dispose());
  const buildingMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uFront: { value: new THREE.Color(COLORS.front) },
      uSide: { value: new THREE.Color(COLORS.side) },
      uBack: { value: new THREE.Color(COLORS.back) },
      uRoof: { value: new THREE.Color(COLORS.roof) },
      uWindow: { value: new THREE.Color(COLORS.window) },
      uFrame: { value: new THREE.Color(COLORS.windowFrame) },
      uLit: { value: new THREE.Color(COLORS.litWindow) },
      uBand: { value: new THREE.Color(COLORS.band) },
      uShutter: { value: new THREE.Color(COLORS.shutter) },
      uShutterLine: { value: new THREE.Color(COLORS.shutterLine) },
      uRim: { value: new THREE.Color(COLORS.rim) },
      uHaze: { value: new THREE.Color(COLORS.haze) },
    },
    vertexShader: /* glsl */ `
      attribute vec4 aStyle;
      varying vec3 vPoint;
      varying vec3 vNormal;
      varying vec4 vStyle;
      varying float vDistance;
      void main() {
        vPoint = position;
        vNormal = normal;
        vStyle = aStyle;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vDistance = distance(world.xyz, cameraPosition);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uFront, uSide, uBack, uRoof, uWindow, uFrame, uLit, uBand, uShutter, uShutterLine, uRim, uHaze;
      varying vec3 vPoint;
      varying vec3 vNormal;
      varying vec4 vStyle;
      varying float vDistance;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      void main() {
        vec3 n = normalize(vNormal);
        float floorHeight = vStyle.x;
        float column = vStyle.y;
        float top = vStyle.z;
        float shop = vStyle.w;
        // Fachada virada para a rua (o meio da rua é x = 0) = a face clara.
        float street = step(.5, -n.x * sign(vPoint.x));
        float towardCamera = step(.5, n.z);
        vec3 color = uBack;
        if (n.y > .5) color = uRoof;
        else if (street > .5) color = uFront;
        else if (towardCamera > .5) color = uSide;
        if (n.y < .5 && (street > .5 || towardCamera > .5)) {
          // Coordenada ao longo da fachada: z na frente, x na lateral.
          float along = street > .5 ? vPoint.z : vPoint.x;
          float ground = shop > .5 ? 3.4 : 3.6;
          if (vPoint.y < ground) {
            // Térreo: portas de enrolar (ripas horizontais) entre pilares.
            float bay = fract(along / 4.2);
            float slat = step(.5, fract(vPoint.y / .09));
            vec3 shutter = mix(uShutter, uShutterLine, slat * .55);
            float pillar = step(bay, .07) + step(.93, bay);
            color = mix(shutter, color, clamp(pillar, 0.0, 1.0));
            color = mix(color, uBand * .8, step(ground - .35, vPoint.y));
          } else {
            float y = vPoint.y - ground;
            float row = fract(y / floorHeight);
            float cell = fract(along / column);
            vec2 id = vec2(floor(along / column), floor(y / floorHeight));
            float inside = step(.18, cell) * step(cell, .82) * step(.3, row) * step(row, .86);
            float frame = step(.12, cell) * step(cell, .88) * step(.24, row) * step(row, .9);
            vec3 glass = hash(id + floor(vPoint.x * .1)) > .94 ? uLit : uWindow;
            color = mix(color, uFrame, frame * (1.0 - inside) * .7);
            color = mix(color, glass, inside);
            // Faixa de laje entre os andares (sacadas em linha, como na montagem).
            color = mix(color, uBand, step(row, .08) * (1.0 - shop * .6));
          }
        }
        // Fio rosa do céu na borda de cima de cada construção.
        color = mix(color, uRim, step(top - .28, vPoint.y) * step(n.y, .5) * .85);
        if (n.y > .5) color = mix(color, uRim, .18);
        // Longe, tudo vai para um violeta de névoa (dá profundidade à rua).
        color = mix(color, uHaze, smoothstep(60.0, 300.0, vDistance) * .75);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const buildings = new THREE.Mesh(buildingGeometry, buildingMaterial);
  city.add(buildings);
  // Contorno de desenho nas quinas.
  const edgeGeometry = new THREE.EdgesGeometry(buildingGeometry, 30);
  const inkMaterial = new THREE.LineBasicMaterial({ color: COLORS.ink });
  city.add(new THREE.LineSegments(edgeGeometry, inkMaterial));
  disposables.push(buildingGeometry, buildingMaterial, edgeGeometry, inkMaterial);

  // Marquises das lojas: uma laje fina saindo 1,4 m sobre a calçada, com lâmpadas embaixo.
  const awningMaterial = new THREE.MeshBasicMaterial({ color: COLORS.side });
  const awningPieces: THREE.BufferGeometry[] = [];
  const bulbPoints: number[] = [];
  blocks.filter((block) => block.kind === 1).forEach((block, index) => {
    const geometry = new THREE.BoxGeometry(1.4, .32, block.z1 - block.z0 - .3);
    geometry.translate(block.x0 - .7, 3.25, (block.z0 + block.z1) / 2);
    awningPieces.push(geometry);
    for (let bz = block.z1 - 2; bz > block.z0 + 1; bz -= 3.5 + hash(index) * 1.5) bulbPoints.push(block.x0 - .7, 3.08, bz);
  });
  const awningGeometry = mergeGeometries(awningPieces)!;
  awningPieces.forEach((piece) => piece.dispose());
  city.add(new THREE.Mesh(awningGeometry, awningMaterial));
  const awningEdges = new THREE.EdgesGeometry(awningGeometry, 30);
  city.add(new THREE.LineSegments(awningEdges, inkMaterial));
  const bulbGeometry = new THREE.BufferGeometry();
  bulbGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bulbPoints, 3));
  const bulbMaterial = new THREE.PointsMaterial({ color: COLORS.lamp, size: 5, sizeAttenuation: false });
  city.add(new THREE.Points(bulbGeometry, bulbMaterial));
  disposables.push(awningMaterial, awningGeometry, awningEdges, bulbGeometry, bulbMaterial);

  // --- Calçadas e meio-fio --------------------------------------------------------------------
  const length = CITY.nearZ - CITY.farZ;
  const middleZ = (CITY.nearZ + CITY.farZ) / 2;
  const sidewalkMaterial = new THREE.MeshBasicMaterial({ color: COLORS.sidewalk });
  const curbMaterial = new THREE.ShaderMaterial({
    uniforms: { uLight: { value: new THREE.Color(COLORS.curbLight) }, uDark: { value: new THREE.Color(COLORS.curbDark) }, uHaze: { value: new THREE.Color(COLORS.haze) } },
    vertexShader: /* glsl */ `
      varying vec3 vPoint;
      varying float vDistance;
      void main() {
        vPoint = position;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vDistance = distance(world.xyz, cameraPosition);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    // Meio-fio pintado em faixas claras e escuras alternadas, como na montagem.
    fragmentShader: /* glsl */ `
      uniform vec3 uLight, uDark, uHaze;
      varying vec3 vPoint;
      varying float vDistance;
      void main() {
        vec3 color = mix(uDark, uLight, step(.5, fract(vPoint.z / 2.2)));
        color = mix(color, uHaze, smoothstep(60.0, 300.0, vDistance) * .75);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  [-1, 1].forEach((side) => {
    const walk = new THREE.Mesh(new THREE.BoxGeometry(CITY.wallX - CITY.curbX, CITY.curbHeight, length), sidewalkMaterial);
    walk.position.set(side * (CITY.curbX + CITY.wallX) / 2, CITY.curbHeight / 2, middleZ);
    city.add(walk);
    const curb = new THREE.Mesh(new THREE.BoxGeometry(.3, CITY.curbHeight + .02, length), curbMaterial);
    curb.position.set(side * (CITY.curbX + .15), (CITY.curbHeight + .02) / 2, middleZ);
    city.add(curb);
    disposables.push(walk.geometry, curb.geometry);
  });
  disposables.push(sidewalkMaterial, curbMaterial);

  // --- Postes, lâmpadas e fios ----------------------------------------------------------------
  const lamps: Lamp[] = [];
  const poleMaterial = new THREE.MeshBasicMaterial({ color: COLORS.pole });
  const lampMaterial = new THREE.MeshBasicMaterial({ color: COLORS.lamp });
  const haloTexture = glowTexture();
  const poleHeight = 8.2;
  let k = 0;
  for (let pz = 18; pz > CITY.farZ + 10; pz -= 19) {
    const side = k % 2 === 0 ? -1 : 1;
    const x = side * (CITY.curbX + .55);
    const base = new THREE.Vector3(x, 0, pz);
    const top = new THREE.Vector3(x, poleHeight, pz);
    const head = new THREE.Vector3(x - side * 2.1, poleHeight - .2, pz);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.09, .13, poleHeight, 8), poleMaterial);
    pole.position.set(x, poleHeight / 2, pz);
    city.add(pole);
    // Braço curvo, do alto do poste até a luminária sobre a rua.
    const arm = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(top.clone().add(new THREE.Vector3(0, -.6, 0)), top.clone().add(new THREE.Vector3(-side * .5, .5, 0)), head), 16, .05, 6), poleMaterial);
    city.add(arm);
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(.7, .14, .3), poleMaterial);
    fixture.position.copy(head);
    city.add(fixture);
    const bulb = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .2), lampMaterial);
    bulb.position.copy(head).add(new THREE.Vector3(0, -.08, 0));
    city.add(bulb);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTexture, color: COLORS.lamp, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .55 }));
    halo.position.copy(bulb.position);
    halo.scale.setScalar(2.4);
    city.add(halo);
    disposables.push(pole.geometry, arm.geometry, fixture.geometry, bulb.geometry, halo.material);
    lamps.push({ base, head: bulb.position.clone() });
    k++;
  }
  disposables.push(poleMaterial, lampMaterial, haloTexture);

  // Fios: dois cabos por lado, caindo em curva de um poste ao próximo do mesmo lado.
  const wirePoints: number[] = [];
  [-1, 1].forEach((side) => {
    const own = lamps.filter((lamp) => Math.sign(lamp.base.x) === side);
    own.slice(0, -1).forEach((lamp, index) => {
      const next = own[index + 1];
      [0, .45].forEach((drop) => {
        const a = new THREE.Vector3(lamp.base.x, poleHeight - .9 - drop, lamp.base.z);
        const b = new THREE.Vector3(next.base.x, poleHeight - .9 - drop, next.base.z);
        let previous = a;
        for (let s = 1; s <= 16; s++) {
          const t = s / 16;
          const point = a.clone().lerp(b, t);
          point.y -= Math.sin(t * Math.PI) * 1.1;
          wirePoints.push(previous.x, previous.y, previous.z, point.x, point.y, point.z);
          previous = point;
        }
      });
    });
  });
  const wireGeometry = new THREE.BufferGeometry();
  wireGeometry.setAttribute("position", new THREE.Float32BufferAttribute(wirePoints, 3));
  const wireMaterial = new THREE.LineBasicMaterial({ color: COLORS.wire });
  city.add(new THREE.LineSegments(wireGeometry, wireMaterial));
  disposables.push(wireGeometry, wireMaterial);

  const dispose = () => disposables.forEach((item) => item.dispose());
  return { group: city, lamps, dispose, colors: COLORS };
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(.25, "rgba(255,255,255,.45)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}
