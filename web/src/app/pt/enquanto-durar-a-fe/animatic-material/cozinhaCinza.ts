import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { METER } from "./celShading";

// Cozinha da Helena (capítulo 3, "A lata azul"). Nasceu em cinza, como referência para o
// Deiver pintar a versão 2D no Gemini; agora usa as cores dessa pintura: tudo em violeta,
// a lâmpada como único ponto quente e a luz vermelha que entra pela janela.
// Tudo aqui é em METROS: o grupo de dentro é escalado por METER no fim.
// Eixos: x = largura (direita positiva, olhando para a janela de dentro da cozinha),
// y = altura, z = profundidade (0 na parede da janela, crescendo para dentro).
export const KITCHEN = {
  width: 4,
  depth: 6,
  height: 2.7,
  windowWidth: 1.5,
  windowSill: .85,
  windowTop: 2.35,
  // Até onde a câmera recua dentro da cozinha (a parede do fundo fica em 6 m).
  cameraBack: 5,
  // Deslocamento final da câmera para a direita, para a mesa e a Helena ficarem à esquerda.
  cameraDrift: .7,
};

const GRAY = {
  wall: "#b4b4af",
  tile: "#d2d2cd",
  floor: "#5c5c59",
  ceiling: "#c4c4bf",
  wood: "#9a9a95",
  woodDark: "#6e6e6a",
  cloth: "#c8c8c3",
  white: "#e4e4e0",
  metal: "#a8a8a8",
  dark: "#4a4a47",
  skin: "#d2d2cd",
  dress: "#8e8e8a",
  hair: "#7a7a76",
};

// Escala de violeta da pintura do Deiver, do quase preto ao lilás claro.
// Cada peça guarda o "cinza" que tinha (0 = preto, 1 = branco) e vira três tons dessa escala:
// luz, meio e sombra. Ex.: parede (cinza 0,7) = luz #4a1c7c, meio #2f1358, sombra #120630.
const VIOLET = ["#06021a", "#1c0b41", "#361662", "#4e1e83", "#7754b4", "#c0a9ee"].map((hex) => new THREE.Color(hex));
function violet(t: number) {
  const scaled = THREE.MathUtils.clamp(t, 0, 1) * (VIOLET.length - 1);
  const index = Math.min(Math.floor(scaled), VIOLET.length - 2);
  return VIOLET[index].clone().lerp(VIOLET[index + 1], scaled - index);
}
const grayValue = (hex: string) => {
  const color = new THREE.Color(hex);
  return color.r * .299 + color.g * .587 + color.b * .114;
};

// Pedaço de shader que transforma a luz do three.js em três faixas chapadas de violeta
// (como a pintura vetorial) e soma a luz vermelha da janela. Coordenadas em metros da cozinha:
// a janela é o retângulo x de -0,75 a 0,75, y de 0,85 a 2,35, na parede z = 0.
const kitchenVertexHead = /* glsl */ `
  varying vec3 vKitchenWorld;
  varying vec3 vKitchenNormal;
`;
const kitchenVertexBody = /* glsl */ `
  vKitchenWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vKitchenNormal = normalize(mat3(modelMatrix) * objectNormal);
`;
const kitchenFragmentHead = /* glsl */ `
  uniform vec3 uLit;
  uniform vec3 uMid;
  uniform vec3 uShade;
  uniform vec3 uRed;
  uniform vec3 uOrigin;
  uniform float uMeter;
  uniform float uRedOn;
  uniform vec2 uBands;
  #ifdef FOUR_TONES
    uniform vec3 uDeep;
    uniform vec3 uOwnBands;
    uniform vec4 uOwnSplit;
  #endif
  varying vec3 vKitchenWorld;
  varying vec3 vKitchenNormal;
`;
const kitchenFragmentBody = /* glsl */ `
  {
    // Quanto de luz chegou aqui (1 = a cor da peça inteira). Abaixo de uBands.x é sombra,
    // acima de uBands.y é luz; no meio, o tom médio. Sem degradê: três faixas duras.
    float texel = dot(diffuseColor.rgb, vec3(.299, .587, .114));
    float amount = dot(outgoingLight, vec3(.299, .587, .114)) / max(texel, 1e-3);
    vec3 tone = amount > uBands.y ? uLit : (amount > uBands.x ? uMid : uShade);
    #ifdef FOUR_TONES
      // Helena: luz própria, vinda de cima e um pouco de trás (do lado da câmera), para as
      // costas mostrarem as quatro cores: topo azul claro, corpo roxo-azulado, laterais rosa,
      // fundo das dobras quase preto. Ex.: ombro virado para cima = azul claro.
      vec3 helenaNormal = normalize(vKitchenNormal) * (gl_FrontFacing ? 1.0 : -1.0);
      float facing = dot(helenaNormal, normalize(vec3(-.35, 1.0, .7))) * .5 + .5;
      tone = facing > uOwnBands.z ? uLit : (facing > uOwnBands.y ? uMid : (facing > uOwnBands.x ? uShade : uDeep));
      // Lado esquerdo dela (o da esquerda da tela) mais escuro, cortado por uma linha
      // inclinada como na pintura do Deiver: passa pela cabeça um pouco à esquerda do meio e
      // desce indo para a direita. uOwnSplit = (x da linha, na altura y, inclinação, escurecimento).
      vec3 helenaPoint = (vKitchenWorld - uOrigin) / uMeter;
      float splitX = uOwnSplit.x + (uOwnSplit.y - helenaPoint.y) * uOwnSplit.z;
      float helenaLitSide = smoothstep(splitX - .004, splitX + .004, helenaPoint.x);
      tone *= mix(uOwnSplit.w, 1.0, helenaLitSide);
    #endif
    // O rejunte do azulejo e do piso é a parte escura da textura.
    tone *= mix(.3, 1.0, smoothstep(.25, .9, texel));

    vec3 p = (vKitchenWorld - uOrigin) / uMeter;
    vec3 n = normalize(vKitchenNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    // Luz vermelha da janela 1: o que está a menos de ~1 m do vão e virado para ele fica vermelho
    // (peitoril, folhas abertas, cortina, chão logo abaixo).
    vec3 nearest = vec3(clamp(p.x, -.75, .75), clamp(p.y, .85, 2.35), 0.0);
    vec3 toWindow = nearest - p;
    float windowDistance = length(toWindow);
    // (O teto fica de fora: na pintura ele continua escuro.)
    float spill = step(.3, dot(n, toWindow / max(windowDistance, 1e-3))) * (1.0 - smoothstep(.7, 1.25, windowDistance)) * step(0.0, p.z) * step(-.5, n.y);
    // Luz vermelha da janela 2: contorno. Só a beirada das peças (onde a superfície vira de lado
    // para a câmera) e só do lado que olha para a janela. Some depois de ~5 m.
    vec3 toCenter = vec3(0.0, 1.6, 0.0) - p;
    float centerDistance = length(toCenter);
    vec3 viewDirection = normalize(cameraPosition - vKitchenWorld);
    // Só em peças curvas (braços, lata, cantos arredondados): numa face reta a normal não
    // muda de um pixel para o outro (fwidth = 0), e as quinas retas já têm a linha vermelha.
    float curved = smoothstep(.002, .02, length(fwidth(n)));
    float rim = curved * step(.3, dot(n, toCenter / centerDistance)) * smoothstep(.74, .8, 1.0 - abs(dot(n, viewDirection))) * (1.0 - smoothstep(3.5, 5.5, centerDistance));
    vec3 red = uRed;
    #ifdef FOUR_TONES
      // Helena: contorno vermelho mais largo, cheio e mais saturado (pedido do Deiver).
      // Vale para quase toda borda que não esteja de costas para a janela, mas só no lado
      // iluminado: o lado esquerdo, na sombra, fica sem vermelho.
      rim = step(-.1, dot(n, toCenter / centerDistance)) * smoothstep(.5, .56, 1.0 - abs(dot(n, viewDirection))) * helenaLitSide;
      red = vec3(1.0, .0, .16);
    #endif
    outgoingLight = mix(tone, red, max(spill * .8, rim) * uRedOn);
  }
  #include <opaque_fragment>
`;

// Grade de azulejo ou de piso desenhada num canvas. Ex.: cells 1 = quadrados lisos com
// rejunte; checker true = piso quadriculado em dois cinzas.
function gridTexture(base: string, line: string, alt: string | null) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = base;
    context.fillRect(0, 0, 128, 128);
    if (alt) {
      context.fillStyle = alt;
      context.fillRect(0, 0, 64, 64);
      context.fillRect(64, 64, 64, 64);
    }
    context.strokeStyle = line;
    context.lineWidth = 3;
    context.strokeRect(0, 0, 64, 64);
    context.strokeRect(64, 0, 64, 64);
    context.strokeRect(0, 64, 64, 64);
    context.strokeRect(64, 64, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// Contorno vermelho de verdade (linha dura) nas quinas que olham para a janela.
// Ex.: a quina da geladeira entre a lateral e a frente, as bordas da mesa perto da janela.
// Para cada aresta "dobrada" (> 30°) da peça, olha as duas faces que ela separa: se uma delas
// está virada para a janela, a aresta ganha a linha vermelha.
const WINDOW_CENTER = new THREE.Vector3(0, 1.6, 0);
function windowEdges(geometry: THREE.BufferGeometry, toKitchen: THREE.Matrix4) {
  const position = geometry.attributes.position;
  const index = geometry.index;
  const count = index ? index.count : position.count;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(toKitchen);
  const edges = new Map<string, { a: THREE.Vector3; b: THREE.Vector3; normals: THREE.Vector3[] }>();
  const corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const key = (v: THREE.Vector3) => `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
  for (let i = 0; i < count; i += 3) {
    for (let k = 0; k < 3; k++) corners[k].fromBufferAttribute(position, index ? index.getX(i + k) : i + k);
    const normal = new THREE.Vector3().subVectors(corners[1], corners[0]).cross(new THREE.Vector3().subVectors(corners[2], corners[0])).normalize();
    for (let k = 0; k < 3; k++) {
      const a = corners[k];
      const b = corners[(k + 1) % 3];
      const keyA = key(a);
      const keyB = key(b);
      const edgeKey = keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
      let edge = edges.get(edgeKey);
      if (!edge) {
        edge = { a: a.clone(), b: b.clone(), normals: [] };
        edges.set(edgeKey, edge);
      }
      edge.normals.push(normal);
    }
  }
  const points: number[] = [];
  const middle = new THREE.Vector3();
  edges.forEach(({ a, b, normals }) => {
    if (normals.length !== 2 || normals[0].dot(normals[1]) > Math.cos(THREE.MathUtils.degToRad(30))) return;
    middle.addVectors(a, b).multiplyScalar(.5).applyMatrix4(toKitchen);
    const toWindow = WINDOW_CENTER.clone().sub(middle);
    if (middle.z < 0 || toWindow.length() > 4.5) return;
    toWindow.normalize();
    const facing = Math.max(...normals.map((normal) => normal.clone().applyMatrix3(normalMatrix).normalize().dot(toWindow)));
    if (facing > .45) points.push(a.x, a.y, a.z, b.x, b.y, b.z);
  });
  return points;
}

export function buildKitchenGray(lineMaterial: LineMaterial, redLineMaterial: LineMaterial) {
  const root = new THREE.Group();
  const kitchen = new THREE.Group();
  kitchen.scale.setScalar(METER);
  root.add(kitchen);

  // Valores divididos por todos os materiais: onde a cozinha está no mundo e quanto de
  // vermelho já entrou (0 = nada, enquanto a câmera ainda está na rua; 1 = cheio).
  const shared = {
    uOrigin: { value: new THREE.Vector3() },
    uMeter: { value: METER },
    uRedOn: { value: 0 },
    uRed: { value: new THREE.Color("#ff2650") },
    uBands: { value: new THREE.Vector2(.16, .7) },
  };
  // Material violeta a partir do cinza antigo. Ex.: violetMaterial("#b4b4af") = parede.
  // map = textura de grade (branca com rejunte escuro); o tom continua vindo do cinza.
  // custom = três cores próprias (luz, meio, sombra), para o que não é violeta (a tampa azul).
  // custom com quatro cores = luz, meio, sombra e fundo, com faixas próprias em fourBands.
  const violetMaterial = (hex: string, map: THREE.Texture | null = null, side: THREE.Side = THREE.FrontSide, custom?: [string, string, string] | [string, string, string, string], fourBands?: [number, number, number], split?: [number, number, number, number]) => {
    const value = grayValue(hex);
    const material = new THREE.MeshLambertMaterial({ color: "#ffffff", map, side });
    const tones = {
      uLit: { value: custom ? new THREE.Color(custom[0]) : violet(value * .95) },
      uMid: { value: custom ? new THREE.Color(custom[1]) : violet(value * .7) },
      uShade: { value: custom ? new THREE.Color(custom[2]) : violet(value * .34) },
      uDeep: { value: new THREE.Color(custom?.[3] ?? "#000000") },
      uOwnBands: { value: new THREE.Vector3(...(fourBands ?? [0, 0, 0])) },
      uOwnSplit: { value: new THREE.Vector4(...(split ?? [-99, 0, 0, 1])) },
    };
    if (custom?.length === 4) material.defines = { FOUR_TONES: "" };
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, shared, tones);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${kitchenVertexHead}`)
        .replace("#include <fog_vertex>", `#include <fog_vertex>\n${kitchenVertexBody}`);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>\n${kitchenFragmentHead}`)
        .replace("#include <opaque_fragment>", kitchenFragmentBody);
    };
    return material;
  };
  const materials = new Map<string, THREE.MeshLambertMaterial>();
  const gray = (hex: string) => {
    let material = materials.get(hex);
    if (!material) {
      material = violetMaterial(hex);
      materials.set(hex, material);
    }
    return material;
  };
  // Põe a peça na cena com sombra e, se edges, o traço escuro nas quinas (como na rua).
  const place = (mesh: THREE.Mesh, parent: THREE.Object3D = kitchen, edges = true) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.windowEdges = edges;
    if (edges) {
      const edgeGeometry = new THREE.EdgesGeometry(mesh.geometry, 30);
      mesh.add(new LineSegments2(new LineSegmentsGeometry().fromEdgesGeometry(edgeGeometry), lineMaterial));
      edgeGeometry.dispose();
    }
    parent.add(mesh);
    return mesh;
  };
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = kitchen, edges = true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    return place(mesh, parent, edges);
  };
  const rounded = (w: number, h: number, d: number, radius: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = kitchen) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material);
    mesh.position.set(x, y, z);
    return place(mesh, parent, false);
  };
  const cylinder = (radiusTop: number, radiusBottom: number, h: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = kitchen, segments = 24) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, h, segments), material);
    mesh.position.set(x, y, z);
    return place(mesh, parent);
  };
  // Cápsula entre dois pontos (braços, pernas). Ex.: capsule(a, b, .06) = um braço de 12 cm de grossura.
  const capsule = (from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material, parent: THREE.Object3D = kitchen) => {
    const length = from.distanceTo(to);
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, .001), 6, 14), material);
    mesh.position.copy(from).add(to).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    return place(mesh, parent, false);
  };
  const sphere = (radius: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = kitchen) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), material);
    mesh.position.set(x, y, z);
    return place(mesh, parent, false);
  };

  const { width, depth, height, windowWidth, windowSill, windowTop } = KITCHEN;
  const half = width / 2;
  const wall = .15;
  const tileTop = 1.5;
  const wallMaterial = gray(GRAY.wall);

  // --- Piso quadriculado, teto e paredes -------------------------------------------
  const floorTexture = gridTexture("#ffffff", "#2a2a2a", "#d8d8d8");
  floorTexture.repeat.set(width / .8, depth / .8);
  const floor = box(width, .05, depth, 0, -.025, depth / 2, violetMaterial(GRAY.floor, floorTexture), kitchen, false);
  floor.castShadow = false;
  box(width, .05, depth, 0, height + .025, depth / 2, gray(GRAY.ceiling), kitchen, false);
  // Parede da direita (geladeira, pia, fogão) e do fundo.
  box(wall, height, depth, half + wall / 2, height / 2, depth / 2, wallMaterial);
  box(width + wall * 2, height, wall, 0, height / 2, depth + wall / 2, wallMaterial);
  // Parede da esquerda com a porta do corredor (de z 3,2 a 4,1).
  const doorFrom = 3.2;
  const doorTo = 4.1;
  const doorTop = 2.1;
  box(wall, height, doorFrom, -half - wall / 2, height / 2, doorFrom / 2, wallMaterial);
  box(wall, height, depth - doorTo, -half - wall / 2, height / 2, (doorTo + depth) / 2, wallMaterial);
  box(wall, height - doorTop, doorTo - doorFrom, -half - wall / 2, (height + doorTop) / 2, (doorFrom + doorTo) / 2, wallMaterial);
  // Batente da porta.
  const trim = gray(GRAY.woodDark);
  box(.04, doorTop, .06, -half + .02, doorTop / 2, doorFrom - .03, trim);
  box(.04, doorTop, .06, -half + .02, doorTop / 2, doorTo + .03, trim);
  box(.04, .06, doorTo - doorFrom + .12, -half + .02, doorTop + .03, (doorFrom + doorTo) / 2, trim);
  // Parede da janela: quatro pedaços em volta do vão.
  const side = (width - windowWidth) / 2;
  box(side, height, wall, -half + side / 2, height / 2, -wall / 2, wallMaterial);
  box(side, height, wall, half - side / 2, height / 2, -wall / 2, wallMaterial);
  box(windowWidth, windowSill, wall, 0, windowSill / 2, -wall / 2, wallMaterial);
  box(windowWidth, height - windowTop, wall, 0, (height + windowTop) / 2, -wall / 2, wallMaterial);

  // Azulejo até 1,5 m, com um filete no topo (cozinha de casa antiga).
  const tileTexture = gridTexture("#ffffff", "#3a3a3a", null);
  const tiles = (w: number, h: number, repeatW: number) => {
    const texture = tileTexture.clone();
    texture.needsUpdate = true;
    texture.repeat.set(repeatW / .3, h / .3);
    return violetMaterial(GRAY.tile, texture);
  };
  const skin = .012;
  box(skin, tileTop, depth, half - skin / 2, tileTop / 2, depth / 2, tiles(depth, tileTop, depth), kitchen, false);
  box(skin, tileTop, doorFrom, -half + skin / 2, tileTop / 2, doorFrom / 2, tiles(doorFrom, tileTop, doorFrom), kitchen, false);
  box(skin, tileTop, depth - doorTo, -half + skin / 2, tileTop / 2, (doorTo + depth) / 2, tiles(depth - doorTo, tileTop, depth - doorTo), kitchen, false);
  box(side, tileTop, skin, -half + side / 2, tileTop / 2, skin / 2, tiles(side, tileTop, side), kitchen, false);
  box(side, tileTop, skin, half - side / 2, tileTop / 2, skin / 2, tiles(side, tileTop, side), kitchen, false);
  box(windowWidth, windowSill, skin, 0, windowSill / 2, skin / 2, tiles(windowWidth, windowSill, windowWidth), kitchen, false);
  const band = gray(GRAY.woodDark);
  box(.02, .04, depth, half - .01, tileTop, depth / 2, band, kitchen, false);
  box(.02, .04, doorFrom, -half + .01, tileTop, doorFrom / 2, band, kitchen, false);
  box(.02, .04, depth - doorTo, -half + .01, tileTop, (doorTo + depth) / 2, band, kitchen, false);
  box(side, .04, .02, -half + side / 2, tileTop, .01, band, kitchen, false);
  box(side, .04, .02, half - side / 2, tileTop, .01, band, kitchen, false);

  // --- Janela: batente, peitoril, duas folhas abertas para dentro e cortina --------
  const frameMaterial = gray(GRAY.white);
  const frame = .07;
  box(windowWidth + frame * 2, frame, .2, 0, windowTop + frame / 2, -.05, frameMaterial);
  box(frame, windowTop - windowSill, .2, -windowWidth / 2 - frame / 2, (windowSill + windowTop) / 2, -.05, frameMaterial);
  box(frame, windowTop - windowSill, .2, windowWidth / 2 + frame / 2, (windowSill + windowTop) / 2, -.05, frameMaterial);
  box(windowWidth + .2, .04, .28, 0, windowSill - .02, .02, frameMaterial);
  // Vaso pequeno no peitoril, encostado no canto esquerdo.
  cylinder(.06, .045, .1, -windowWidth / 2 + .1, windowSill + .05, .05, gray(GRAY.dark));
  sphere(.08, -windowWidth / 2 + .1, windowSill + .16, .05, gray(GRAY.hair));
  // Folhas da janela: moldura com 2 x 3 vidros, abertas ~70° para dentro.
  // A câmera passa pelo meio, longe das duas folhas.
  const sashWidth = windowWidth / 2;
  const sashHeight = windowTop - windowSill;
  // Vidro das folhas: quase invisível na rua, avermelhado quando a luz da janela acende.
  const glassMaterial = new THREE.MeshBasicMaterial({ color: "#ff2650", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  [-1, 1].forEach((sideSign) => {
    const hinge = new THREE.Group();
    hinge.position.set(sideSign * windowWidth / 2, windowSill, .02);
    hinge.rotation.y = sideSign * 1.2;
    kitchen.add(hinge);
    const sash = new THREE.Group();
    sash.position.x = -sideSign * sashWidth / 2;
    hinge.add(sash);
    const bar = .045;
    box(sashWidth, bar, .04, 0, bar / 2, 0, frameMaterial, sash);
    box(sashWidth, bar, .04, 0, sashHeight - bar / 2, 0, frameMaterial, sash);
    box(bar, sashHeight, .04, -sashWidth / 2 + bar / 2, sashHeight / 2, 0, frameMaterial, sash);
    box(bar, sashHeight, .04, sashWidth / 2 - bar / 2, sashHeight / 2, 0, frameMaterial, sash);
    box(.025, sashHeight, .03, 0, sashHeight / 2, 0, frameMaterial, sash);
    box(sashWidth, .025, .03, 0, sashHeight / 3, 0, frameMaterial, sash);
    box(sashWidth, .025, .03, 0, sashHeight * 2 / 3, 0, frameMaterial, sash);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(sashWidth - bar * 2, sashHeight - bar * 2), glassMaterial);
    glass.position.set(0, sashHeight / 2, 0);
    sash.add(glass);
  });
  // Cortina: dois panos ondulados presos num varão, franzidos nas laterais da janela.
  cylinder(.012, .012, windowWidth + .9, 0, windowTop + .16, .1, gray(GRAY.dark)).rotation.z = Math.PI / 2;
  const curtainMaterial = violetMaterial(GRAY.cloth, null, THREE.DoubleSide);
  [-1, 1].forEach((sideSign) => {
    const curtainWidth = .38;
    const curtainHeight = windowTop + .14 - .7;
    const geometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight, 24, 8);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      // Dobras: onda que fica mais funda embaixo, onde o pano está mais solto.
      const looseness = .6 + .4 * (.5 - y / curtainHeight);
      position.setZ(i, Math.sin((x / curtainWidth) * Math.PI * 7) * .035 * looseness);
    }
    geometry.computeVertexNormals();
    const curtain = new THREE.Mesh(geometry, curtainMaterial);
    curtain.position.set(sideSign * (windowWidth / 2 + .2), .7 + curtainHeight / 2, .12);
    place(curtain, kitchen, false);
  });

  // --- Mesa com toalha, lata azul e celular ------------------------------------------
  const tableX = -.8;
  const tableZ = 1.5;
  const tableW = .9;
  const tableD = 1.3;
  const tableH = .76;
  const wood = gray(GRAY.wood);
  box(tableW, .035, tableD, tableX, tableH - .0175, tableZ, wood);
  box(tableW - .1, .08, .02, tableX, tableH - .075, tableZ - tableD / 2 + .06, wood);
  box(tableW - .1, .08, .02, tableX, tableH - .075, tableZ + tableD / 2 - .06, wood);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    box(.05, tableH - .035, .05, tableX + sx * (tableW / 2 - .06), (tableH - .035) / 2, tableZ + sz * (tableD / 2 - .06), wood);
  });
  // Toalha de plástico: tampo um pouco maior e uma saia de 16 cm caindo dos quatro lados.
  const cloth = gray(GRAY.cloth);
  const clothW = tableW + .12;
  const clothD = tableD + .12;
  box(clothW, .006, clothD, tableX, tableH + .003, tableZ, cloth);
  box(clothW, .16, .006, tableX, tableH - .08, tableZ - clothD / 2, cloth);
  box(clothW, .16, .006, tableX, tableH - .08, tableZ + clothD / 2, cloth);
  box(.006, .16, clothD, tableX - clothW / 2, tableH - .08, tableZ, cloth);
  box(.006, .16, clothD, tableX + clothW / 2, tableH - .08, tableZ, cloth);
  // Lata de biscoitos antiga (tampa com aba), algumas notas soltas e um envelope (Deiver:
  // sem celular; o dinheiro e a carta na mesa contam o que os objetos voando contavam).
  const tinX = tableX + .12;
  const tinZ = tableZ + .2;
  cylinder(.1, .1, .13, tinX, tableH + .07, tinZ, gray(GRAY.metal), kitchen, 32);
  const blueLid = violetMaterial(GRAY.dark, null, THREE.FrontSide, ["#3f62e0", "#2a3aa6", "#141a58"]);
  cylinder(.106, .106, .03, tinX, tableH + .145, tinZ, blueLid, kitchen, 32);
  // Notas soltas no lado da mesa que a câmera vê, ao lado da lata. Cédula ~14 × 6,5 cm.
  // Ex.: a laranja (R$ 50) meio por baixo da azul (R$ 100), a rosada (R$ 10) mais solta.
  const banknoteTones: [string, string, string][] = [["#e7a65a", "#b0703a", "#4d2f3a"], ["#7fb0e6", "#4a77b8", "#1f2c5c"], ["#e08a9c", "#a8576e", "#4a2340"]];
  [[.3, .02, .4], [.36, .1, -.35], [.22, .34, 1.1]].forEach(([dx, dz, turn], i) => {
    const note = box(.14, .002, .065, tableX + dx, tableH + .008 + i * .0025, tableZ + dz, violetMaterial(GRAY.white, null, THREE.FrontSide, banknoteTones[i]));
    note.rotation.y = turn;
  });
  // Envelope fechado, do outro lado da lata (para a janela), com o "V" da aba em tinta.
  const envelope = box(.23, .004, .115, tableX + .2, tableH + .009, tableZ - .2, violetMaterial(GRAY.white, null, THREE.FrontSide, ["#d9cdf2", "#a993d6", "#5b4592"]));
  envelope.rotation.y = -.5;
  envelope.add(new LineSegments2(new LineSegmentsGeometry().setPositions([-.115, .0025, -.0575, 0, .0025, .01, 0, .0025, .01, .115, .0025, -.0575]), lineMaterial));
  // Pano de prato dobrado na ponta da mesa.
  box(.22, .015, .14, tableX - .22, tableH + .012, tableZ - .45, gray(GRAY.white));

  // --- Cadeiras de madeira (todas iguais), uma delas com a Helena ---------------------
  // Ex.: chair(x, z, giro) com giro 0 = de frente para a janela (encosto do lado da câmera).
  const chair = (x: number, z: number, turn: number) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = turn;
    kitchen.add(group);
    const seat = .44;
    const size = .42;
    box(size, .035, size, 0, seat, 0, wood, group);
    [[-1, -1], [1, -1]].forEach(([sx, sz]) => box(.035, seat, .035, sx * (size / 2 - .03), seat / 2, sz * (size / 2 - .03), wood, group));
    // Pés de trás sobem e viram o encosto.
    [-1, 1].forEach((sx) => box(.035, .95, .035, sx * (size / 2 - .03), .95 / 2, size / 2 - .03, wood, group));
    box(size, .07, .03, 0, .9, size / 2 - .03, wood, group);
    box(size, .035, .03, 0, .62, size / 2 - .03, wood, group);
    [-.09, 0, .09].forEach((sx) => box(.035, .26, .022, sx, .76, size / 2 - .03, wood, group));
    // Travessas entre os pés.
    box(size - .06, .025, .025, 0, .14, -(size / 2 - .03), wood, group);
    box(size - .06, .025, .025, 0, .14, size / 2 - .03, wood, group);
    return group;
  };
  const helenaChairZ = tableZ + tableD / 2 + .32;
  chair(tableX, helenaChairZ, 0);
  chair(tableX - tableW / 2 - .32, tableZ - .15, -Math.PI / 2);
  chair(tableX + tableW / 2 + .32, tableZ + .1, Math.PI / 2);
  chair(tableX, tableZ - tableD / 2 - .3, Math.PI);

  // --- Helena sentada, de costas para a câmera, antebraços na mesa ----------------------
  // Boneco simples de referência, só até o modelo de verdade (Meshy) terminar de carregar.
  const placeholderFrom = kitchen.children.length;
  const skinMaterial = gray(GRAY.skin);
  const dress = gray(GRAY.dress);
  const hair = gray(GRAY.hair);
  const hx = tableX;
  const hz = helenaChairZ - .02;
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  // Quadril e saia sobre o assento; coxas para a frente; canelas descendo até o chão.
  rounded(.38, .16, .4, .07, hx, .53, hz - .02, dress);
  [-1, 1].forEach((sx) => {
    capsule(v(hx + sx * .09, .54, hz - .05), v(hx + sx * .1, .55, hz - .42), .075, dress);
    capsule(v(hx + sx * .1, .52, hz - .44), v(hx + sx * .11, .08, hz - .48), .05, skinMaterial);
    rounded(.08, .06, .2, .025, hx + sx * .11, .03, hz - .53, gray(GRAY.dark));
  });
  // Tronco levemente inclinado para a mesa.
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.15, .34, 6, 18), dress);
  torso.scale.set(1.15, 1, .78);
  torso.position.set(hx, .86, hz + .01);
  torso.rotation.x = -.16;
  place(torso, kitchen, false);
  // Braços: ombro → cotovelo apoiado na beira da mesa → mãos perto da lata.
  [-1, 1].forEach((sx) => {
    const shoulder = v(hx + sx * .19, 1.07, hz - .03);
    const elbow = v(hx + sx * .2, tableH + .05, hz - .3);
    const hand = v(hx + sx * .07 + .06, tableH + .04, hz - .58);
    capsule(shoulder, elbow, .05, dress);
    capsule(elbow, hand, .042, skinMaterial);
    sphere(.045, hand.x, hand.y, hand.z - .03, skinMaterial);
  });
  // Pescoço, cabeça (rosto comprido) e o coque com cabelo preso.
  capsule(v(hx, 1.12, hz - .04), v(hx, 1.22, hz - .06), .045, skinMaterial);
  const head = sphere(.105, hx, 1.32, hz - .07, skinMaterial);
  head.scale.set(.9, 1.18, 1);
  const hairCap = sphere(.11, hx, 1.35, hz - .05, hair);
  hairCap.scale.set(.93, 1.12, 1);
  sphere(.06, hx, 1.33, hz + .06, hair);
  const helenaPlaceholder = new THREE.Group();
  kitchen.children.slice(placeholderFrom).forEach((child) => helenaPlaceholder.add(child));
  kitchen.add(helenaPlaceholder);

  // Helena de verdade (modelo do Meshy, sentada sem cadeira, de frente para +z, em unidades
  // do modelo). Medidas tiradas do arquivo: pés em y -0,95, embaixo das coxas em y -0,35,
  // costas do quadril em z -0,5. Escala 0,77 = assento a 46 cm (0,6 do modelo × 0,77);
  // a cabeça fica a ~1,46 m e as mãos a ~81 cm, logo acima da mesa.
  // Girada meia volta para olhar a janela. As costas (z -0,51 do modelo) ficam 13 cm atrás do
  // meio do assento, 4 cm antes do encosto (que fica a 17 cm), para não atravessar a cadeira.
  const setHelena = (geometry: THREE.BufferGeometry, outline: THREE.Material) => {
    const scale = .77;
    // Cores da referência do Deiver (figura em azul claro, roxo-azulado, rosa e preto), 18%
    // mais escuras e com a mesma saturação, a pedido dele:
    // luz azul claro, meio roxo-azulado, sombra rosa-magenta, fundo das dobras quase preto.
    // Faixas pela direção da superfície (não pela luz da cena, que deixava as costas só escuras).
    const body = new THREE.Mesh(geometry, violetMaterial(GRAY.dress, null, THREE.FrontSide, ["#2481be", "#3d38ae", "#861066", "#150627"], [.36, .52, .86], [hx - .05, 1.35, .3, .3]));
    body.scale.setScalar(scale);
    body.rotation.y = Math.PI;
    body.position.set(hx, .95 * scale, helenaChairZ + .13 - .51 * scale);
    body.castShadow = true;
    body.receiveShadow = true;
    // Contorno escuro por fora (o mesmo truque do Jota): a malha é muito detalhada para a
    // linha das quinas, que viraria rabisco.
    body.add(new THREE.Mesh(geometry, outline));
    kitchen.add(body);
    kitchen.remove(helenaPlaceholder);
  };

  // --- Lado direito: geladeira com ventilador, bancada com pia, fogão, armários --------
  const white = gray(GRAY.white);
  const dark = gray(GRAY.dark);
  const fridgeZ = .5;
  const fridgeX = half - .38;
  rounded(.7, 1.72, .68, .06, fridgeX, .9, fridgeZ, white);
  box(.66, .02, .02, fridgeX - .35, 1.32, fridgeZ, dark, kitchen, false);
  box(.03, .3, .04, fridgeX - .36, 1.52, fridgeZ - .24, gray(GRAY.metal));
  box(.03, .45, .04, fridgeX - .36, 1.0, fridgeZ - .24, gray(GRAY.metal));
  box(.6, .05, .6, fridgeX, .03, fridgeZ, dark);
  // Ventilador velho em cima da geladeira, virado para a sala.
  const fan = new THREE.Group();
  fan.position.set(fridgeX, 1.76, fridgeZ);
  fan.rotation.y = -Math.PI / 2 + .35;
  kitchen.add(fan);
  cylinder(.11, .13, .04, 0, .02, 0, dark, fan);
  cylinder(.018, .018, .18, 0, .13, 0, gray(GRAY.metal), fan);
  const motor = cylinder(.06, .06, .12, 0, .25, -.02, dark, fan);
  motor.rotation.x = Math.PI / 2;
  const cage = new THREE.Mesh(new THREE.TorusGeometry(.17, .008, 8, 40), gray(GRAY.metal));
  cage.position.set(0, .25, .07);
  place(cage, fan, false);
  const cageBack = cage.clone();
  cageBack.position.z = .02;
  fan.add(cageBack);
  [0, 1, 2].forEach((i) => {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(.07, .15, .008), gray(GRAY.woodDark));
    blade.geometry.translate(0, .08, 0);
    blade.position.set(0, .25, .05);
    blade.rotation.z = i * Math.PI * 2 / 3;
    blade.rotation.y = .3;
    place(blade, fan, false);
  });
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(.005, .34, .005), gray(GRAY.metal));
    spoke.position.set(0, .25, .075);
    spoke.rotation.z = i * Math.PI / 8;
    place(spoke, fan, false);
  }

  // Bancada: armário de baixo com portas, tampo, cuba e torneira.
  const counterFrom = 1.05;
  const counterTo = 3.45;
  const counterLength = counterTo - counterFrom;
  const counterX = half - .3;
  const counterZ = (counterFrom + counterTo) / 2;
  box(.58, .82, counterLength, counterX, .41 + .04, counterZ, white);
  box(.5, .08, counterLength, counterX + .04, .04, counterZ, dark, kitchen, false);
  const doors = Math.round(counterLength / .48);
  for (let i = 0; i <= doors; i++) {
    box(.012, .74, .012, counterX - .295, .45, counterFrom + i * counterLength / doors, gray(GRAY.metal), kitchen, false);
    if (i < doors) box(.02, .1, .02, counterX - .3, .74, counterFrom + (i + .5) * counterLength / doors + .14, gray(GRAY.metal), kitchen, false);
  }
  box(.64, .04, counterLength + .02, counterX - .02, .88, counterZ, gray(GRAY.tile));
  box(.42, .012, .55, counterX - .02, .9, 1.75, dark, kitchen, false);
  cylinder(.015, .015, .26, counterX + .19, 1.03, 1.75, gray(GRAY.metal));
  const spout = cylinder(.012, .012, .18, counterX + .1, 1.15, 1.75, gray(GRAY.metal));
  spout.rotation.z = Math.PI / 2;
  // Escorredor com pratos em pé.
  box(.3, .02, .38, counterX - .02, .91, 2.45, gray(GRAY.metal));
  for (let i = 0; i < 4; i++) {
    const plate = cylinder(.095, .095, .012, counterX - .02, 1.01, 2.3 + i * .1, white, kitchen, 28);
    plate.rotation.x = Math.PI / 2;
  }
  // Fogão de 4 bocas depois da bancada.
  const stoveZ = counterTo + .3;
  box(.58, .86, .56, counterX, .43, stoveZ, white);
  box(.6, .02, .58, counterX, .87, stoveZ, dark);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    cylinder(.07, .07, .015, counterX + sx * .14, .89, stoveZ + sz * .13, dark);
    box(.16, .012, .012, counterX + sx * .14, .9, stoveZ + sz * .13, dark, kitchen, false);
  });
  box(.06, .14, .58, counterX + .27, .97, stoveZ, white);
  box(.01, .32, .4, counterX - .295, .45, stoveZ, dark, kitchen, false);
  box(.03, .02, .36, counterX - .31, .67, stoveZ, gray(GRAY.metal), kitchen, false);
  [-.18, -.06, .06, .18].forEach((dz) => {
    const knob = cylinder(.022, .022, .03, counterX - .3, .8, stoveZ + dz, dark);
    knob.rotation.z = Math.PI / 2;
  });
  // Armários de cima, o "armário mais alto" onde a lata é guardada atrás dos pratos.
  const upperX = half - .18;
  box(.35, .75, counterLength, upperX, 1.85 + .15, counterZ, white);
  for (let i = 0; i <= doors; i++) {
    box(.012, .7, .012, upperX - .176, 2.0, counterFrom + i * counterLength / doors, gray(GRAY.metal), kitchen, false);
    if (i < doors) box(.02, .08, .02, upperX - .18, 1.72, counterFrom + (i + .5) * counterLength / doors + .14, gray(GRAY.metal), kitchen, false);
  }

  // --- Lado esquerdo: máquina de costura, relógio e o corredor --------------------------
  // Mesinha encostada na parede com a máquina de costura (a Helena é costureira).
  const sewZ = 2.65;
  const sewX = -half + .28;
  box(.48, .03, .7, sewX, .74, sewZ, wood);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => box(.035, .72, .035, sewX + sx * .2, .36, sewZ + sz * .31, wood));
  const machine = new THREE.Group();
  machine.position.set(sewX, .755, sewZ);
  machine.rotation.y = Math.PI / 2;
  kitchen.add(machine);
  rounded(.42, .06, .2, .015, 0, .03, 0, dark, machine);
  rounded(.09, .24, .12, .02, .16, .18, 0, dark, machine);
  rounded(.4, .08, .11, .03, .0, .3, 0, dark, machine);
  rounded(.07, .14, .1, .02, -.17, .2, 0, dark, machine);
  cylinder(.05, .05, .03, .2, .26, .07, gray(GRAY.metal), machine).rotation.x = Math.PI / 2;
  // Relógio de parede acima da mesa.
  const clock = cylinder(.15, .15, .04, -half + .03, 2.05, tableZ, white);
  clock.rotation.z = Math.PI / 2;
  box(.01, .1, .012, -half + .055, 2.08, tableZ, dark, kitchen, false);
  box(.01, .012, .08, -half + .055, 2.05, tableZ + .03, dark, kitchen, false);
  // Corredor atrás da porta: aparador com a foto virada para a parede.
  const corridor = new THREE.Group();
  corridor.position.set(-half - wall, 0, 0);
  kitchen.add(corridor);
  const corridorWidth = 1.3;
  box(corridorWidth, .05, 3, -corridorWidth / 2, -.025, (doorFrom + doorTo) / 2, gray(GRAY.floor), corridor, false);
  box(corridorWidth, .05, 3, -corridorWidth / 2, height + .025, (doorFrom + doorTo) / 2, gray(GRAY.ceiling), corridor, false);
  box(wall, height, 3, -corridorWidth - wall / 2, height / 2, (doorFrom + doorTo) / 2, wallMaterial, corridor);
  const sideboardZ = (doorFrom + doorTo) / 2 - .1;
  box(.4, .06, .9, -corridorWidth + .22, .8, sideboardZ, wood, corridor);
  box(.36, .74, .86, -corridorWidth + .22, .4, sideboardZ, gray(GRAY.woodDark), corridor);
  const photo = new THREE.Group();
  photo.position.set(-corridorWidth + .2, .83, sideboardZ + .1);
  photo.rotation.y = Math.PI / 2;
  photo.rotation.x = -.15;
  corridor.add(photo);
  box(.2, .26, .025, 0, .13, 0, gray(GRAY.woodDark), photo);
  box(.02, .2, .02, 0, .1, .06, gray(GRAY.woodDark), photo).rotation.x = .5;

  // --- Luz: lâmpada pendurada sobre a mesa ----------------------------------------------
  // Só a cozinha usa luz do three.js (a rua pinta as próprias faixas), então nada lá fora muda.
  // A luz não aparece como luz: ela só decide em qual das três faixas de violeta cada ponto cai.
  cylinder(.006, .006, .5, tableX, height - .25, tableZ, dark);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.2, .16, 32, 1, true), violetMaterial(GRAY.white, null, THREE.DoubleSide));
  shade.position.set(tableX, height - .55, tableZ);
  place(shade, kitchen, false);
  // Lâmpada: o único ponto quente da cena (laranja da pintura), com um brilho em volta.
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.045, 16, 12), new THREE.MeshBasicMaterial({ color: "#ffb24a" }));
  bulb.position.set(tableX, height - .63, tableZ);
  kitchen.add(bulb);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture(), color: "#ffa23f", blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.setScalar(.42);
  halo.position.copy(bulb.position);
  kitchen.add(halo);
  const lamp = new THREE.PointLight("#ffffff", 3.2, 0, 1.4);
  lamp.position.set(tableX, height - .7, tableZ);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.bias = -.002;
  lamp.shadow.camera.near = .05 * METER;
  lamp.shadow.camera.far = 12 * METER;
  kitchen.add(lamp);
  // Luz geral bem fraca: só o bastante para separar o "meio" da sombra.
  kitchen.add(new THREE.HemisphereLight("#ffffff", "#6a6a6a", .5));
  // Cone de luz da lâmpada no ar (lilás, bem transparente), como na pintura.
  const beamHeight = height - .58;
  const beamGeometry = new THREE.ConeGeometry(1.25, beamHeight, 48, 1, true);
  beamGeometry.translate(0, -beamHeight / 2, 0);
  const beam = new THREE.Mesh(beamGeometry, new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uHeight: { value: beamHeight } },
    vertexShader: /* glsl */ `
      uniform float uHeight;
      varying float vDown;
      varying float vFacing;
      void main() {
        vDown = -position.y / uHeight;
        vec4 view = modelViewMatrix * vec4(position, 1.0);
        vFacing = abs(dot(normalize(normalMatrix * normal), normalize(-view.xyz)));
        gl_Position = projectionMatrix * view;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vDown;
      varying float vFacing;
      void main() {
        float alpha = .07 * pow(vFacing, 1.5) * (1.0 - smoothstep(.55, 1.0, vDown));
        gl_FragColor = vec4(vec3(.66, .54, .9) * alpha, 1.0);
      }
    `,
  }));
  beam.position.set(tableX, height - .58, tableZ);
  beam.renderOrder = 3;
  kitchen.add(beam);

  // --- Brilho vermelho em volta da janela ------------------------------------------------
  // Uma névoa que "vaza" do vão para a parede, forte na beirada e sumindo em ~30 cm.
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uOn: { value: 0 }, uHalf: { value: new THREE.Vector2(windowWidth / 2, (windowTop - windowSill) / 2) } },
    vertexShader: /* glsl */ `
      varying vec2 vPoint;
      void main() {
        vPoint = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOn;
      uniform vec2 uHalf;
      varying vec2 vPoint;
      void main() {
        vec2 outside = abs(vPoint) - uHalf;
        float distanceToOpening = length(max(outside, 0.0)) + min(max(outside.x, outside.y), 0.0);
        float glow = distanceToOpening > 0.0 ? exp(-distanceToOpening / .14) * .6 : .1;
        gl_FragColor = vec4(vec3(1.0, .08, .22) * glow * uOn, 1.0);
      }
    `,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth + 1.4, windowTop - windowSill + 1.4), glowMaterial);
  glow.position.set(0, (windowSill + windowTop) / 2, .025);
  glow.renderOrder = 2;
  kitchen.add(glow);

  // --- Poeira verde flutuando (os pontinhos neon da pintura) -----------------------------
  // Mais perto do chão e das superfícies do que do teto. Cada grão anda devagar no próprio ritmo.
  const dustCount = 240;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustSeeds = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - .5) * (width - .2);
    dustPositions[i * 3 + 1] = Math.pow(Math.random(), 1.8) * (height - .3) + .05;
    dustPositions[i * 3 + 2] = .2 + Math.random() * (depth - .4);
    dustSeeds[i] = Math.random();
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute("aSeed", new THREE.BufferAttribute(dustSeeds, 1));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uPixels: { value: 800 }, uSize: { value: .022 } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixels;
      uniform float uSize;
      varying float vTwinkle;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * .23 + aSeed * 6.28) * .05;
        p.y += sin(uTime * .17 + aSeed * 12.1) * .07;
        p.z += cos(uTime * .19 + aSeed * 9.3) * .05;
        vec4 view = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * view;
        // uSize está em metros; o grupo da cozinha já multiplica tudo por METER.
        float worldSize = uSize * (.5 + aSeed) * length(modelMatrix[0].xyz);
        gl_PointSize = worldSize * uPixels * projectionMatrix[1][1] / -view.z;
        vTwinkle = .55 + .45 * sin(uTime * 1.1 + aSeed * 40.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vTwinkle;
      void main() {
        float r = length(gl_PointCoord - .5);
        float core = 1.0 - smoothstep(.16, .24, r);
        float halo = (1.0 - smoothstep(.1, .5, r)) * .3;
        float alpha = (core + halo) * vTwinkle;
        if (alpha < .01) discard;
        gl_FragColor = vec4(vec3(.76, .96, .74), alpha);
      }
    `,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.frustumCulled = false;
  dust.renderOrder = 4;
  kitchen.add(dust);

  // Linhas vermelhas nas quinas viradas para a janela (calculadas com a cozinha já montada).
  root.updateMatrixWorld(true);
  const toKitchen = new THREE.Matrix4();
  const kitchenInverse = kitchen.matrixWorld.clone().invert();
  const edgeOwners: THREE.Mesh[] = [];
  kitchen.traverse((child) => {
    if (child instanceof THREE.Mesh && child.userData.windowEdges) edgeOwners.push(child);
  });
  edgeOwners.forEach((mesh) => {
    toKitchen.multiplyMatrices(kitchenInverse, mesh.matrixWorld);
    const points = windowEdges(mesh.geometry, toKitchen);
    if (!points.length) return;
    const lines = new LineSegments2(new LineSegmentsGeometry().setPositions(points), redLineMaterial);
    lines.renderOrder = 1;
    mesh.add(lines);
  });

  // Chamado a cada quadro. red = quanto da luz vermelha já acendeu (0 a 1);
  // time em segundos (poeira); pixels = altura da tela em pixels reais (tamanho da poeira).
  const update = ({ red, time, pixels }: { red: number; time: number; pixels: number }) => {
    root.getWorldPosition(shared.uOrigin.value);
    shared.uRedOn.value = red;
    glowMaterial.uniforms.uOn.value = red;
    glassMaterial.opacity = red * .22;
    redLineMaterial.opacity = red;
    redLineMaterial.visible = red > .01;
    dustMaterial.uniforms.uTime.value = time;
    dustMaterial.uniforms.uPixels.value = pixels * .5;
  };

  // space = o grupo em metros da cozinha, onde os bilhetes também são presos.
  return { group: root, space: kitchen, update, setHelena };
}

// Bolinha com borda suave (para o brilho da lâmpada).
function radialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(.25, "rgba(255,255,255,.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}
