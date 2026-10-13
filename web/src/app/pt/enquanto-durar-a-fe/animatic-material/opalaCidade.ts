import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";

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
  // Rosa das bordas secundárias: menos saturado, puxado para o azul dos prédios.
  rimSoft: "#b85a9e",
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
    const bounds = new Float32Array(count * 4);
    for (let v = 0; v < count; v++) bounds.set([block.x0, block.x1, block.z0, block.z1], v * 4);
    geometry.setAttribute("aBounds", new THREE.BufferAttribute(bounds, 4));
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
      attribute vec4 aBounds;
      varying vec4 vBounds;
      varying vec3 vPoint;
      varying vec3 vNormal;
      varying vec4 vStyle;
      varying float vDistance;
      void main() {
        vPoint = position;
        vNormal = normal;
        vStyle = aStyle;
        vBounds = aBounds;
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
      varying vec4 vBounds;
      varying float vDistance;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      // step() com borda suave de ~1 pixel (w = quanto a coordenada muda de um pixel para o
      // vizinho). Sem isso as bordas das janelas ficavam serrilhadas, principalmente nas
      // fachadas vistas de lado. Ex.: aa(.18, cell, w) = 0 antes de .18 e 1 depois, sem degrau.
      float aa(float edge, float x, float w) { return smoothstep(edge - w, edge + w, x); }
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
            float bayW = fwidth(along / 4.2) * .75;
            float slatX = vPoint.y / .09;
            float slatW = fwidth(slatX) * .75;
            // Ripas finas demais para a tela (longe) viram o tom médio, em vez de tremer.
            float slat = mix(aa(.5, fract(slatX), slatW), .5, smoothstep(.25, .5, slatW));
            vec3 shutter = mix(uShutter, uShutterLine, slat * .55);
            float pillar = 1.0 - aa(.07, bay, bayW) * (1.0 - aa(.93, bay, bayW));
            color = mix(shutter, color, clamp(pillar, 0.0, 1.0));
            color = mix(color, uBand * .8, aa(ground - .35, vPoint.y, fwidth(vPoint.y) * .75));
          } else {
            float y = vPoint.y - ground;
            float row = fract(y / floorHeight);
            float cell = fract(along / column);
            float rowW = fwidth(y / floorHeight) * .75;
            float cellW = fwidth(along / column) * .75;
            vec2 id = vec2(floor(along / column), floor(y / floorHeight));
            float inside = aa(.18, cell, cellW) * (1.0 - aa(.82, cell, cellW)) * aa(.3, row, rowW) * (1.0 - aa(.86, row, rowW));
            float frame = aa(.12, cell, cellW) * (1.0 - aa(.88, cell, cellW)) * aa(.24, row, rowW) * (1.0 - aa(.9, row, rowW));
            // Janelas menores que ~3 pixels (bem no fundo da rua) viram a média delas.
            float tiny = smoothstep(.12, .35, max(cellW, rowW));
            inside = mix(inside, .36, tiny);
            frame = mix(frame, .5, tiny);
            vec3 glass = hash(id + floor(vPoint.x * .1)) > .94 ? uLit : uWindow;
            color = mix(color, uFrame, frame * (1.0 - inside) * .7);
            color = mix(color, glass, inside);
            // Faixa de laje entre os andares (sacadas em linha, como na montagem).
            color = mix(color, uBand, (1.0 - aa(.08, row, rowW)) * (1.0 - shop * .6));
          }
        }
        // O rosa do céu não é pintado na fachada: é uma linha só nas bordas de fora que recebem
        // a luz do céu (veja skyRimEdges).
        // Longe, tudo vai para um violeta de névoa (dá profundidade à rua).
        color = mix(color, uHaze, smoothstep(60.0, 300.0, vDistance) * .75);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const buildings = new THREE.Mesh(buildingGeometry, buildingMaterial);
  city.add(buildings);
  // Arestas das caixas em traço escuro (o desenho do prédio). O rosa vem por cima, só nas
  // bordas que recebem a luz do céu.
  const edgeGeometry = new THREE.EdgesGeometry(buildingGeometry, 30);
  const inkMaterial = new THREE.LineBasicMaterial({ color: COLORS.ink });
  city.add(new THREE.LineSegments(edgeGeometry, inkMaterial));
  const rim = skyRimEdges(blocks);
  city.add(rim.group);
  disposables.push(buildingGeometry, buildingMaterial, edgeGeometry, inkMaterial, rim);

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
        vec3 color = mix(uDark, uLight, smoothstep(.5 - fwidth(vPoint.z / 2.2), .5 + fwidth(vPoint.z / 2.2), fract(vPoint.z / 2.2)));
        color = mix(color, uHaze, smoothstep(60.0, 300.0, vDistance) * .75);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  [-1, 1].forEach((side) => {
    // A calçada começa ATRÁS do meio-fio (curbX + .3). Se as duas caixas tivessem a mesma face
    // virada para a rua, a placa de vídeo não saberia qual desenhar na frente e a face piscaria.
    const walkFrom = CITY.curbX + .3;
    const walk = new THREE.Mesh(new THREE.BoxGeometry(CITY.wallX - walkFrom, CITY.curbHeight, length), sidewalkMaterial);
    walk.position.set(side * (walkFrom + CITY.wallX) / 2, CITY.curbHeight / 2, middleZ);
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
  const halos: THREE.Sprite[] = [];
  const poleHeight = 8.2;
  const poleRim: number[] = [];
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
    const armCurve = new THREE.QuadraticBezierCurve3(top.clone().add(new THREE.Vector3(0, -.6, 0)), top.clone().add(new THREE.Vector3(-side * .5, .5, 0)), head);
    const arm = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 16, .05, 6), poleMaterial);
    city.add(arm);
    // Luz do céu no topo do poste: um fio rosa sobre o lado de cima do braço curvo.
    armCurve.getPoints(16).forEach((point, index, points) => {
      if (index === 0) return;
      poleRim.push(points[index - 1].x, points[index - 1].y + .05, points[index - 1].z, point.x, point.y + .05, point.z);
    });
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
    halos.push(halo);
    disposables.push(pole.geometry, arm.geometry, fixture.geometry, bulb.geometry, halo.material);
    lamps.push({ base, head: bulb.position.clone() });
    k++;
  }
  const poleRimMaterial = new LineMaterial({ color: new THREE.Color(COLORS.rimSoft).getHex(), worldUnits: true, linewidth: .05, transparent: true });
  const poleRimGeometry = new LineSegmentsGeometry().setPositions(poleRim);
  city.add(new LineSegments2(poleRimGeometry, poleRimMaterial));
  disposables.push(poleMaterial, lampMaterial, haloTexture, poleRimMaterial, poleRimGeometry);

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

  // Luzes da cena (pedido do Deiver para a transição): o rosa do céu nas bordas e o amarelo
  // dos postes só acendem depois que o poste escuro sai da frente da câmera.
  // amount 0 = apagadas (lâmpada da cor do poste, sem brilho, sem rosa); 1 = normais.
  const lampOn = new THREE.Color(COLORS.lamp);
  const lampOff = new THREE.Color(COLORS.pole);
  const setLights = (amount: number) => {
    lampMaterial.color.lerpColors(lampOff, lampOn, amount);
    halos.forEach((halo) => { halo.material.opacity = .55 * amount; });
    poleRimMaterial.opacity = amount;
    rim.setOpacity(amount);
  };
  const dispose = () => disposables.forEach((item) => item.dispose());
  return { group: city, lamps, dispose, setLights, colors: COLORS };
}

// Recorte de luz do céu (pedido do Deiver, 13/10): o rosa é a luz que vem da abertura do céu
// sobre a rua e só toca as bordas de fora dos volumes, nunca janelas, fios, persianas ou o meio
// de uma fachada. Para cada construção, só estas bordas:
// - a borda do telhado do lado da rua (platibanda), recortada contra o céu;
// - a borda de cima da face virada para a câmera (o outro lado da silhueta do topo);
// - as quinas verticais do lado da rua, só no trecho que fica acima do vizinho (ou inteiras
//   quando o vizinho está recuado): ali a quina se recorta contra o céu.
// As linhas ficam 3 cm para fora da caixa, para o prédio da frente escondê-las (oclusão) sem
// brigar com a própria fachada. Espessura em metros: fina ao longe, mais presente perto.
// Rosa forte só nos poucos pontos de foco (os prédios altos perto do carro); no resto, um rosa
// menos saturado, que some na névoa ao fundo.
function skyRimEdges(blocks: Block[]) {
  const group = new THREE.Group();
  // Três grupos: foco (rosa forte), perto (rosa suave, espessura em metros) e longe (rosa
  // suave com espessura mínima na tela, senão as bordas do fundo da rua sumiriam).
  const focus: number[] = [];
  const soft: number[] = [];
  const far: number[] = [];
  const focusColors: number[] = [];
  const softColors: number[] = [];
  const farColors: number[] = [];
  const strong = new THREE.Color(COLORS.rim);
  const weak = new THREE.Color(COLORS.rimSoft);
  const haze = new THREE.Color(COLORS.haze);
  const eye = new THREE.Vector3(0, 1.6, 6);
  const out = .03;
  const color = new THREE.Color();
  const add = (isFocus: boolean, a: THREE.Vector3, b: THREE.Vector3) => {
    const distant = !isFocus && Math.min(a.distanceTo(eye), b.distanceTo(eye)) > 60;
    const list = isFocus ? focus : distant ? far : soft;
    const colors = isFocus ? focusColors : distant ? farColors : softColors;
    list.push(a.x, a.y, a.z, b.x, b.y, b.z);
    [a, b].forEach((point) => {
      color.copy(isFocus ? strong : weak).lerp(haze, THREE.MathUtils.smoothstep(point.distanceTo(eye), 70, 220) * .55);
      colors.push(color.r, color.g, color.b);
    });
  };
  const sides = [-1, 1];
  sides.forEach((side) => {
    // Construções deste lado, da mais perto da câmera (z alto) para o fundo.
    const own = blocks.filter((block) => Math.sign(block.x0 + block.x1) === side).sort((p, q) => q.z1 - p.z1);
    own.forEach((block, index) => {
      // Face virada para a rua e a coordenada x dela (um pouco para fora).
      const streetX = side < 0 ? block.x1 + out : block.x0 - out;
      const backX = side < 0 ? block.x0 : block.x1;
      const top = block.height + out;
      const near = block.z1 + out;
      const far = block.z0 - out;
      const isFocus = block.kind === 0 && block.z1 > -45 && block.z0 < 20;
      // Platibanda do lado da rua.
      add(isFocus, new THREE.Vector3(streetX, top, far), new THREE.Vector3(streetX, top, near));
      // Borda de cima da face virada para a câmera (só a parte perto da rua: o resto fica
      // escondido atrás da própria platibanda).
      add(false, new THREE.Vector3(streetX, top, near), new THREE.Vector3(streetX + (backX - streetX) * .35, top, near));
      // Quinas verticais do lado da rua: o trecho acima do vizinho (ou inteiro, se ele recua).
      const before = own[index - 1];
      const after = own[index + 1];
      const exposed = (neighbor: Block | undefined) => {
        if (!neighbor) return 0;
        const neighborStreetX = side < 0 ? neighbor.x1 : neighbor.x0;
        const recessed = Math.abs(neighborStreetX - (side < 0 ? block.x1 : block.x0)) > .5;
        return recessed ? 0 : neighbor.height;
      };
      const farFrom = exposed(after);
      if (block.height - farFrom > 1) add(isFocus, new THREE.Vector3(streetX, farFrom, far), new THREE.Vector3(streetX, top, far));
      const nearFrom = exposed(before);
      if (block.height - nearFrom > 1) add(false, new THREE.Vector3(streetX, nearFrom, near), new THREE.Vector3(streetX, top, near));
    });
  });
  const materials: LineMaterial[] = [];
  ([[focus, focusColors, .26, true], [soft, softColors, .18, true], [far, farColors, 2.4, false]] as const).forEach(([positions, colors, width, worldUnits]) => {
    if (!positions.length) return;
    const material = new LineMaterial({ vertexColors: true, worldUnits, linewidth: width, transparent: true });
    const geometry = new LineSegmentsGeometry().setPositions(positions).setColors(colors);
    group.add(new LineSegments2(geometry, material));
    materials.push(material);
  });
  return {
    group,
    setOpacity: (opacity: number) => {
      group.visible = opacity > .001;
      materials.forEach((material) => { material.opacity = opacity; });
    },
    dispose: () => {
      group.children.forEach((child) => (child as LineSegments2).geometry.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
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
