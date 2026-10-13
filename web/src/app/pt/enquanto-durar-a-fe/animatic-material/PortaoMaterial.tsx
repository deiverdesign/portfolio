"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import styles from "./material.module.css";
import { KITCHEN, buildKitchenGray } from "./cozinhaCinza";
import { OPALA, WIPE, buildOpalaNight } from "./opala";
import { METER, PALETTE, createCelMaterial, createOutlineMaterial, createPaintedMaterial, disposeObject, m, skyVertexShader } from "./celShading";
import { JOTA_INK, JOTA_RIM } from "../personagem-jota/jotaBands";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { loadJotaFigure } from "../personagem-jota/jotaFigura";

// POC 3 — material. Mesma geometria e mesma trajetória do animatic cinza
// (../animatic/PortaoAnimatic.tsx); aqui muda a "tinta" de cada objeto e a câmera
// sobe para a altura de olho de uma pessoa em pé.

// Ladeira de 40%: sobe 40 cm a cada metro. Medida pela vista lateral do Deiver: 3 imóveis
// de ~8 m de frente, cada um ~3,5 m (um andar) acima do de baixo. TOP_Z é o alto da
// ladeira, onde a rua vira um patamar plano em frente ao muro da última casa.
const ROAD_SLOPE = 0.4;
const TOP_Z = -1.4;
const TOP_Y = 5.5;
const roadY = (z: number) => TOP_Y - ROAD_SLOPE * (z - TOP_Z);
const LOT_LENGTH = 8 * METER;
const LOT_COUNT = 3;
// O patamar tem 3 m de fundo; o muro com o portão fica no fim dele, logo atrás do Jota.
const LANDING_DEPTH = 3 * METER;
const GATE_Z = TOP_Z - LANDING_DEPTH;
// Na planta, o muro e a casa da frente ficam um pouco girados (a ponta da direita mais longe).
const GATE_WALL_TURN = .15;

// O cameraman tem 1,75 m; a lente fica na altura dos olhos dele (~1,64 m).
const EYE_HEIGHT = 1.64 * METER;
// Os trechos do livro flutuam com a borda de baixo a 1,90 m: passam logo acima da
// cabeça do cameraman e nunca bloqueiam o caminho dele.
const PAPER_BOTTOM = 1.9 * METER;

// Trajetória da câmera: desce a ladeira de costas de z .4 até z 34, com um leve
// desvio lateral no meio. cameraPathX diz onde a lente está em cada z, para os objetos
// no ar ficarem sempre ao lado dela, nunca na frente.
const CAMERA_START_Z = .4;
const CAMERA_END_Z = 34;
const CAMERA_START_X = .35;
const CAMERA_END_X = -.5;
const CAMERA_SWAY = .78;
const cameraPathX = (z: number) => {
  const t = THREE.MathUtils.clamp((z - CAMERA_START_Z) / (CAMERA_END_Z - CAMERA_START_Z), 0, 1);
  return THREE.MathUtils.lerp(CAMERA_START_X, CAMERA_END_X, t) + Math.sin(t * Math.PI) * CAMERA_SWAY;
};
// Dali para trás do alto, o chão fica plano.
const groundY = (z: number) => roadY(Math.max(z, TOP_Z));
// Palmeira feita pelo Deiver no Meshy, com a textura pintada do jeito que veio.
const PALM_URL = "/enquanto-durar-a-fe/palmeira-web.glb";
// Helena do Meshy, simplificada para 10% dos triângulos e comprimida (meshopt): 330 KB.
const HELENA_URL = "/enquanto-durar-a-fe/helena-web.glb?v=1";
const MONEY_URL = "/enquanto-durar-a-fe/notas-real-web.glb?v=1";
// Trepadeira do Sketchfab ("Purple Creeper Plant"), só a forma: sem texturas, 1 m de altura,
// origem no alto (é de onde ela fica pendurada). A cor vem toda do site.
const VINE_URL = "/enquanto-durar-a-fe/trepadeira-web.glb?v=2";
// Planta de vaso do Sketchfab ("plant.glb" do Deiver), só a planta (sem o vaso), simplificada:
// 1 m de altura, origem no pé do caule. Pintada com as mesmas cores da trepadeira.
const POTTED_PLANT_URL = "/enquanto-durar-a-fe/planta-vaso-web.glb?v=1";
const PALM_HEIGHT = 6.3;
// Paralelepípedo desenhado pelo Deiver no Figma: a largura da imagem é a largura da rua
// e ela se repete só no comprimento. 1100 × 2120 px em 5 m dá ~9,6 m por repetição.
// O ?v= muda a cada textura nova, senão o navegador mostra a antiga.
const COBBLE_URL = "/enquanto-durar-a-fe/texturas/paralelepipedo.jpg?v=2";
// Fundo da direita (PNGs do Deiver, convertidos para webp de 2048 px).
const BACKDROP_CITY_URL = "/enquanto-durar-a-fe/texturas/fundo-morro-cidade.webp?v=1";
const BACKDROP_TREES_URL = "/enquanto-durar-a-fe/texturas/fundo-morro-frente.webp?v=1";
const COBBLE_ASPECT = 2120 / 1100;
const PAPER_WIDTH = 5.2;
// Bilhete cortado rente ao texto (o Deiver marcou o corte): 1024 × 400 px de textura.
const PAPER_HEIGHT = PAPER_WIDTH * 400 / 1024;

// O papel perto da lente entra grande, quase transparente e desfocado; conforme a
// câmera se afasta ele ganha foco e opacidade. O desfoque usa mipmaps: quanto maior
// uBlur, mais baixa a resolução lida da textura.
const paperVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const paperFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uBlur;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(uMap, vUv, uBlur);
    gl_FragColor = vec4(color.rgb, uOpacity);
    #include <colorspace_fragment>
  }
`;

const AMAZON_URL = "https://www.amazon.com.br/Enquanto-durar-f%C3%A9-Deiver-Brito-ebook/dp/B0H6Y8K6ND";

// Bilhetes: fragmentos do romance, não propaganda. Regra do Deiver:
// - fala vai entre aspas e o rodapé diz quem fala (ex.: "— JOTA");
// - narrador vai sem aspas e, quando tem rodapé, é só o capítulo;
// - "\n" quebra a linha onde o Deiver quebrou; footer vazio = sem rodapé.
type Excerpt = { text: string; footer?: string };

// Cozinha (capítulo 3), na ordem em que saem da lente. Sem spoiler: o visitante vê
// dinheiro guardado e geladeira quase vazia, e monta as próprias hipóteses.
const KITCHEN_EXCERPTS: Excerpt[] = [
  {
    text: "No corredor, uma fotografia antiga descansava sobre um aparador.\nA moldura estava virada para a parede.\nComo acontecia havia meses.",
    footer: "CAPÍTULO 3 — A LATA AZUL",
  },
  { text: "Lá dentro não havia biscoitos.\nNotas dobradas. Comprovantes. Alguns envelopes.\nContou o dinheiro. Depois contou novamente." },
  { text: "Abriu a geladeira.\nHavia pouca coisa dentro.\nUm pedaço de queijo. Leite. Alguns ovos." },
];

// Opala (cena 3): um bilhete só (Deiver, 13/10). Diálogo do capítulo 5, entre a Neide e a
// Helena; com duas vozes, a etiqueta é a do capítulo.
const OPALA_EXCERPTS: Excerpt[] = [
  {
    text: "— Mas as pessoas gostam muito de falar.\n— É verdade.\n— Principalmente quando não conhecem a história inteira.",
    footer: "CAPÍTULO 5 — A COSTUREIRA",
  },
];

// Rua (capítulos 1 e 2), na ordem em que a câmera passa por eles. A sequência primeiro
// aproxima o Jota da rua, depois mostra o jeito dele e por fim deixa a pergunta.
// z = onde o papel fica na ladeira. O espaço entre eles é o que a câmera precisa andar para
// o papel caber inteiro no quadro e ficar um tempo parado ali antes do próximo (o último,
// em 24, fica inteiro quando a descida termina). Entre eles passam o livro (z 8) e o dinheiro (z 14,2).
const BOOK_EXCERPTS: (Excerpt & { z: number; phoneShift: number })[] = [
  { z: 5, phoneShift: -.3, text: "Ele percebe que teria adorado ser criança naquele lugar.", footer: "CAPÍTULO 1 — A SUBIDA" },
  {
    z: 14,
    phoneShift: .1,
    text: "“Maria, posso pedir só um favor?\nPode me dar um copo d’água?\nFique à vontade para recusar.\nÉ mais comum do que você imagina.”",
    footer: "— JOTA",
  },
  { z: 24, phoneShift: -.6, text: "“Jota não é o seu nome, né?”", footer: "— MARIA" },
];

// Quebra o trecho em linhas que cabem no papel (respeitando as quebras do Deiver) e
// diminui a letra até o bloco caber na altura. Ex.: "Jota não é o seu nome, né?" sai em
// 71 px; a fala de quatro linhas do Jota, em ~50 px.
// Linha de crédito (— JOTA, CAPÍTULO 1 — A SUBIDA): IBM Plex Mono medium em caixa alta,
// menor que a citação e com pouco espaço entre letras, como crédito de documento. A citação
// segue em serif. creditFont é a família da Plex que a página carregou.
const CREDIT_FONT_FALLBACK = "'IBM Plex Mono', monospace";
function createTextTexture({ text, footer }: Excerpt, creditFont = CREDIT_FONT_FALLBACK) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 400;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const creditStyle = `500 23px ${creditFont}`;
  drawExcerpt(context, { text, footer }, creditStyle);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // Se a Plex ainda não chegou, redesenha o papel quando ela carregar.
  if (footer && !document.fonts.check(creditStyle)) {
    document.fonts.load(creditStyle).then(() => {
      drawExcerpt(context, { text, footer }, creditStyle);
      texture.needsUpdate = true;
    }).catch(() => {});
  }
  return texture;
}

function drawExcerpt(context: CanvasRenderingContext2D, { text, footer }: Excerpt, creditStyle: string) {
  const { canvas } = context;
  context.fillStyle = "#ebe8c8";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const footerSpace = footer ? 70 : 0;
  let fontSize = text.length > 60 ? 56 : 71;
  let lines: string[] = [];
  for (; fontSize >= 30; fontSize -= 2) {
    context.font = `600 ${fontSize}px Georgia`;
    lines = [];
    text.split("\n").forEach((paragraph) => {
      let line = "";
      paragraph.split(" ").forEach((word) => {
        if (line && context.measureText(`${line} ${word}`).width > 852) {
          lines.push(line);
          line = word;
        } else line = line ? `${line} ${word}` : word;
      });
      lines.push(line);
    });
    if (lines.length * fontSize * 1.16 + footerSpace <= 340) break;
  }
  // Bloco centrado na altura: as linhas, um respiro e o rodapé pequeno embaixo.
  const lineHeight = fontSize * 1.16;
  const blockHeight = lines.length * lineHeight + footerSpace;
  const firstLine = (canvas.height - blockHeight) / 2;
  context.fillStyle = PALETTE.ink;
  lines.forEach((line, index) => context.fillText(line, 86, firstLine + (index + 1) * lineHeight - fontSize * .16));
  if (footer) {
    context.fillStyle = PALETTE.cobalt;
    context.font = creditStyle;
    context.letterSpacing = "0.06em";
    context.fillText(footer.toUpperCase(), 89, firstLine + blockHeight);
    context.letterSpacing = "0px";
  }
}

// Céu: o degradê do Deiver no Figma, com as mesmas cores e posições (0% = topo, 100% = base).
// O Deiver pediu menos azul-noite: ele vai só até 22%, e o verde e o amarelo ganham o resto.
// O degradê fica preso à tela, como o fundo chapado de uma ilustração: não importa para
// onde a câmera olha, o amarelo fica sempre embaixo. SKY_SPAN é a fração da altura da tela
// (de cima para baixo) que o degradê ocupa; abaixo disso é tudo amarelo.
// Direção da luz só do cenário (o Jota segue com a luz dele).
// Rua: sol de trás da câmera (do pé da ladeira), como no teste do Gemini que o Deiver prefere.
const SCENE_LIGHT = new THREE.Vector3(0.42, 0.42, 0.78).normalize();
// Casa do alto: sol do rascunho do Deiver, baixo e bem longe à direita, depois das imagens da cidade.
const HOUSE_SUN = new THREE.Vector3(0.76, 0.3, 0.56).normalize();
// Linha de luz (só na casa do alto): a borda de baixo da faixa de sol do rascunho. O morro e a cidade, lá na
// direita, escondem o sol de tudo que fica abaixo dela; a linha sobe para a esquerda
// (SUN_LINE_RISE metros a cada metro). Só acima dela a face virada para o sol acende.
// Ex.: na casa do alto a linha passa ~4,5 m acima do patamar: telhado e parte de cima da parede
// pegam sol, a parte de baixo, a rua e os muros ficam na sombra.
const SUN_LINE_RISE = 0.3;
const SUN_LINE_HEIGHT = m(6.5);
const SUN_LINE = new THREE.Vector4(SUN_LINE_RISE, 1, 0, SUN_LINE_HEIGHT);
// Sem linha: tudo fica "acima" dela (o resto do cenário).
const NO_SUN_LINE = new THREE.Vector4(0, 1, 0, -1e6);
// Tinta "meio suja", como nas texturas do Deiver: manchas largas, arabescos claros bem
// fracos e pintinhas soltas. Tudo preso ao mundo (não escorrega quando a câmera anda) e
// projetado pela face do objeto (parede usa xy/zy, chão usa xz). Ex.: num muro de 2 m
// aparecem ~3 manchas, alguns riscos curvos e umas 60 pintinhas rosadas.
const DIRT_GLSL = /* glsl */ `
    vec3 dirtNormal = abs(normal);
    vec2 dirtUv = dirtNormal.y > 0.6 ? vWorldPosition.xz : (dirtNormal.x > dirtNormal.z ? vWorldPosition.zy : vWorldPosition.xy);
    float dirtStain = valueNoise(dirtUv * 0.7) * 0.65 + valueNoise(dirtUv * 2.1 + 7.3) * 0.35;
    color *= 0.86 + dirtStain * 0.28;
    float dirtSwirl = (valueNoise(dirtUv * 2.2 + 3.1) + valueNoise(dirtUv * 5.0 - 1.7) * 0.35) * 6.0;
    float dirtLine = 1.0 - smoothstep(0.0, 0.07, abs(fract(dirtSwirl) - 0.5) - 0.42);
    color = mix(color, color * 1.35 + vec3(0.03, 0.0, 0.03), dirtLine * 0.22);
    vec2 dirtCell = floor(dirtUv * 14.0);
    float dirtPick = hash(dirtCell);
    vec2 dirtSpot = fract(dirtUv * 14.0) - 0.5 - (vec2(hash(dirtCell + 1.7), hash(dirtCell + 4.3)) - 0.5) * 0.5;
    float dirtSpeck = step(0.93, dirtPick) * (1.0 - smoothstep(0.09, 0.15, length(dirtSpot)));
    vec3 dirtSpeckColor = dirtPick > 0.985 ? vec3(0.02, 0.02, 0.08) : vec3(0.75, 0.45, 0.62);
    color = mix(color, dirtSpeckColor, dirtSpeck * 0.6);
`;

const SKY_SPAN = 0.55;
const skyGradientShader = /* glsl */ `
  uniform float uSpan;
  uniform vec2 uResolution;
  // Só muda na hora da "foto" da rua para a janela (a foto é maior que a tela).
  uniform float uOffsetY;
  uniform vec3 uStops[5];
  varying vec3 vDirection;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float h = clamp(vDirection.y, 0.0, 1.0);
    float p = clamp((1.0 - (gl_FragCoord.y - uOffsetY) / uResolution.y) / uSpan, 0.0, 1.0);
    vec3 color = uStops[0];
    // Azul-escuro só no topo (até 22%); verde e amarelo ficam com mais da metade.
    color = mix(color, uStops[1], smoothstep(0.22, 0.38, p));
    color = mix(color, uStops[2], smoothstep(0.38, 0.54, p));
    color = mix(color, uStops[3], smoothstep(0.54, 0.74, p));
    color = mix(color, uStops[4], smoothstep(0.74, 0.95, p));

    // Estrelas presas à direção do céu, não à tela; só na parte azul.
    // Cada célula pode ter uma estrela: um ponto redondo e pequeno num lugar sorteado
    // dentro dela (antes a célula inteira acendia e virava um quadrado).
    vec2 starUv = vec2(atan(vDirection.z, vDirection.x) * 70.0, h * 115.0);
    vec2 cell = floor(starUv);
    vec2 spot = fract(starUv) - 0.5 - (vec2(hash(cell + 2.1), hash(cell + 5.7)) - 0.5) * 0.6;
    float starSize = 0.06 + hash(cell + 9.3) * 0.05;
    float star = step(0.975, hash(cell)) * (1.0 - smoothstep(starSize * 0.5, starSize, length(spot))) * (1.0 - smoothstep(0.2, 0.36, p));
    color = mix(color, vec3(0.95, 0.93, 0.7), star * 0.8);

    float grain = hash(floor(gl_FragCoord.xy)) - 0.5;
    color *= 1.0 + grain * 0.12;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;


const TINTA = { sunOrange: "#f0a647", yellow: "#fefb4e", navyDeep: "#060b2c", ink: "#030a1a" };

export function PortaoMaterial({ creditFont = CREDIT_FONT_FALLBACK }: { creditFont?: string } = {}) {
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(TINTA.navyDeep);

    const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 400);

    // A luz só existe para gerar a sombra projetada; a cor vem das faixas do material.
    const sun = new THREE.DirectionalLight("#ffffff", 1);
    sun.target.position.set(0, 0, 8);
    sun.position.copy(sun.target.position).addScaledVector(SCENE_LIGHT, 70);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -34;
    sun.shadow.camera.right = 34;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 160;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.04;
    scene.add(sun, sun.target);

    const world = new THREE.Group();
    scene.add(world);

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(300, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uSpan: { value: SKY_SPAN },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uOffsetY: { value: 0 },
          uStops: { value: ["#00045d", "#00558e", "#41b571", "#a0d939", "#fffd01"].map((hex) => new THREE.Color(hex)) },
        },
        vertexShader: skyVertexShader,
        fragmentShader: skyGradientShader,
      }),
    );
    scene.add(sky);

    // Cores tiradas da pintura do Deiver (pintura-alvo), objeto por objeto. Quase tudo tem
    // só duas leituras: amarelo onde bate luz e azul-marinho na sombra.
    // Lado esquerdo, pelo teste do Gemini: a parede em si é azul (ou roxa); a luz do sol
    // aparece como laranja só onde bate direto. O resto da parede fica na cor dela.
    // O sol vem de trás da câmera (do pé da ladeira), baixo e rente às fachadas da rua.
    // Assim a fachada comprida fica azul e só as pontas viradas para baixo pegam laranja,
    // cortadas em diagonal pela sombra da casa de baixo (como no teste do Gemini).
    const sceneCel = (options: Parameters<typeof createCelMaterial>[0]) => {
      const material = createCelMaterial(options);
      material.uniforms.uLightDirection.value.copy(SCENE_LIGHT);
      material.uniforms.uSunLine = { value: NO_SUN_LINE };
      // Sol mais forte que o padrão: a faixa iluminada começa um pouco mais cedo (0,48 em vez de 0,55).
      material.fragmentShader = material.fragmentShader
        .replace("    float light = facing * shadow;", "    shadow *= step(uSunLine.w, dot(vWorldPosition, uSunLine.xyz) + (valueNoise(vWorldPosition.xz * 1.3 + vWorldPosition.y) - 0.5) * 0.25);\n    float light = facing * shadow;")
        .replace("uniform vec3 uLightDirection;", "uniform vec3 uLightDirection;\n  uniform vec4 uSunLine;")
        .replace("light > 0.55 + edge", "light > 0.48 + edge")
        .replace("    // Objetos no ar quase somem", DIRT_GLSL + "\n    // Objetos no ar quase somem");
      return material;
    };
    // Contorno à mão: um fio de luz amarelo-esverdeado no lado do objeto virado para
    // "direction", sem olhar para o sol. Ex.: amount .3 = fio fino; .6 = meia face.
    const addManualRim = (material: THREE.ShaderMaterial, direction: THREE.Vector3, amount: number) => {
      material.uniforms.uManualRimDirection = { value: direction.clone().normalize() };
      material.uniforms.uManualRimAmount = { value: amount };
      material.uniforms.uManualRimColor = { value: new THREE.Color(JOTA_RIM) };
      material.fragmentShader = material.fragmentShader
        .replace("void main() {", "uniform vec3 uManualRimDirection;\n  uniform float uManualRimAmount;\n  uniform vec3 uManualRimColor;\n\n  void main() {")
        .replace("facing > 0.0) color = uRim;", "facing > 0.0) color = uRim;\n    if (dot(normal, uManualRimDirection) > 1.0 - uManualRimAmount) color = uManualRimColor;");
      return material;
    };
    const WALL_BLUE = { lit: TINTA.sunOrange, mid: "#102783", shade: "#0f2470", deep: "#102783" };
    const WALL_PURPLE = { lit: TINTA.sunOrange, mid: "#422056", shade: "#3e1f55", deep: "#30173f" };
    const wallYellow = sceneCel(WALL_BLUE);
    const leftPurpleMaterial = sceneCel(WALL_PURPLE);
    // Diagonal de sol desenhada, pelo rascunho do Deiver: na fachada virada para a rua, o sol
    // pega só um triângulo em cima. A borda vai de (zStart, yStart), no alto do lado de baixo
    // da ladeira, até (zEnd, yEnd), na ponta de cima da fachada. Acima da linha, laranja;
    // abaixo, a cor da parede. Cada casa tem a sua (dente de serra), não é sombra de verdade.
    // As paredes dessas casas viradas para a câmera ficam sempre na sombra.
    const facadeSunMaterial = (options: Parameters<typeof createCelMaterial>[0], zStart: number, yStart: number, zEnd: number, yEnd: number) => {
      const material = sceneCel(options);
      material.uniforms.uFacadeLine = { value: new THREE.Vector4(zStart, yStart, zEnd, yEnd) };
      material.fragmentShader = material.fragmentShader
        .replace("uniform vec3 uLightDirection;", "uniform vec3 uLightDirection;\n  uniform vec4 uFacadeLine;")
        .replace("    vec3 dirtNormal", `    if (normal.x > 0.5) {
      float facadeT = clamp((vWorldPosition.z - uFacadeLine.x) / (uFacadeLine.z - uFacadeLine.x), 0.0, 1.0);
      bool facadeInside = (vWorldPosition.z - uFacadeLine.x) * (vWorldPosition.z - uFacadeLine.z) <= 0.0;
      color = facadeInside && vWorldPosition.y > mix(uFacadeLine.y, uFacadeLine.w, facadeT) ? uLit : uMid;
    }
    // Paredes viradas para o pé da ladeira (para a câmera), acima dos telhados: sombra, na
    // cor da fachada (o Deiver marcou de verde onde não devia ser laranja).
    else if (normal.z > 0.5) color = uMid;
    vec3 dirtNormal`);
      return material;
    };
    const roadMaterial = sceneCel({ lit: "#1d3692", mid: "#1b2d80", shade: "#1a246d", deep: TINTA.navyDeep });
    const roofMaterial = sceneCel({ lit: "#0d1852", mid: TINTA.navyDeep, shade: TINTA.navyDeep, deep: TINTA.ink, rim: TINTA.yellow, rimAmount: 0.25 });
    // Só formas por enquanto: cada parte com um tom, para ler o volume. Cor e textura
    // entram depois, com os desenhos do Deiver.
    const pavementMaterial = sceneCel({ lit: TINTA.sunOrange, mid: "#1c2f8a", shade: "#0e1647", deep: TINTA.navyDeep });
    // Calçada da esquerda sem sol (pedido do Deiver): o tom "aceso" é o mesmo azul do meio.
    const leftPavementMaterial = sceneCel({ lit: "#1c2f8a", mid: "#1c2f8a", shade: "#0e1647", deep: TINTA.navyDeep });
    const retainingMaterial = sceneCel({ lit: "#4f2663", mid: "#3f215d", shade: "#29246b", deep: TINTA.navyDeep });
    const railMaterial = sceneCel({ lit: TINTA.sunOrange, mid: TINTA.navyDeep, shade: TINTA.navyDeep, deep: TINTA.ink, rim: TINTA.yellow, rimAmount: 0.3 });
    // Na pintura a frente da casa do fundo é clara (meio-tom também claro); só o lado é azul.
    // Casa do fim da rua, com as cores da referência do Deiver (2026-10-10): parede creme
    // azulado na luz e azul médio na sombra; frontão e base amarelos na luz.
    // A casa tem o sol dela, o do rascunho do Deiver: baixo, da direita, e só acima da linha
    // de luz. Ex.: telhado e parte de cima da parede acesos, parte de baixo azul.
    const houseCel = (options: Parameters<typeof createCelMaterial>[0]) => {
      const material = sceneCel(options);
      material.uniforms.uLightDirection.value.copy(HOUSE_SUN);
      material.uniforms.uSunLine.value = SUN_LINE;
      return material;
    };
    // Sombra da casa num azul médio, não marinho (o Deiver achou escura demais).
    const HOUSE_WALL = { lit: "#d0d5b8", mid: "#3a4592", shade: "#343f8a", deep: "#2f3982" };
    const HOUSE_GABLE = { lit: "#d0d5b8", mid: "#3a4592", shade: "#343f8a", deep: "#2f3982" };
    const houseWallMaterial = houseCel(HOUSE_WALL);
    const annexWallMaterial = houseCel(HOUSE_WALL);
    // Tábuas de madeira (lambri horizontal), como nos desenhos de referência do Deiver: a cada
    // 20 cm uma linha escura fina, e logo abaixo dela uma faixa de sombra da tábua de cima.
    // Só nas faces de pé (paredes e frontões), nunca no chão ou no telhado.
    const addSiding = (material: THREE.ShaderMaterial) => {
      material.uniforms.uBoardHeight = { value: m(.2) };
      material.fragmentShader = material.fragmentShader
        .replace("void main() {", "uniform float uBoardHeight;\n\n  void main() {")
        .replace("    vec3 dirtNormal", `    if (abs(normal.y) < 0.5) {
      float boardY = vWorldPosition.y / uBoardHeight;
      float board = fract(boardY);
      float lineDistance = min(board, 1.0 - board) / max(fwidth(boardY), 1e-4);
      float boardLine = 1.0 - clamp(lineDistance - 0.6, 0.0, 1.0);
      color *= 0.9 + 0.1 * smoothstep(0.0, 0.35, 1.0 - board);
      color = mix(color, color * 0.45, boardLine * 0.85);
    }
    vec3 dirtNormal`);
      return material;
    };
    addSiding(houseWallMaterial);
    addSiding(annexWallMaterial);
    // Frontão (o triângulo de cima), pela pintura do Deiver: creme como a parede, e só uma
    // faixa amarela na beira esquerda. A borda da faixa sai da base a 1/4 da meia-largura
    // e sobe até quase o topo, logo à direita do meio. Usa as coordenadas do próprio
    // triângulo (x de -1 a 1 da meia-largura, y de 0 a 1 da altura). Ex.: o ponto
    // (-0.9, 0.1) fica amarelo; (0.2, 0.3) fica creme. Medidas: casa 7,5 × 3,4 m; anexo 6 × 2,4 m.
    const addGableBand = (material: THREE.ShaderMaterial, halfWidth: number, rise: number) => {
      material.uniforms.uGableSize = { value: new THREE.Vector2(halfWidth, rise) };
      material.uniforms.uGableYellow = { value: new THREE.Color("#e4e356") };
      material.vertexShader = material.vertexShader
        .replace("void main() {", "varying vec2 vGable;\n\n  void main() {\n    vGable = position.xy;");
      material.fragmentShader = material.fragmentShader
        .replace("void main() {", "uniform vec2 uGableSize;\n  uniform vec3 uGableYellow;\n  varying vec2 vGable;\n\n  void main() {")
        .replace("    // Ruído de impressão leve", `    vec2 gable = vec2(vGable.x / uGableSize.x, vGable.y / uGableSize.y);
    float bandEdge = mix(-0.75, 0.07, gable.y / 0.88);
    if (distance(color, uLit) < 0.01 && gable.x < bandEdge) color = uGableYellow;
    // Ruído de impressão leve`);
      return material;
    };
    const houseGableMaterial = addSiding(addGableBand(houseCel(HOUSE_GABLE), m(7.5 / 2), m(3.4)));
    const annexGableMaterial = addSiding(addGableBand(houseCel(HOUSE_GABLE), m(6 / 2), m(2.4)));
    const houseBaseMaterial = houseCel({ lit: "#fdfd75", mid: "#c4ccaa", shade: "#1a2a8c", deep: "#16237a" });
    // Vidro das janelas: claro e azulado, como as janelas acesas da pintura de referência.
    const glassMaterial = sceneCel({ lit: "#768358", mid: "#758158", shade: "#606b50", deep: "#606b50" });
    const darkMaterial = sceneCel({ lit: "#161f63", mid: "#0d1852", shade: TINTA.navyDeep, deep: TINTA.ink });
    // Materiais dos objetos no ar: os mesmos tons, mas transparentes perto da lente.
    // O livro grosso de capa preta (um preto azulado, para não furar a paleta) e folhas creme.
    const bookCoverMaterial = createCelMaterial({ lit: "#2a2a44", mid: "#16162c", shade: "#0a0a1c", deep: "#050512", rim: PALETTE.orange, rimAmount: 0.3, nearFade: true });
    const bookPagesMaterial = createCelMaterial({ lit: "#efedc4", mid: "#cfd2c4", shade: "#8a93c4", deep: PALETTE.navy, nearFade: true });
    // Cidade lá embaixo: na pintura, as faces viradas para a luz são amarelas.
    const cityMaterials = [
      sceneCel({ lit: TINTA.yellow, mid: "#20246a", shade: "#08103c", deep: "#08103c" }),
      sceneCel({ lit: "#123388", mid: "#20246a", shade: "#08103c", deep: "#08103c" }),
    ];
    const hillMaterial = sceneCel({ lit: "#08103c", mid: "#08103c", shade: TINTA.ink, deep: TINTA.ink });

    const addBox = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      material: THREE.Material = darkMaterial,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z);
      world.add(mesh);
      return mesh;
    };

    // LADEIRA (só formas, em metros reais), seguindo a planta e a vista lateral do Deiver.
    // Corte da rua, da esquerda para a direita: 3 imóveis atrás do muro | canteiros |
    // calçada 1,2 m | rua 5 m | calçada 1,2 m | mureta com corrimão | barranco e cidade.
    // No alto, a ladeira vira um patamar plano em frente ao muro da última casa, onde
    // fica o portão. Ex.: x = -m(2.5) é a borda esquerda da rua.
    const slopeAngle = Math.atan(ROAD_SLOPE);
    const ROAD_HALF = m(2.5);
    const LEFT_WALK = m(1.2);
    const RIGHT_WALK = m(1.2);
    const CURB = m(.15);
    const STREET_END_Z = TOP_Z + LOT_COUNT * LOT_LENGTH + m(2);
    const leftEdge = -ROAD_HALF - LEFT_WALK;
    const rightEdge = ROAD_HALF + RIGHT_WALK;
    const walkY = (z: number) => roadY(z) + CURB;
    // Laje inclinada que acompanha a rua: de x0 a x1, de z0 (alto) a z1 (baixo), com o topo
    // "top" acima do chão da rua.
    const addSlab = (x0: number, x1: number, z0: number, z1: number, top: number, thickness: number, material: THREE.Material) => {
      const length = (z1 - z0) / Math.cos(slopeAngle);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, thickness, length), material);
      const zc = (z0 + z1) / 2;
      // Inclinada, a caixa sobe um pouco; o centro desce na mesma medida para o topo cair
      // exatamente em roadY + top. Sem isso, duas lajes de espessuras diferentes (ex.: a
      // calçada e a entrada da garagem) ficam quase no mesmo plano e "piscam".
      mesh.position.set((x0 + x1) / 2, roadY(zc) + top - thickness / 2 / Math.cos(slopeAngle), zc);
      mesh.rotation.x = slopeAngle;
      world.add(mesh);
      return mesh;
    };
    // Caixa de topo plano, apoiada no chão de baixo (ponta de baixo da ladeira).
    const addBlock = (x0: number, x1: number, z0: number, z1: number, topY: number, material: THREE.Material) => {
      const bottom = groundY(z1) - m(1);
      return addBox(x1 - x0, topY - bottom, z1 - z0, (x0 + x1) / 2, (topY + bottom) / 2, (z0 + z1) / 2, material);
    };

    // Rua e as duas calçadas, do patamar até o pé da ladeira.
    const roadSlab = addSlab(-ROAD_HALF, ROAD_HALF, TOP_Z, STREET_END_Z, 0, m(.4), roadMaterial);
    // Pele da rua: um plano com o paralelepípedo, colado no topo da laje.
    const cobbleTexture = new THREE.TextureLoader().load(COBBLE_URL);
    cobbleTexture.colorSpace = THREE.SRGBColorSpace;
    cobbleTexture.wrapT = THREE.RepeatWrapping;
    cobbleTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const roadLength = (STREET_END_Z - TOP_Z) / Math.cos(slopeAngle);
    cobbleTexture.repeat.set(1, roadLength / (2 * ROAD_HALF * COBBLE_ASPECT));
    const cobbles = new THREE.Mesh(new THREE.PlaneGeometry(2 * ROAD_HALF, roadLength), createPaintedMaterial(cobbleTexture, "#3a4498"));
    // Deitado na laje: o alto da imagem aponta para o alto da ladeira.
    cobbles.rotation.x = -Math.PI / 2;
    cobbles.position.y = m(.2) + .005;
    cobbles.receiveShadow = true;
    roadSlab.add(cobbles);
    addSlab(leftEdge, -ROAD_HALF, TOP_Z, STREET_END_Z, CURB, m(.5), leftPavementMaterial);
    addSlab(ROAD_HALF, rightEdge, TOP_Z, STREET_END_Z, CURB, m(.5), pavementMaterial);

    // ALTO: patamar plano (a "rua reta") com 3 m de fundo, do muro da esquerda até o
    // barranco. Atrás dele, o muro da última casa, um pouco girado em relação à ladeira
    // (na planta, a ponta da direita fica mais longe), com o portão no meio da rua.
    const topY = roadY(TOP_Z);
    const yardRight = rightEdge + m(5);
    addBox(yardRight - leftEdge, m(3), LANDING_DEPTH + m(1), (leftEdge + yardRight) / 2, topY - m(1.5), TOP_Z - (LANDING_DEPTH + m(1)) / 2, roadMaterial);
    // Quintal: o mesmo nível do patamar, atrás do muro.
    addBox(yardRight - leftEdge, m(3), m(20), (leftEdge + yardRight) / 2, topY - m(1.5), GATE_Z - m(10), pavementMaterial);
    const gateWall = new THREE.Group();
    gateWall.position.set(0, topY, GATE_Z);
    gateWall.rotation.y = GATE_WALL_TURN;
    // Muro baixo, como na pintura: o Jota (1,83 m) aparece inteiro por cima dele.
    const WALL_HEIGHT = m(1.2);
    const GATE_WIDTH = m(1.4);
    const gateWallLeft = leftEdge - m(.3);
    const gateWallRight = yardRight;
    [[gateWallLeft, -GATE_WIDTH / 2], [GATE_WIDTH / 2, gateWallRight]].forEach(([x0, x1]) => {
      const piece = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, WALL_HEIGHT + m(.5), m(.25)), retainingMaterial);
      piece.position.set((x0 + x1) / 2, WALL_HEIGHT / 2 - m(.25), 0);
      gateWall.add(piece);
    });
    // Portão: folha de grade escura, um pouco mais baixa que o muro, com dois pilares.
    const gate = new THREE.Mesh(new THREE.BoxGeometry(GATE_WIDTH, m(1.1), m(.06)), darkMaterial);
    gate.position.y = m(.55);
    gateWall.add(gate);
    [-1, 1].forEach((side) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(m(.35), WALL_HEIGHT + m(.3), m(.35)), retainingMaterial);
      pillar.position.set(side * (GATE_WIDTH / 2 + m(.17)), (WALL_HEIGHT + m(.3)) / 2, 0);
      gateWall.add(pillar);
    });
    world.add(gateWall);
    // Muro do lado esquerdo do quintal, subindo da esquina até o fundo.
    addBox(m(.25), WALL_HEIGHT, m(16), leftEdge - m(.15), topY + WALL_HEIGHT / 2, GATE_Z - m(8), retainingMaterial);
    // CASA DO FIM DA RUA, pelo desenho do Deiver (2026-10-10). Duas partes sobre uma base de
    // 1,2 m: o corpo alto de dois andares, com o frontão virado para a rua e a janela em
    // arco; e o anexo térreo à direita, com o frontão virado para o lado (duas janelas com
    // venezianas e uma janelinha quadrada lá em cima) e a varanda vermelha na frente, onde
    // fica a porta. Ex.: o corpo tem 7,5 m de frente e 7,2 m de parede, o maior volume da
    // rua; o anexo tem 3,8 m de parede, mais baixo, como no desenho.
    const HOUSE_BASE = m(1.2);
    const MAIN_WIDTH = m(7.5);
    const MAIN_DEPTH = m(11);
    const MAIN_X = -m(2.75);
    const house = new THREE.Group();
    house.position.set(m(.5), topY, GATE_Z - m(3) - MAIN_DEPTH / 2);
    house.rotation.y = GATE_WALL_TURN;
    world.add(house);
    const houseTrimMaterial = houseCel({ lit: "#e3fc86", mid: "#5d6fae", shade: "#2c3a7e", deep: "#2a3478" });
    // Telhado azul-noite com a borda do beiral acesa em amarelo, como na referência.
    const houseRoofMaterial = addManualRim(houseCel({ lit: "#0d1852", mid: "#080b28", shade: "#080b28", deep: TINTA.ink }), new THREE.Vector3(.4, .1, .9), .3);
    houseRoofMaterial.uniforms.uManualRimColor.value.set("#f8f76e");
    // Varanda: na referência ela é escura, com pilares e guarda-corpo claros onde bate luz.
    const porchMaterial = houseCel({ lit: "#d8dca8", mid: "#9aa6b8", shade: "#1b2460", deep: "#07091f" });
    // Vidro sem amarelo (o Deiver notou que na referência ele é claro e frio): branco
    // azulado na luz e azul na sombra, seguindo a luz de cada volume da casa.
    const HOUSE_GLASS = { lit: "#d9ece6", mid: "#3d4f8f", shade: "#2b3a7a", deep: "#22306b" };
    const mainGlassMaterial = houseCel(HOUSE_GLASS);
    const annexGlassMaterial = houseCel(HOUSE_GLASS);
    const annexTrimMaterial = houseCel({ lit: "#e3fc86", mid: "#5d6fae", shade: "#2c3a7e", deep: "#2a3478" });
    const addPart = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };
    // Bloco com telhado de duas águas: paredes de "width" × "depth", cumeeira ao longo de z,
    // frontões nas faces ±z. O telhado passa "overhang" para fora das paredes.
    const addGabled = (parent: THREE.Object3D, width: number, depth: number, eave: number, rise: number, overhang: number, wallMaterial: THREE.Material, gableMaterial: THREE.Material) => {
      const block = new THREE.Group();
      parent.add(block);
      addPart(block, new THREE.BoxGeometry(width, eave, depth), wallMaterial, 0, eave / 2, 0);
      const gableShape = new THREE.Shape();
      gableShape.moveTo(-width / 2, 0);
      gableShape.lineTo(width / 2, 0);
      gableShape.lineTo(0, rise);
      gableShape.closePath();
      addPart(block, new THREE.ExtrudeGeometry(gableShape, { depth, bevelEnabled: false }), gableMaterial, 0, eave, -depth / 2);
      const slope = Math.atan2(rise, width / 2);
      const run = width / 2 + overhang;
      const thickness = m(.18);
      [-1, 1].forEach((side) => {
        const slab = addPart(block, new THREE.BoxGeometry(run / Math.cos(slope), thickness, depth + overhang * 2), houseRoofMaterial, side * run / 2, eave + rise - (run / 2) * Math.tan(slope) + thickness / 2 / Math.cos(slope), 0);
        slab.rotation.z = -side * slope;
      });
      return block;
    };
    // Janela virada para +z do grupo: moldura clara, vidro amarelo (luz acesa dentro),
    // cruz de caixilho e, se pedir, as duas venezianas abertas.
    const addWindow = (parent: THREE.Object3D, x: number, y: number, z: number, turn: number, width: number, height: number, shutters: boolean, glass: THREE.Material = mainGlassMaterial, trim: THREE.Material = houseTrimMaterial) => {
      const window = new THREE.Group();
      window.position.set(x, y, z);
      window.rotation.y = turn;
      parent.add(window);
      addPart(window, new THREE.BoxGeometry(width + m(.2), height + m(.2), m(.08)), trim, 0, height / 2, m(.04));
      addPart(window, new THREE.BoxGeometry(width, height, m(.04)), glass, 0, height / 2, m(.08));
      addPart(window, new THREE.BoxGeometry(m(.06), height, m(.05)), trim, 0, height / 2, m(.11));
      addPart(window, new THREE.BoxGeometry(width, m(.06), m(.05)), trim, 0, height * .62, m(.11));
      if (shutters) {
        [-1, 1].forEach((side) => {
          const shutter = addPart(window, new THREE.BoxGeometry(width / 2, height, m(.05)), trim, side * (width * .75 + m(.14)), height / 2, m(.2));
          shutter.rotation.y = side * .45;
        });
      }
      return window;
    };

    // Base de 1,2 m sob o corpo e sob o anexo com a varanda.
    addPart(house, new THREE.BoxGeometry(MAIN_WIDTH + m(.4), HOUSE_BASE, MAIN_DEPTH + m(.4)), houseBaseMaterial, MAIN_X, HOUSE_BASE / 2, 0);
    const ANNEX_X0 = MAIN_X + MAIN_WIDTH / 2;
    const ANNEX_LENGTH = m(6);
    const ANNEX_WIDTH = m(6);
    const ANNEX_FRONT = MAIN_DEPTH / 2 - m(1.5);
    addPart(house, new THREE.BoxGeometry(ANNEX_LENGTH + m(.2), HOUSE_BASE, ANNEX_WIDTH + m(1.7)), houseBaseMaterial, ANNEX_X0 + ANNEX_LENGTH / 2, HOUSE_BASE / 2, ANNEX_FRONT - ANNEX_WIDTH / 2 + m(.85));

    // Corpo alto: 7,2 m de parede (dois andares) e frontão de 3,4 m virado para a rua.
    const mainBlock = addGabled(house, MAIN_WIDTH, MAIN_DEPTH, m(7.2), m(3.4), m(.45), houseWallMaterial, houseGableMaterial);
    mainBlock.position.set(MAIN_X, HOUSE_BASE, 0);
    // Janela em arco na frente, no segundo andar, centralizada na parede.
    const archWidth = m(1.2);
    const archShape = (scale: number) => {
      const w = archWidth * scale;
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, 0);
      shape.lineTo(w / 2, 0);
      shape.lineTo(w / 2, m(1.2) * scale);
      shape.absarc(0, m(1.2) * scale, w / 2, 0, Math.PI, false);
      shape.closePath();
      return shape;
    };
    const arch = new THREE.Group();
    arch.position.set(0, m(4.6), MAIN_DEPTH / 2);
    mainBlock.add(arch);
    // Pintura do Deiver: uma diagonal corta a janela inteira (moldura, vidro e caixilho).
    // À esquerda dela, a luz: moldura azul, vidro amarelo-claro, caixilho laranja. À direita,
    // a sombra: moldura e caixilho marinho, vidro branco. A diagonal sai da base a 35 cm à
    // esquerda do meio e sobe até 43 cm à direita, a 1,68 m de altura (quase no topo do arco).
    // Ex.: o canto de baixo à esquerda é amarelo; o canto de baixo à direita, branco.
    arch.updateWorldMatrix(true, false);
    const archOrigin = new THREE.Vector3().setFromMatrixPosition(arch.matrixWorld);
    const archRight = new THREE.Vector3(1, 0, 0).transformDirection(arch.matrixWorld);
    const archMaterial = (lit: string, shade: string) => {
      const material = houseCel({ lit, mid: lit, shade: lit, deep: lit });
      material.uniforms.uArchOrigin = { value: archOrigin };
      material.uniforms.uArchRight = { value: archRight };
      material.uniforms.uArchLit = { value: new THREE.Color(lit) };
      material.uniforms.uArchShade = { value: new THREE.Color(shade) };
      material.uniforms.uArchLine = { value: new THREE.Vector3(m(-.35), m(.43), m(1.68)) };
      material.fragmentShader = material.fragmentShader
        .replace("void main() {", "uniform vec3 uArchOrigin;\n  uniform vec3 uArchRight;\n  uniform vec3 uArchLit;\n  uniform vec3 uArchShade;\n  uniform vec3 uArchLine;\n\n  void main() {")
        .replace("    // Ruído de impressão leve", `    vec3 archOffset = vWorldPosition - uArchOrigin;
    float archX = dot(archOffset, uArchRight);
    float archY = archOffset.y;
    color = archX < uArchLine.x + archY * (uArchLine.y - uArchLine.x) / uArchLine.z ? uArchLit : uArchShade;
    // Ruído de impressão leve`);
      return material;
    };
    const archFrameMaterial = archMaterial("#3a6bd6", "#2c2e7c");
    const archMuntinMaterial = archMaterial("#e0a25c", "#2c2e7c");
    addPart(arch, new THREE.ExtrudeGeometry(archShape(1.15), { depth: m(.08), bevelEnabled: false }), archFrameMaterial, 0, -m(.1), 0);
    addPart(arch, new THREE.ExtrudeGeometry(archShape(1), { depth: m(.1), bevelEnabled: false }), archMaterial("#fbe9a3", "#e7ebe6"), 0, 0, 0);
    addPart(arch, new THREE.BoxGeometry(m(.06), m(1.8), m(.05)), archMuntinMaterial, 0, m(.9), m(.12));
    addPart(arch, new THREE.BoxGeometry(archWidth, m(.06), m(.05)), archMuntinMaterial, 0, m(.95), m(.12));
    // Lateral direita, segundo andar: duas janelas com venezianas, acima do telhado do anexo.
    [m(1.8), -m(3.6)].forEach((z) => addWindow(mainBlock, MAIN_WIDTH / 2, m(4.7), z, Math.PI / 2, m(1), m(1.5), true));

    // Anexo: cumeeira entrando no corpo, frontão virado para a direita (+x).
    const annex = addGabled(house, ANNEX_WIDTH, ANNEX_LENGTH + m(.5), m(3.8), m(2.4), m(.4), annexWallMaterial, annexGableMaterial);
    annex.position.set(ANNEX_X0 + (ANNEX_LENGTH - m(.5)) / 2, HOUSE_BASE, ANNEX_FRONT - ANNEX_WIDTH / 2);
    annex.rotation.y = Math.PI / 2;
    const annexGableZ = (ANNEX_LENGTH + m(.5)) / 2;
    [-m(1.5), m(1.5)].forEach((x) => addWindow(annex, x, m(.8), annexGableZ, 0, m(1), m(1.8), true, annexGlassMaterial, annexTrimMaterial));
    addWindow(annex, m(.6), m(4.15), annexGableZ, 0, m(.6), m(.6), false, annexGlassMaterial, annexTrimMaterial);
    // Porta na frente do anexo (lado da rua), com bandeira de vidro em cima.
    addWindow(annex, -ANNEX_WIDTH / 2, 0, m(.9), -Math.PI / 2, m(1.1), m(2.5), false, annexGlassMaterial, annexTrimMaterial);

    // Varanda vermelha na frente do anexo: dois pilares, vigas, guarda-corpo de 1 m com
    // balaústres a cada 30 cm e uma laje fina de cobertura.
    const porchX0 = ANNEX_X0 + m(.3);
    const porchX1 = ANNEX_X0 + m(4);
    const porchZ0 = ANNEX_FRONT;
    const porchZ1 = MAIN_DEPTH / 2 - m(.1);
    const porchTop = HOUSE_BASE + m(2.9);
    [porchX0, porchX1].forEach((x) => addPart(house, new THREE.BoxGeometry(m(.16), porchTop - HOUSE_BASE, m(.16)), porchMaterial, x, (porchTop + HOUSE_BASE) / 2, porchZ1));
    addPart(house, new THREE.BoxGeometry(porchX1 - porchX0 + m(.16), m(.25), m(.16)), porchMaterial, (porchX0 + porchX1) / 2, porchTop, porchZ1);
    addPart(house, new THREE.BoxGeometry(m(.16), m(.25), porchZ1 - porchZ0), porchMaterial, porchX1, porchTop, (porchZ0 + porchZ1) / 2);
    addPart(house, new THREE.BoxGeometry(porchX1 - porchX0 + m(.6), m(.2), porchZ1 - porchZ0 + m(.4)), annexWallMaterial, (porchX0 + porchX1) / 2, porchTop + m(.25), (porchZ0 + porchZ1) / 2 + m(.2));
    const railTop = HOUSE_BASE + m(1);
    addPart(house, new THREE.BoxGeometry(porchX1 - porchX0, m(.07), m(.07)), porchMaterial, (porchX0 + porchX1) / 2, railTop, porchZ1);
    addPart(house, new THREE.BoxGeometry(m(.07), m(.07), porchZ1 - porchZ0), porchMaterial, porchX1, railTop, (porchZ0 + porchZ1) / 2);
    const balusterGeometry = new THREE.BoxGeometry(m(.04), m(1), m(.04));
    for (let x = porchX0 + m(.3); x < porchX1 - m(.1); x += m(.3)) addPart(house, balusterGeometry, porchMaterial, x, HOUSE_BASE + m(.5), porchZ1);
    for (let z = porchZ0 + m(.3); z < porchZ1 - m(.1); z += m(.3)) addPart(house, balusterGeometry, porchMaterial, porchX1, HOUSE_BASE + m(.5), z);

    // ESQUERDA: muro contínuo na borda da calçada e, atrás dele, 3 imóveis de 8 m de frente,
    // cada um um degrau acima do de baixo. De cima para baixo:
    // 1. a casa com telhado de 4 águas e portão de garagem, colada na calçada;
    // 2. o anexo, baixo, com uma torre (a parte mais alta) encostada na casa;
    // 3. uma casa baixa com chaminé e, no pé da ladeira, só muro.
    const LEFT_WALL_HEIGHT = m(1);
    // Dente do muro: perto do pé da ladeira ele recua 1,2 m para dentro por 3 m e abre
    // espaço para um canteiro grande.
    const notchZ1 = STREET_END_Z - m(3.5);
    const notchZ0 = notchZ1 - m(3);
    // O muro só existe onde não há fachada: no mesmo plano que ela, os dois brigam pelo
    // pixel e a parede "pisca" em quadradinhos. Ex.: os dois imóveis de cima ocupam a frente toda.
    const leftWallStart = TOP_Z + 2 * LOT_LENGTH + m(5.5);
    addSlab(leftEdge - m(.25), leftEdge, leftWallStart, notchZ0, CURB + LEFT_WALL_HEIGHT, LEFT_WALL_HEIGHT + m(2), leftPurpleMaterial);
    addSlab(leftEdge - m(.25), leftEdge, notchZ1, STREET_END_Z, CURB + LEFT_WALL_HEIGHT, LEFT_WALL_HEIGHT + m(2), leftPurpleMaterial);
    addSlab(leftEdge - m(1.45), leftEdge - m(1.2), notchZ0, notchZ1, CURB + LEFT_WALL_HEIGHT, LEFT_WALL_HEIGHT + m(2), leftPurpleMaterial);
    addBlock(leftEdge - m(1.45), leftEdge, notchZ0 - m(.25), notchZ0, walkY(notchZ0) + LEFT_WALL_HEIGHT, leftPurpleMaterial);
    addBlock(leftEdge - m(1.45), leftEdge, notchZ1, notchZ1 + m(.25), walkY(notchZ1) + LEFT_WALL_HEIGHT, leftPurpleMaterial);
    // Canteiro grande do dente: ocupa o recuo e avança 60 cm na calçada.
    addSlab(leftEdge - m(1.2), leftEdge + m(.6), notchZ0, notchZ1, CURB + m(.6), m(1.2), leftPurpleMaterial);
    // Plantas nos canteiros da esquerda: [x, y, z, altura em m]. Entram quando o modelo carrega.
    const plantSpots: [number, number, number, number][] = [];
    // Moita do quintal atrás do muro do portão, à direita (embaixo da varanda, marcada pelo
    // Deiver): plantas em pé no chão do quintal, 1,5–1,7 m, a copa passa por cima do muro de 1,2 m.
    // (Pontas de trepadeira caindo por cima do muro ficaram soltas e esquisitas; saíram.)
    gateWall.updateMatrix();
    for (let across = 0; across <= 3; across += .55) {
      const spot = new THREE.Vector3(GATE_WIDTH / 2 + m(.5 + across), 0, -m(1 + (across * 7 % 3) * .1)).applyMatrix4(gateWall.matrix);
      plantSpots.push([spot.x, spot.y, spot.z, 1.6 + (across * 5 % 3) * .1]);
    }
    [notchZ0 + m(.6), (notchZ0 + notchZ1) / 2, notchZ1 - m(.6)].forEach((z, index) => plantSpots.push([leftEdge - m(index === 1 ? .5 : -.1), walkY(z) + m(.6), z, index === 1 ? 1.6 : 1.3]));
    // Canteiros estreitos (50 cm × 60 cm) encostados no muro, com o topo inclinado como a rua.
    const addPlanter = (z0: number, z1: number) => {
      addSlab(leftEdge, leftEdge + m(.5), z0, z1, CURB + m(.6), m(1.2), leftPurpleMaterial);
      for (let z = z0 + m(.6); z < z1 - m(.3); z += m(1.3)) plantSpots.push([leftEdge + m(.25), walkY(z) + m(.6), z, 1.4]);
    };

    // Onde as trepadeiras caem por cima do muro das casas: [z, alto da fachada, quanto a cortina desce em m].
    // Ex.: no anexo, uma cortina larga (3,8 m) pela beirada de cima, do canto de baixo da ladeira
    // até perto da janela grande, como o Deiver marcou.
    // [z, topo, queda em m, largura em m, planta do quintal?]. Com o último true, a copa fica atrás
    // do muro (dentro do quintal) e só a ponta cai para a rua.
    const vineSpots: [number, number, number, number?, boolean?][] = [];
    const lotFloor = (index: number) => walkY(TOP_Z + index * LOT_LENGTH);
    const lotZ = (index: number) => TOP_Z + index * LOT_LENGTH;
    const houseBack = leftEdge - m(8);
    // Fachada com vãos de verdade, como no desenho do Deiver: a parede da frente é uma placa
    // de 25 cm com buracos; dentro de cada buraco, 18 cm para dentro, fica a porta (escura)
    // ou o vidro (claro). As laterais do buraco aparecem quando a câmera passa de lado.
    // Atrás da placa fica o resto da casa, uma caixa simples.
    type Opening = { zc: number; width: number; bottom: number; height: number; kind: "door" | "window" };
    const FACADE_DEPTH = m(.25);
    const OPENING_DEPTH = m(.18);
    const addFacade = (z0: number, z1: number, top: number, material: THREE.Material, openings: Opening[]) => {
      const bottom = groundY(z1) - m(1);
      const outline = new THREE.Shape();
      outline.moveTo(z0, bottom);
      outline.lineTo(z1, bottom);
      outline.lineTo(z1, top);
      outline.lineTo(z0, top);
      outline.closePath();
      openings.forEach(({ zc, width, bottom: holeBottom, height, kind }) => {
        const hole = new THREE.Path();
        hole.moveTo(zc - width / 2, holeBottom);
        hole.lineTo(zc - width / 2, holeBottom + height);
        hole.lineTo(zc + width / 2, holeBottom + height);
        hole.lineTo(zc + width / 2, holeBottom);
        hole.closePath();
        outline.holes.push(hole);
        const fill = new THREE.Mesh(new THREE.PlaneGeometry(width, height), kind === "door" ? darkMaterial : glassMaterial);
        fill.rotation.y = Math.PI / 2;
        fill.position.set(leftEdge - OPENING_DEPTH, holeBottom + height / 2, zc);
        world.add(fill);
      });
      // A placa é desenhada no plano (z, y) e extrudada para dentro da casa (-x).
      const facade = new THREE.Mesh(new THREE.ExtrudeGeometry(outline, { depth: FACADE_DEPTH, bevelEnabled: false }), material);
      facade.rotation.y = -Math.PI / 2;
      facade.position.x = leftEdge;
      world.add(facade);
      // A caixa de trás fica 2 cm mais baixa e mais curta, para nenhuma face cair no mesmo
      // plano da placa (senão "pisca").
      addBlock(houseBack, leftEdge - FACADE_DEPTH, z0 + m(.02), z1 - m(.02), top - m(.02), material);
    };
    // Telhado de 4 águas: pirâmide cortada no topo, do tamanho da caixa embaixo.
    const addHipRoof = (x0: number, x1: number, z0: number, z1: number, baseY: number, height: number) => {
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(.3, Math.SQRT1_2, 1, 4, 1), roofMaterial);
      roof.rotation.y = Math.PI / 4;
      const holder = new THREE.Group();
      holder.add(roof);
      holder.scale.set(x1 - x0 + m(.6), height, z1 - z0 + m(.6));
      holder.position.set((x0 + x1) / 2, baseY + height / 2, (z0 + z1) / 2);
      world.add(holder);
    };

    // Alturas pela pintura do Deiver: casas de um andar, baixas em relação à rua.
    // 1. Casa do alto: um andar, frente na calçada, garagem na ponta de cima.
    {
      const z0 = lotZ(0);
      const z1 = lotZ(1);
      // O telhado acompanha a rua: altura medida no meio da garagem, não na ponta de cima.
      const top = walkY(z0 + m(3)) + m(3);
      const garageZ = z0 + m(2);
      const sun = facadeSunMaterial(WALL_BLUE, z1 - .43 * (z1 - z0), top, z0, top - .7 * (top - walkY(z0)));
      addFacade(z0, z1, top, sun, [
        { zc: garageZ, width: m(2.6), bottom: walkY(garageZ + m(1.3)), height: m(2.3), kind: "door" },
        { zc: z0 + m(5.3), width: m(1.1), bottom: walkY(z0 + m(5.3)) + m(1), height: m(1.1), kind: "window" },
      ]);
      addHipRoof(houseBack, leftEdge, z0, z1, top, m(1));
    }
    // 2. Anexo: um andar, com a torre encostada na casa de cima.
    {
      const z0 = lotZ(1);
      const z1 = lotZ(2);
      const floor = lotFloor(1);
      const towerTop = floor + m(3);
      addFacade(z0, z0 + m(2.6), towerTop, facadeSunMaterial(WALL_PURPLE, z0 + m(2.6), towerTop, z0, towerTop - m(1.2)), [
        { zc: z0 + m(1.3), width: m(.8), bottom: floor + m(1.8), height: m(.8), kind: "window" },
      ]);
      const annexTop = walkY(z0 + m(4)) + m(2.6);
      vineSpots.push([z1 - m(2.1), annexTop, .45, 2.2, true]);
      addFacade(z0 + m(2.6), z1, annexTop, facadeSunMaterial(WALL_PURPLE, z1, annexTop, z0 + m(2.6), annexTop - .4 * (annexTop - walkY(z0 + m(2.6)))), [
        { zc: z0 + m(5.2), width: m(1.2), bottom: walkY(z0 + m(5.2)) + m(1.8), height: m(1), kind: "window" },
      ]);
      addPlanter(z0 + m(3), z1 - m(.6));
    }
    // 3. Casa baixa com chaminé; o resto do lote, até o pé da ladeira, é só muro.
    {
      const z0 = lotZ(2);
      const top = walkY(z0 + m(2.5)) + m(2.6);
      const z1 = z0 + m(5.5);
      addFacade(z0, z1, top, facadeSunMaterial(WALL_BLUE, z1 - .43 * (z1 - z0), top, z0, top - .55 * (top - walkY(z0))), [
        { zc: z0 + m(3.2), width: m(1.1), bottom: walkY(z0 + m(3.2)) + m(1.7), height: m(.9), kind: "window" },
      ]);
      addBox(m(.6), m(1), m(.6), leftEdge - m(1.5), top + m(.5), z0 + m(1.6), wallYellow);
      // (As trepadeiras desta casa, a do começo da rua, saíram a pedido do Deiver.)
      addPlanter(z0 + m(.6), notchZ0 - m(.4));
    }

    // DIREITA: mureta na borda da calçada com o corrimão em cima. Perto do alto, ela vira um
    // muro de 1,2 m por 3 m. Depois, o barranco que cai para a cidade.
    const wallX0 = rightEdge;
    const wallX1 = wallX0 + m(.25);
    // Corrimão na altura da mão: mureta de 40 cm + barra 55 cm acima dela = 95 cm da calçada
    // (o Jota tem 1,83 m, então a barra fica na altura do quadril dele). O muro alto do
    // começo baixou para 1,2 m, para não jogar uma sombra enorme na rua.
    const LOW_WALL = m(.4);
    const tallWallEnd = TOP_Z + m(3);
    addSlab(wallX0, wallX1 + m(.1), TOP_Z, tallWallEnd, CURB + m(1.2), m(1.2) + m(6), retainingMaterial);
    addSlab(wallX0, wallX1, tallWallEnd, STREET_END_Z, CURB + LOW_WALL, LOW_WALL + m(6), retainingMaterial);
    const RAIL_HEIGHT = m(.55);
    const railX = (wallX0 + wallX1) / 2;
    const postGeometry = new THREE.CylinderGeometry(m(.025), m(.025), RAIL_HEIGHT, 6);
    for (let z = tallWallEnd; z <= STREET_END_Z; z += m(2)) {
      const post = new THREE.Mesh(postGeometry, railMaterial);
      post.position.set(railX, walkY(z) + LOW_WALL + RAIL_HEIGHT / 2, z);
      world.add(post);
    }
    const railLength = (STREET_END_Z - tallWallEnd) / Math.cos(slopeAngle);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(m(.03), m(.03), railLength, 6), railMaterial);
    rail.rotation.x = Math.PI / 2 + slopeAngle;
    const railMid = (tallWallEnd + STREET_END_Z) / 2;
    rail.position.set(railX, walkY(railMid) + LOW_WALL + RAIL_HEIGHT, railMid);
    world.add(rail);

    let disposed = false;
    // Textura pintada (sem luz do site) + o mesmo fio de contorno à mão do poste: o lado
    // virado para a rua e o céu claro ganha amarelo-esverdeado. Ex.: no coqueiro, a borda
    // direita do tronco e a ponta de cima das folhas.
    const PAINTED_RIM_DIRECTION = new THREE.Vector3(1, .35, -.35).normalize();
    const createPaintedRimMaterial = (map: THREE.Texture | null) => new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uMap: { value: map },
        uRimDirection: { value: PAINTED_RIM_DIRECTION },
        uRimAmount: { value: .3 },
        uRimColor: { value: new THREE.Color(JOTA_RIM) },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormalWorld;
        void main() {
          vUv = uv;
          vNormalWorld = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform vec3 uRimDirection;
        uniform float uRimAmount;
        uniform vec3 uRimColor;
        varying vec2 vUv;
        varying vec3 vNormalWorld;
        void main() {
          vec3 normal = normalize(vNormalWorld);
          if (!gl_FrontFacing) normal = -normal;
          vec3 color = texture2D(uMap, vUv).rgb;
          if (dot(normal, uRimDirection) > 1.0 - uRimAmount) color = uRimColor;
          gl_FragColor = vec4(color, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
    const loadPainted = (url: string, place: (model: THREE.Object3D) => void) => {
      new GLTFLoader().load(url, (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const original = child.material as THREE.MeshStandardMaterial;
          child.material = createPaintedRimMaterial(original.map);
          original.dispose();
          child.castShadow = true;
        });
        place(model);
        world.add(model);
      });
    };
    const fitBox = new THREE.Box3();
    const fitSize = new THREE.Vector3();

    // Traço de desenho no cenário: uma linha azul-marinho nas quinas de cada peça (onde as
    // faces dobram mais de 30°), com espessura fixa em pixels, como caneta. Ex.: a quina
    // de uma casa vira um risco; uma parede lisa continua sem linha nenhuma.
    // Só nas peças feitas aqui (Jota tem o contorno dele; palmeira e objetos no ar ficam sem).
    const sceneryLineMaterial = new LineMaterial({ color: TINTA.navyDeep, linewidth: 2 });
    const sceneryMeshes: THREE.Mesh[] = [];
    world.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || child instanceof LineSegments2) return;
      const material = child.material as THREE.Material;
      if (material.transparent || child.geometry instanceof THREE.PlaneGeometry) return;
      sceneryMeshes.push(child);
    });
    sceneryMeshes.forEach((mesh) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 30);
      const line = new LineSegments2(new LineSegmentsGeometry().fromEdgesGeometry(edges), sceneryLineMaterial);
      edges.dispose();
      mesh.add(line);
    });

    // O Jota 3D (o mesmo da página jota-3d), em pé em frente ao portão, de frente para a câmera.
    // Na beira do patamar, onde a ladeira começa: bem perto da câmera no início (~1 m).
    const JOTA_Z = TOP_Z - m(.15);
    const outlineMaterial = createOutlineMaterial({ color: JOTA_INK, worldWidth: .006 * METER });
    // Contorno da Helena no preto-violeta das linhas da cozinha.
    const helenaOutlineMaterial = createOutlineMaterial({ color: "#07031a", worldWidth: .005 * METER });
    const jota = loadJotaFigure({ outline: outlineMaterial, anisotropy: renderer.capabilities.getMaxAnisotropy(), paintedFace: true });
    jota.group.scale.setScalar(METER);
    jota.group.position.set(0, groundY(JOTA_Z), JOTA_Z);
    world.add(jota.group);


    // Objetos no ar: entre 1,50 e 1,90 m, a ~25 cm para o lado da lente. Ficam fora do
    // caminho do cameraman, mas tão perto que passam "quase acertando a tela".
    // side: -1 = esquerda, 1 = direita (olhando para o Jota).
    const flyingObjects: { object: THREE.Object3D; spin: number; pathX: number; side: -1 | 1; offsetMeters: number }[] = [];
    const placeFlying = (object: THREE.Object3D, z: number, side: -1 | 1, heightMeters: number, spin: number, offsetMeters = .25) => {
      object.position.set(cameraPathX(z) + side * m(offsetMeters), roadY(z) + m(heightMeters), z);
      world.add(object);
      flyingObjects.push({ object, spin, pathX: cameraPathX(z), side, offsetMeters });
    };

    // Um livro grosso de capa preta, sem nada escrito: 16 × 24 cm, 7 cm de espessura.
    // Deitado: x = largura, y = espessura, z = altura. Duas capas finas, lombada redonda à
    // esquerda e o bloco de folhas um pouco recuado, aparecendo nos outros três lados.
    const book = new THREE.Group();
    const addBookPart = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number) => {
      const part = new THREE.Mesh(geometry, material);
      part.position.set(m(x), m(y), 0);
      book.add(part);
      return part;
    };
    [-.033, .033].forEach((y) => addBookPart(new THREE.BoxGeometry(m(.16), m(.004), m(.24)), bookCoverMaterial, 0, y));
    const spine = addBookPart(new THREE.CylinderGeometry(m(.035), m(.035), m(.24), 16, 1, false, Math.PI, Math.PI), bookCoverMaterial, -.08, 0);
    spine.rotation.x = Math.PI / 2;
    addBookPart(new THREE.BoxGeometry(m(.152), m(.062), m(.228)), bookPagesMaterial, .001, 0);
    // Inclinado com a capa virada para a câmera, que vem descendo de costas; o giro do scroll
    // roda o livro como um ponteiro, sem esconder a capa.
    book.rotation.set(1.1, 0, -.2);
    placeFlying(book, 8, -1, 1.55, .9);

    // Maços de notas de Real: o modelo do Deiver (Meshy), com a textura pintada como veio.
    // O maço mede ~30 cm no lado maior (o dobro do real: no tamanho certo ele some na tela).
    // Como os outros objetos no ar, ele quase some colado na lente e ganha corpo ao se
    // afastar. Ex.: a 20 cm da lente fica invisível; a partir de 1,6 m, inteiro.
    const MONEY_SIZE = m(.3);
    // Um maço só, bem ao lado do caminho (90 cm da lente), para não passar raspando na câmera.
    const moneySlots = [
      { z: 14.2, side: 1, height: 1.75, spin: -1.3, turn: [.3, .6, .25] },
] as const;
    const moneyHolders = moneySlots.map(({ z, side, height, spin, turn }) => {
      const holder = new THREE.Group();
      holder.rotation.set(turn[0], turn[1], turn[2]);
      placeFlying(holder, z, side, height, spin, .9);
      return holder;
    });
    new GLTFLoader().load(MONEY_URL, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      fitBox.setFromObject(model);
      fitBox.getSize(fitSize);
      const center = fitBox.getCenter(new THREE.Vector3());
      const scale = MONEY_SIZE / Math.max(fitSize.x, fitSize.y, fitSize.z);
      moneyHolders.forEach((holder) => {
        const copy = model.clone(true);
        copy.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const original = child.material as THREE.MeshStandardMaterial;
          const material = new THREE.MeshBasicMaterial({ map: original.map, side: THREE.DoubleSide, transparent: true });
          child.material = material;
          child.onBeforeRender = (_renderer, _scene, camera) => {
            const distance = camera.position.distanceTo(holder.position);
            // Também só aparece a partir de ~1,2 m da lente; depois fica, como o livro (Deiver).
            material.opacity = THREE.MathUtils.smoothstep(distance, 2.5, 6);
            material.depthWrite = material.opacity > .99;
          };
        });
        copy.scale.setScalar(scale);
        copy.position.copy(center).multiplyScalar(-scale);
        holder.add(copy);
      });
    });

    // Trepadeiras caindo por cima das fachadas da esquerda, como na referência do Deiver.
    // Cor pela forma (sem textura), pelas referências do Deiver: azul royal no lado da luz,
    // marinho quase preto na sombra, manchas roxo-violeta e o fio de contorno amarelo-esverdeado.
    // Cada cacho tem 35–50 cm (40 cm do Deiver, +25% para o cel ler melhor); a cortina é feita de cachos
    // empilhados. Ex.: uma cortina de 1,5 m de largura e 1,6 m de queda tem ~50 cachos, mais
    // compridos no meio e mais curtos nas pontas, colados na parede.
    // Cel limpo de 2 tons (azul royal na luz, marinho quase preto na sombra), como a moita
    // original que o Deiver mandou. Para não virar "chuvisco metálico" de folhinhas, cada cacho
    // é sombreado como uma bola: a normal de cada folha é puxada para fora do centro do cacho.
    // Ex.: centerY -.5 = centro no meio de um cacho pendurado (origem no topo); .5 = planta
    // em pé (origem na base).
    const leafMaterial = (centerY: number) => {
      const material = addManualRim(sceneCel({ lit: "#3a4ee6", mid: "#2533b0", shade: "#141b72", deep: "#070b36", clean: true, cleanTones: 3 }), new THREE.Vector3(1, .35, .35), .12);
      // Luz própria, de cima e do alto da ladeira: vista da rua, cada cacho fica com a metade
      // de cima azul royal e a de baixo marinho (como o rosto do Jota, meio a meio).
      material.uniforms.uLightDirection.value.set(.2, .75, -.6).normalize();
      material.fragmentShader = material.fragmentShader.replace("    vec3 dirtNormal", `    // Poucas manchas roxas, só na parte iluminada.
    float violet = valueNoise(vWorldPosition.zy * 0.9 + vWorldPosition.x * 0.5);
    if (violet > 0.74 && facing > 0.08 && shadow > 0.5) color = vec3(0.07, 0.03, 0.39);
    // Contorno de tinta: as folhas na borda de cada cacho (de lado para a câmera) ficam
    // marinho quase preto, como a linha escura em volta do Jota.
    if (1.0 - abs(dot(normal, normalize(cameraPosition - vWorldPosition))) > 0.8) color = uDeep;
    vec3 dirtNormal`);
      // Muitas cópias iguais: um InstancedMesh. O shader do cel usa modelMatrix; aqui ele passa
      // a usar também a matriz de cada cópia.
      material.vertexShader = material.vertexShader
        .replace("vNormalWorld = normalize(mat3(modelMatrix) * objectNormal);", `vec3 clusterNormal = normalize(mix(objectNormal, normalize(transformed - vec3(0.0, ${centerY.toFixed(2)}, 0.0)), 0.8));
    #ifdef USE_INSTANCING
      vNormalWorld = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * clusterNormal);
      vWorldPosition = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
    #else
      vNormalWorld = normalize(mat3(modelMatrix) * clusterNormal);
      vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
    #endif`)
        .replace("    vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;\n  }", "  }");
      return material;
    };
    const vineMaterial = leafMaterial(-.5);
    const pottedPlantMaterial = leafMaterial(.5);
    const VINE_SIZE = .5;
    const VINE_WIDTH = 1.5;
    new GLTFLoader().load(VINE_URL, (gltf) => {
      if (disposed) return;
      const geometry = (gltf.scene.getObjectByProperty("type", "Mesh") as THREE.Mesh).geometry;
      // Sorteio fixo (sempre o mesmo desenho a cada carga da página).
      let seed = 7;
      const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const placements: THREE.Matrix4[] = [];
      const turn = new THREE.Quaternion();
      vineSpots.forEach(([z, top, drop, width = VINE_WIDTH, fromYard = false]) => {
        for (let across = -width / 2; across <= width / 2; across += .3) {
          // Mais comprida no meio, mais curta nas pontas, com um pouco de acaso.
          const edge = Math.abs(across) / (width / 2);
          const length = drop * (1 - edge * edge * .7) * (.75 + random() * .35);
          for (let down = fromYard ? -.6 : 0; down < length; down += .3) {
            // Acima do topo do muro: copa recuada para dentro do quintal.
            const inward = down < 0 ? .15 + random() * .5 : 0;
            const size = m(VINE_SIZE * (.7 + random() * .3));
            turn.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, random() * Math.PI * 2);
            placements.push(new THREE.Matrix4().compose(
              new THREE.Vector3(leftEdge + m(.06 + random() * .12 - inward), top + m(.2 - down), z + m(across + (random() - .5) * .12)),
              turn,
              new THREE.Vector3(size, size, size),
            ));
          }
        }
      });
      const vines = new THREE.InstancedMesh(geometry, vineMaterial, placements.length);
      placements.forEach((matrix, index) => vines.setMatrixAt(index, matrix));
      vines.frustumCulled = false;
      world.add(vines);
    });

    // Plantas de vaso nos canteiros (no lugar das moitas de marcação), do tamanho que o Deiver
    // marcou: ~1,3–1,6 m acima da terra do canteiro. Cada uma girada de um jeito.
    new GLTFLoader().load(POTTED_PLANT_URL, (gltf) => {
      if (disposed) return;
      const geometry = (gltf.scene.getObjectByProperty("type", "Mesh") as THREE.Mesh).geometry;
      // Duas plantas por ponto (uma maior, uma menor ao lado) e mais largas que o modelo, para
      // encher o espaço que o Deiver marcou (~70 cm de largura).
      const plants = new THREE.InstancedMesh(geometry, pottedPlantMaterial, plantSpots.length * 2);
      const turn = new THREE.Quaternion();
      plantSpots.forEach(([x, y, z, height], index) => {
        [[0, 1, 0], [.22, .8, 1.7]].forEach(([dz, size, spin], copy) => {
          const h = m(height * size);
          turn.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, index * 2.4 + spin);
          plants.setMatrixAt(index * 2 + copy, new THREE.Matrix4().compose(new THREE.Vector3(x, y - m(.05), z + m(dz)), turn, new THREE.Vector3(h * 1.5, h, h * 1.5)));
        });
      });
      plants.frustumCulled = false;
      world.add(plants);
    });

    // Palmeira de ~6,3 m (30% menor que antes), à esquerda, para não cobrir a casa.
    loadPainted(PALM_URL, (palm) => {
      fitBox.setFromObject(palm);
      fitBox.getSize(fitSize);
      palm.scale.setScalar(m(PALM_HEIGHT) / fitSize.y);
      fitBox.setFromObject(palm);
      palm.position.set(-m(5) - (fitBox.min.x + fitBox.max.x) / 2, groundY(GATE_Z) - fitBox.min.y, GATE_Z - m(1.6) - (fitBox.min.z + fitBox.max.z) / 2);
    });

    // Postes de 4,5 m na calçada da esquerda, com um braço curvo e a luminária sobre a rua
    // (sem cruzeta, para não lembrar uma cruz). Baixos o bastante para a luminária entrar
    // no quadro. A luz de contorno é "pintada à mão": não depende do sol, vem sempre do
    // lado da rua e do céu claro. Ex.: o lado do poste virado para a rua ganha um fio
    // amarelo-esverdeado; o lado da parede fica só azul-marinho.
    const POLE_HEIGHT = m(4.5);
    const poleMaterial = addManualRim(sceneCel({ lit: "#071843", mid: TINTA.navyDeep, shade: TINTA.ink, deep: TINTA.ink }), new THREE.Vector3(1, .35, -.35), .3);
    const lampGlowMaterial = new THREE.MeshBasicMaterial({ color: TINTA.yellow });
    // Luz do poste como o Deiver desenhou no Figma ("light-air" e "light floor").
    // Feixe: trapézio amarelo #E7E209, estreito na luminária e largo no chão, com transparência
    // em degradê de cima para baixo (10% → 50% a 35% da altura → 20% a 80% → 10%) e borda que
    // borra mais embaixo (no Figma, blur progressivo de 5 a 28). Some quando a câmera chega perto
    // (a 18 unidades, ~9 m, inteiro; a 8, ~4 m, sumiu).
    const lightConeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color("#e7e209") } },
      vertexShader: `varying vec3 vWorld; varying vec3 vNormalW; varying float vDown;
        void main() { vec4 world = modelMatrix * vec4(position, 1.0); vWorld = world.xyz; vNormalW = normalize(mat3(modelMatrix) * normal); vDown = 1.0 - uv.y; gl_Position = projectionMatrix * viewMatrix * world; }`,
      fragmentShader: `uniform vec3 uColor; varying vec3 vWorld; varying vec3 vNormalW; varying float vDown;
        void main() {
          float alpha = vDown < 0.35 ? mix(0.10, 0.50, vDown / 0.35) : vDown < 0.8 ? mix(0.50, 0.20, (vDown - 0.35) / 0.45) : mix(0.20, 0.10, (vDown - 0.8) / 0.2);
          float facing = abs(dot(normalize(vNormalW), normalize(cameraPosition - vWorld)));
          alpha *= smoothstep(0.0, mix(0.2, 0.75, vDown), facing);
          alpha *= smoothstep(8.0, 18.0, distance(vWorld, cameraPosition));
          gl_FragColor = vec4(uColor, alpha * 0.6);
          #include <colorspace_fragment>
        }`,
    });
    // Mancha no chão: 3 elipses borradas uma dentro da outra, que somam luz (no Figma: "color
    // dodge"). Ex.: a de fora, larga, amarela #F1EF34 a 30%; a do meio também a 30%; a do centro,
    // fina e quase branca (#FFFEBE) a 80%.
    const poolMaterial = (color: string, strength: number) => new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } },
      vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 uColor; uniform float uStrength; varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          gl_FragColor = vec4(uColor * uStrength * pow(1.0 - smoothstep(0.0, 1.0, d), 1.6), 1.0);
          #include <colorspace_fragment>
        }`,
    });
    // [material, largura em m (de lado, x), fundo em m (ao longo da rua, z)]
    const POOL_LAYERS: [THREE.ShaderMaterial, number, number][] = [
      [poolMaterial("#f1ef34", .3), 3.1, 2.8],
      [poolMaterial("#f1ef34", .3), 1.8, 1.6],
      [poolMaterial("#fffebe", .6), 1.1, .55],
    ];
    [18, 32].forEach((z) => {
      const pole = new THREE.Group();
      pole.position.set(-ROAD_HALF - m(.25), roadY(z) + CURB, z);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(m(.06), m(.09), POLE_HEIGHT, 16), poleMaterial);
      shaft.position.y = POLE_HEIGHT / 2;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(m(.04), m(.04), m(1.6), 16), poleMaterial);
      arm.rotation.z = -Math.PI / 2 + .25;
      arm.position.set(m(.78), POLE_HEIGHT + m(.1), 0);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(m(.5), m(.12), m(.25)), poleMaterial);
      lamp.position.set(m(1.55), POLE_HEIGHT + m(.25), 0);
      // A lâmpada acesa: a face de baixo da luminária, amarela chapada.
      const glow = new THREE.Mesh(new THREE.BoxGeometry(m(.42), m(.03), m(.2)), lampGlowMaterial);
      glow.position.set(m(1.55), POLE_HEIGHT + m(.18), 0);
      pole.add(shaft, arm, lamp, glow);
      world.add(pole);
      // Luz do poste desenhada, não física: o feixe da luminária até a rua e a mancha onde ele toca.
      const lampX = pole.position.x + m(1.55);
      const lampY = pole.position.y + POLE_HEIGHT + m(.18);
      const floorY = roadY(z);
      const cone = new THREE.Mesh(new THREE.CylinderGeometry(m(.22), m(1.1), lampY - floorY, 32, 1, true), lightConeMaterial);
      cone.position.set(lampX, (lampY + floorY) / 2, z);
      cone.userData.noShadow = true;
      world.add(cone);
      // Deitadas na rua (que desce 40 cm por metro): a normal aponta para cima e um pouco para a câmera.
      POOL_LAYERS.forEach(([material, width, depth], index) => {
        const pool = new THREE.Mesh(new THREE.CircleGeometry(.5, 48), material);
        pool.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, ROAD_SLOPE).normalize());
        pool.scale.set(m(width), m(depth), 1);
        pool.position.set(lampX, floorY + m(.03 + index * .005), z);
        pool.renderOrder = 2 + index;
        pool.userData.noShadow = true;
        world.add(pool);
      });
    });

    // Cidade baixa: prédios de 6 a 15 m, longe o bastante para quase não se moverem no recuo.
    const skyline = new THREE.Group();
    for (let index = 0; index < 22; index += 1) {
      // Do lado direito, a cidade agora é o desenho do Deiver (fundo em paralaxe, abaixo).
      if (-70 + index * 6.6 > -5) continue;
      const height = m(6 + ((index * 13) % 7) * 1.5);
      const building = new THREE.Mesh(new THREE.BoxGeometry(m(6), height, m(8)), cityMaterials[index % 2]);
      building.position.set(-70 + index * 6.6, -2 + height / 2, -58 - (index % 3) * 4);
      skyline.add(building);
    }
    world.add(skyline);

    // Fundo da direita, além do corrimão: dois desenhos do Deiver em paralaxe, sem 3D.
    // O morro com a cidade fica longe e quase não anda; a faixa de árvores fica mais perto
    // e anda mais rápido quando a câmera desce. Ex.: descendo 10 m, as árvores deslizam
    // bem mais que as casas lá no fundo, e isso dá a profundidade.
    const backdropLoader = new THREE.TextureLoader();
    const addBackdrop = (url: string, width: number, aspect: number, x: number, top: number, z: number) => {
      const texture = backdropLoader.load(url);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const height = width / aspect;
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .02, depthWrite: false }),
      );
      plane.position.set(x, top - height / 2, z);
      plane.rotation.y = -.45;
      world.add(plane);
      return plane;
    };
    addBackdrop(BACKDROP_CITY_URL, 120, 2398 / 1760, 45, 30, -50);
    addBackdrop(BACKDROP_TREES_URL, 44, 2408 / 522, 22, 8, -2).renderOrder = 1;

    // No animatic cinza este plano era o "céu". Aqui ele vira só a massa escura de morro
    // abaixo da linha da cidade, para o degradê amarelo aparecer acima dela.
    const horizon = new THREE.Mesh(new THREE.PlaneGeometry(130, 7), hillMaterial);
    horizon.position.set(0, -2.5, -66);
    world.add(horizon);

    // Os papéis ficam atrás e acima da câmera e só entram no cone visual depois que ela
    // passa por baixo deles; assim a passagem é consequência da trajetória real.
    // A origem de cada grupo é a borda de baixo do papel, presa a 1,90 m do chão.
    // Eles alternam de lado (direita, esquerda...) para um não tampar o outro.
    const papers = BOOK_EXCERPTS.map(({ z, phoneShift, text, footer }, index) => {
      const texture = createTextTexture({ text, footer }, creditFont);
      const group = new THREE.Group();
      const side = index % 2 ? -1 : 1;
      group.position.set(cameraPathX(z) + side * m(1.6), roadY(z) + PAPER_BOTTOM, z);
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uMap: { value: texture },
          uBlur: { value: 0 },
          uOpacity: { value: 1 },
        },
        vertexShader: paperVertexShader,
        fragmentShader: paperFragmentShader,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PAPER_WIDTH, PAPER_HEIGHT), material);
      mesh.position.y = PAPER_HEIGHT / 2;
      mesh.userData.noShadow = true;
      group.add(mesh);
      world.add(group);
      return { group, mesh, material, texture, pathX: cameraPathX(z), side, phoneShift };
    });

    world.traverse((child) => {
      // A luz desenhada do poste (cone e mancha) não faz nem recebe sombra.
      if (!(child instanceof THREE.Mesh) || child.userData.noShadow) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });


    // ---------------------------------------------------------------------------------
    // COZINHA (versão em cinza, só formas, para testar o movimento).
    // No fim da rua a câmera continua de costas e atravessa uma janela: a rua fica
    // emoldurada, vista de dentro, e o recuo revela a cozinha da Helena.
    // Ex.: o scroll vai de 0 a 1. Até STREET_END (70%) é a rua; de 70% a 100% é a
    // passagem pela janela e o recuo dentro da cozinha.
    const STREET_END = .7;
    // A casa da cozinha fica num patamar alto, como os imóveis da ladeira: o piso está
    // 3,2 m acima da rua. Assim, pela janela, ainda se vê a rua subindo e o Jota lá em cima.
    // A câmera sobe esses 3,2 m antes de atravessar a janela.
    const KITCHEN_FLOOR = roadY(CAMERA_END_Z) + m(3.2);
    const WINDOW_X = CAMERA_END_X;
    const WINDOW_Z = CAMERA_END_Z + m(1.2);
    const KITCHEN_CAMERA_Z = WINDOW_Z + m(KITCHEN.cameraBack);
    // Traço quase preto nas quinas dos móveis (contorno da pintura) e, por cima, o traço
    // vermelho nas quinas viradas para a janela, que acende junto com a luz vermelha.
    const kitchenLineMaterial = new LineMaterial({ color: "#07031a", linewidth: 1.6 });
    const kitchenRedLineMaterial = new LineMaterial({ color: "#ff2650", linewidth: 2.2, transparent: true, opacity: 0 });
    // A cozinha é montada só quando a pessoa passa de PRELOAD_AT (35%) da rua, e
    // preparada para a placa de vídeo (compileAsync) antes de aparecer. Se ainda
    // não estiver pronta quando a câmera chegar à janela, a câmera espera ali.
    const PRELOAD_AT = .35;
    const kitchenTarget = new THREE.Vector3();
    const kitchenPortraitLookAt = new THREE.Vector3(WINDOW_X - m(.8), roadY(CAMERA_END_Z) + m(3.2) + m(1.05), CAMERA_END_Z + m(1.2));
    const kitchenLookAt = new THREE.Vector3(WINDOW_X, KITCHEN_FLOOR + m(1.05), WINDOW_Z - m(8));
    let kitchenState: "idle" | "loading" | "ready" = "idle";
    let kitchenGroup: THREE.Object3D | null = null;
    // null = ainda não aplicado (vale também quando a Helena termina de carregar).
    let kitchenCastsShadow: boolean | null = null;
    let updateKitchen: ((state: { red: number; time: number; pixels: number }) => void) | null = null;

    // ---------------------------------------------------------------------------------
    // HISTÓRIA DA COZINHA (ideia 1 do Deiver): depois do recuo, a câmera quase para e os
    // bilhetes e objetos saem da lente, um de cada vez, e vão para longe ganhando foco.
    // STORY_END: o scroll passa de 1 (fim do recuo) até 1,25; esse trecho extra é a história.
    // O site ficou 25% mais comprido só para isso, então a rua continua no mesmo ritmo.
    // Cada item tem: onde termina (em metros, dentro da cozinha) e quando anda (from → to,
    // de 0 a 1 dentro da história). Os bilhetes somem quando o próximo chega; o último fica.
    const STORY_END = 1.25;
    // travel = quanto da história o item leva para chegar ao lugar dele;
    // portraitX = para onde ele vai no celular (o quadro é estreito); portraitEnd, quando
    // existe, troca o ponto inteiro (usado no Opala, onde a câmera olha na diagonal).
    type StoryItem = {
      object: THREE.Object3D;
      end: THREE.Vector3;
      from: number;
      to: number;
      travel: number;
      portraitX: number;
      portraitEnd?: THREE.Vector3;
      paper: THREE.ShaderMaterial;
    };
    const storyItems: StoryItem[] = [];
    const storyTextures: THREE.Texture[] = [];
    // Cria um bilhete preso em "space" (grupo em metros). Ex.: o primeiro da cozinha.
    const addStoryPaper = (items: StoryItem[], space: THREE.Object3D, excerpt: Excerpt, item: Omit<StoryItem, "object" | "paper">) => {
      const texture = createTextTexture(excerpt, creditFont);
      if (texture) storyTextures.push(texture);
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uMap: { value: texture }, uBlur: { value: 0 }, uOpacity: { value: 0 } },
        vertexShader: paperVertexShader,
        fragmentShader: paperFragmentShader,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PAPER_WIDTH, PAPER_HEIGHT), material);
      mesh.visible = false;
      mesh.renderOrder = 7;
      space.add(mesh);
      items.push({ ...item, object: mesh, paper: material });
    };

    // ---------------------------------------------------------------------------------
    // CENA 3: WIPE POR OCLUSÃO (direção do Deiver, 13/10, desenho em vista de cima).
    // No fim da cozinha a câmera desliza rápido para a DIREITA, sempre olhando para a frente,
    // como um carrinho num trilho. Uma parede em sombra, a ~25 cm da lente, entra pela direita
    // e cobre a tela; do outro lado, na rua do Opala, um prédio em sombra e um poste escuro da
    // mesma cor continuam cobrindo, e a borda do poste revela a rua. A câmera freia e para no
    // quadro final baixo do Opala. Sem flash, sem fade, sem corte: a troca acontece no preto.
    // O deslize não segue o scroll: ao passar de WIPE_AT ele roda sozinho, em ~2 s (se
    // seguisse o scroll, quem parasse no meio veria a tela congelada borrada ou preta); rolando
    // para cima, ele volta igual. Os bilhetes da Neide só entram com a câmera parada, de
    // NOTES_FROM até OPALA_END.
    const WIPE_AT = STORY_END + .03;
    const NOTES_FROM = WIPE_AT + .05;
    const OPALA_END = 1.65;
    // Trilho, em metros: na cozinha a câmera vai do lugar final dela até KITCHEN_WIPE_TO (x na
    // cozinha), onde a parede já cobre tudo; na rua ela sai de OPALA_WIPE_FROM (atrás do prédio
    // em sombra) e vai até o x final. Quanto mais longo o trecho da rua, mais longa a freada.
    const KITCHEN_WALL = { x0: 1.3, x1: KITCHEN.width / 2 + .15, z: KITCHEN.cameraBack + .05 };
    const KITCHEN_WIPE_TO = 1.6;
    const OPALA_WIPE_FROM = WIPE.poleX - .35;
    let opalaGroup: THREE.Object3D | null = null;
    let opala: ReturnType<typeof buildOpalaNight> | null = null;
    const opalaItems: StoryItem[] = [];

    const buildKitchen = () => {
      const { group, space, update, setHelena } = buildKitchenGray(kitchenLineMaterial, kitchenRedLineMaterial);
      const helenaLoader = new GLTFLoader();
      helenaLoader.setMeshoptDecoder(MeshoptDecoder);
      helenaLoader.load(HELENA_URL, (gltf) => {
        if (disposed) return;
        const mesh = gltf.scene.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
        if (mesh) setHelena(mesh.geometry, helenaOutlineMaterial);
        kitchenCastsShadow = null;
      });
      group.position.set(WINDOW_X, KITCHEN_FLOOR, WINDOW_Z);
      // Parede do wipe: um trecho de parede saindo da parede da direita, logo à frente do lugar
      // final da câmera, inteira em sombra (a mesma cor do prédio e do poste da rua do Opala).
      // Antes do wipe ela fica fora do quadro (ao lado da lente).
      const wipeWall = new THREE.Mesh(
        new THREE.BoxGeometry(KITCHEN_WALL.x1 - KITCHEN_WALL.x0, KITCHEN.height, .1),
        new THREE.MeshBasicMaterial({ color: WIPE.color, side: THREE.DoubleSide }),
      );
      wipeWall.position.set((KITCHEN_WALL.x0 + KITCHEN_WALL.x1) / 2, KITCHEN.height / 2, KITCHEN_WALL.z);
      space.add(wipeWall);
      kitchenGroup = group;
      updateKitchen = update;
      const papersAt = [new THREE.Vector3(0, 1.95, 2.6), new THREE.Vector3(.75, 1.95, 2.6), new THREE.Vector3(.2, 1.95, 2.6)];
      const paperTimes = [[.06, .4], [.38, .7], [.66, 1]];
      KITCHEN_EXCERPTS.forEach((excerpt, index) => {
        const end = papersAt[index];
        addStoryPaper(storyItems, space, excerpt, { end, from: paperTimes[index][0], to: paperTimes[index][1], travel: .22, portraitX: end.x * .4 - .45 });
      });
      return group;
    };

    // O Opala fica num lugar só dele, 90 m atrás da cozinha (nunca aparecem juntos: a troca
    // acontece no branco).
    const buildOpala = () => {
      opala = buildOpalaNight();
      opala.group.position.set(WINDOW_X, KITCHEN_FLOOR, WINDOW_Z + m(90));
      opalaGroup = opala.group;
      // Bilhetes da Neide: só depois que o carro e as três sombras estão legíveis. Saem da lente
      // e param a ~2,8 m dela, ao lado do caminho, um por vez. Tempo de 0 a 1 = NOTES_FROM a OPALA_END.
      const times = [[0, 1]];
      // A câmera olha na diagonal para o carro: "frente" e "lado" seguem o olhar dela, não os
      // eixos do mundo. Lado: + = direita da tela (sobre o carro), − = esquerda (sobre as sombras).
      const sides = [1.1, -1.2, 1.0];
      const ahead = new THREE.Vector3().subVectors(OPALA.wideLookAt, OPALA.wideFrom).setY(0).normalize();
      const right = new THREE.Vector3(-ahead.z, 0, ahead.x);
      // Acima do horizonte, no céu, por cima das cabeças (que estão bem mais longe).
      // No celular o bilhete fica mais perto (o papel é menor e o quadro, estreito).
      const notePoint = (side: number, distance = 4.2, height = 1.4) => OPALA.wideFrom.clone()
        .addScaledVector(ahead, distance).addScaledVector(right, side).setY(OPALA.wideFrom.y + height);
      OPALA_EXCERPTS.forEach((excerpt, index) => {
        const [from, to] = times[index];
        const end = notePoint(sides[index]);
        addStoryPaper(opalaItems, opala!.space, excerpt, { end, from, to, travel: .2, portraitX: end.x, portraitEnd: notePoint(-.15, 1.6, .62) });
      });
      return opala.group;
    };

    const storyCamera = new THREE.Vector3();
    const storyStart = new THREE.Vector3();
    const storyEnd = new THREE.Vector3();
    const storyFacing = new THREE.Vector3();
    // story = 0 a 1 dentro da história. O item nasce a 15% do caminho entre a lente e o lugar
    // final dele (quase colado na tela, na mesma direção) e vai até lá em ~22% da história.
    // Como na rua, ele só aparece a partir de ~60 cm da lente e fica inteiro depois de ~1,3 m.
    // origin = o grupo em metros onde os bilhetes estão (a cozinha ou o Opala).
    const renderStory = (items: StoryItem[], story: number, origin: THREE.Object3D | null) => {
      if (!origin) return;
      const portrait = camera.aspect < 1;
      storyCamera.copy(camera.position).sub(origin.position).divideScalar(METER);
      const paperWidth = portrait ? .62 : 1.1;
      items.forEach(({ object, end, from, to, travel: travelTime, portraitX, portraitEnd, paper }) => {
        object.visible = story > from;
        if (!object.visible) return;
        const travel = THREE.MathUtils.smoothstep(story, from, from + travelTime);
        // No celular o quadro é estreito e olha mais para a esquerda: tudo chega mais ao centro dele.
        storyEnd.copy(end);
        if (portrait) {
          if (portraitEnd) storyEnd.copy(portraitEnd);
          else storyEnd.x = portraitX;
        }
        storyStart.copy(storyCamera).lerp(storyEnd, .15);
        object.position.lerpVectors(storyStart, storyEnd, travel);
        const distance = object.position.distanceTo(storyCamera);
        const appear = THREE.MathUtils.smoothstep(distance, .6, 1.3);
        const leave = to < 1 ? 1 - THREE.MathUtils.smoothstep(story, to - .06, to) : 1;
        object.scale.setScalar(paperWidth / PAPER_WIDTH);
        // lookAt pede a posição no mundo: o papel gira só em volta do eixo vertical.
        object.getWorldPosition(storyFacing);
        storyFacing.set(camera.position.x, storyFacing.y, camera.position.z);
        object.lookAt(storyFacing);
        paper.uniforms.uBlur.value = (1 - THREE.MathUtils.smoothstep(distance, .5, 1.8)) * 6;
        paper.uniforms.uOpacity.value = appear * leave;
      });
    };

    // ---------------------------------------------------------------------------------
    // RUA VERMELHA NA JANELA (ideia do Deiver: no Figma ele usou uma imagem com máscara).
    // Assim que a câmera entra na cozinha, a rua 3D inteira é trocada por uma "foto" dela,
    // tirada naquele mesmo quadro e da mesma posição, presa numa placa lá fora, atrás da janela.
    // Como a foto é idêntica ao que estava na tela, a troca não aparece. Depois a foto vai
    // ficando vermelha, e a rua (pesada) para de ser desenhada: a cozinha fica mais leve.
    // A foto é um pouco maior que a tela (WINDOW_VIEW_SCALE), para cobrir a janela mesmo
    // quando a câmera recua e vira.
    const WINDOW_INSIDE_Z = WINDOW_Z + m(.3);
    const WINDOW_VIEW_SCALE = 1.7;
    const windowViewMaterial = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: null }, uTint: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // Vermelho pela claridade: escuro vira vinho, médio vira o vermelho da pintura, claro vira rosa.
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uTint;
        varying vec2 vUv;
        void main() {
          vec3 color = texture2D(uMap, vUv).rgb;
          float light = dot(color, vec3(.2126, .7152, .0722));
          vec3 red = mix(vec3(.2, 0.0, .012), vec3(.82, 0.0, .017), smoothstep(0.0, .12, light));
          red = mix(red, vec3(1.0, .16, .21), smoothstep(.3, .85, light));
          gl_FragColor = vec4(mix(color, red, uTint), 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
    const windowView = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), windowViewMaterial);
    windowView.visible = false;
    windowView.frustumCulled = false;
    scene.add(windowView);
    let windowViewTarget: THREE.WebGLRenderTarget | null = null;
    let streetVisible = true;
    const showStreet = (visible: boolean) => {
      if (visible === streetVisible) return;
      streetVisible = visible;
      world.children.forEach((child) => { if (child !== kitchenGroup && child !== opalaGroup) child.visible = visible; });
      sky.visible = visible;
      windowView.visible = !visible;
    };
    const dropWindowView = () => {
      windowViewTarget?.dispose();
      windowViewTarget = null;
      showStreet(true);
    };
    const bufferSize = new THREE.Vector2();
    const viewForward = new THREE.Vector3();
    const takeWindowView = () => {
      renderer.getDrawingBufferSize(bufferSize);
      const fit = Math.min(1, renderer.capabilities.maxTextureSize / 2 / (bufferSize.x * WINDOW_VIEW_SCALE), 4096 / (bufferSize.y * WINDOW_VIEW_SCALE));
      const targetWidth = Math.round(bufferSize.x * WINDOW_VIEW_SCALE * fit);
      const targetHeight = Math.round(bufferSize.y * WINDOW_VIEW_SCALE * fit);
      windowViewTarget = new THREE.WebGLRenderTarget(targetWidth, targetHeight, { type: THREE.HalfFloatType, samples: 4 });
      // Mesma posição e direção da câmera, só com a lente mais aberta.
      const wide = camera.clone();
      wide.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * WINDOW_VIEW_SCALE));
      wide.updateProjectionMatrix();
      // O céu se pinta pela altura na tela: aqui ele precisa saber onde a tela fica dentro da foto.
      const skyUniforms = sky.material.uniforms;
      const savedResolution = skyUniforms.uResolution.value.clone();
      skyUniforms.uResolution.value.set(bufferSize.x * fit, bufferSize.y * fit);
      skyUniforms.uOffsetY.value = (targetHeight - bufferSize.y * fit) / 2;
      if (kitchenGroup) kitchenGroup.visible = false;
      renderer.setRenderTarget(windowViewTarget);
      renderer.render(scene, wide);
      renderer.setRenderTarget(null);
      if (kitchenGroup) kitchenGroup.visible = true;
      skyUniforms.uResolution.value.copy(savedResolution);
      skyUniforms.uOffsetY.value = 0;
      // A placa fica 7 m à frente da câmera (bem depois da janela), do tamanho exato da foto.
      const distance = m(7);
      const placeHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(wide.fov) / 2);
      camera.getWorldDirection(viewForward);
      windowView.position.copy(camera.position).addScaledVector(viewForward, distance);
      windowView.quaternion.copy(camera.quaternion);
      windowView.scale.set(placeHeight * camera.aspect, placeHeight, 1);
      windowViewMaterial.uniforms.uMap.value = windowViewTarget.texture;
    };

    // MOTION BLUR DO WIPE: só no trecho rápido do deslize. A cena é desenhada numa imagem e
    // este filtro a borra na horizontal (a direção do movimento). uBlur = comprimento do borrão
    // em pixels da tela; 0 = imagem limpa (a composição final para nítida).
    const blurTargetSize = new THREE.Vector2();
    let blurTarget: THREE.WebGLRenderTarget | null = null;
    const blurMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uScene: { value: null as THREE.Texture | null },
        uBlur: { value: 0 },
        uTexel: { value: new THREE.Vector2() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uScene;
        uniform float uBlur;
        uniform vec2 uTexel;
        varying vec2 vUv;
        void main() {
          vec3 color = vec3(0.0);
          for (int i = 0; i < 16; i++) {
            float t = (float(i) + .5) / 16.0 - .5;
            color += texture2D(uScene, vUv + vec2(t * uBlur * uTexel.x, 0.0)).rgb;
          }
          gl_FragColor = vec4(color / 16.0, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
    const blurScene = new THREE.Scene();
    const blurQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMaterial);
    blurQuad.frustumCulled = false;
    blurScene.add(blurQuad);
    const blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const dropBlurTarget = () => {
      blurTarget?.dispose();
      blurTarget = null;
    };

    // Trilho do wipe, em três trechos: acelera na cozinha (até a parede), passa pelo preto e
    // pela borda do poste na velocidade máxima (WIPE_SPEED, constante: parece um movimento só) e
    // freia até parar no quadro final. wipe = 0 a 1; a duração total sai das distâncias.
    // Ex.: desktop = 0,9 m acelerando (0,26 s) + 0,65 m no preto (0,09 s) + 5,5 m freando (1,6 s).
    const WIPE_SPEED = 7;
    const BLACK_LENGTH = WIPE.poleX + .3 - OPALA_WIPE_FROM;
    const wipeRail = { distance: 0, speed: 0, kitchenLength: 0, seconds: 1 };
    const railAt = (wipe: number, startX: number) => {
      const kitchenLength = KITCHEN_WIPE_TO - startX;
      const brakeLength = OPALA.wideFrom.x - OPALA_WIPE_FROM - BLACK_LENGTH;
      const accelSeconds = 2 * kitchenLength / WIPE_SPEED;
      const blackSeconds = BLACK_LENGTH / WIPE_SPEED;
      const brakeSeconds = 2 * brakeLength / WIPE_SPEED;
      const seconds = accelSeconds + blackSeconds + brakeSeconds;
      const time = wipe * seconds;
      wipeRail.kitchenLength = kitchenLength;
      wipeRail.seconds = seconds;
      if (time < accelSeconds) {
        wipeRail.speed = WIPE_SPEED * time / accelSeconds;
        wipeRail.distance = wipeRail.speed * time / 2;
      } else if (time < accelSeconds + blackSeconds) {
        wipeRail.speed = WIPE_SPEED;
        wipeRail.distance = kitchenLength + WIPE_SPEED * (time - accelSeconds);
      } else {
        const left = 1 - (time - accelSeconds - blackSeconds) / brakeSeconds;
        wipeRail.speed = WIPE_SPEED * left;
        wipeRail.distance = kitchenLength + BLACK_LENGTH + brakeLength * (1 - left * left);
      }
      return wipeRail;
    };

    const ensureKitchen = (scrollProgress: number) => {
      if (kitchenState !== "idle" || scrollProgress < PRELOAD_AT) return;
      kitchenState = "loading";
      const kitchen = buildKitchen();
      world.add(kitchen);
      // O Opala é montado junto (o carro tem ~500 KB) e preparado na mesma hora.
      world.add(buildOpala());
      renderer.compileAsync(scene, camera).then(() => {
        if (!disposed) kitchenState = "ready";
      });
    };

    const startPosition = new THREE.Vector3(CAMERA_START_X, roadY(CAMERA_START_Z) + EYE_HEIGHT, CAMERA_START_Z);
    const endPosition = new THREE.Vector3(CAMERA_END_X, roadY(CAMERA_END_Z) + EYE_HEIGHT, CAMERA_END_Z);
    // A câmera mira o rosto do Jota (~1,70 m) e, no fim, um pouco abaixo, para a rua caber.
    const startLookAt = new THREE.Vector3(0, groundY(JOTA_Z) + 1.7 * METER, JOTA_Z);
    const endLookAt = new THREE.Vector3(0, groundY(TOP_Z) + 1.3 * METER, TOP_Z);
    // Abertura: a câmera começa no alto, vendo só a casa (o Jota fica abaixo do quadro).
    // No primeiro trecho do scroll (INTRO) ela desce até a altura do olho, já colada no Jota.
    const INTRO = .15;
    const highPosition = new THREE.Vector3(CAMERA_START_X, TOP_Y + m(8), CAMERA_START_Z + m(4));
    const houseLookAt = new THREE.Vector3(0, TOP_Y + m(4.5), GATE_Z - m(6));
    const cameraPosition = new THREE.Vector3();
    const lookAt = new THREE.Vector3();
    const paperFacing = new THREE.Vector3();
    const paperCenter = new THREE.Vector3();
    let progress = 0;
    let targetProgress = 0;
    let wipe = 0;
    let frame = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      papers.forEach(({ group }) => group.scale.setScalar(width < 600 ? .38 : .8));
      // Os bilhetes ficam a 1,1 m do caminho, em 80% do tamanho, para caberem inteiros no quadro.
      // Na tela em pé (celular) o quadro é estreito, então a distância lateral encolhe junto com
      // a largura. Ex.: computador (1,6 de proporção) = 100%; celular (~0,46) = 29%.
      const lateral = THREE.MathUtils.clamp(camera.aspect / 1.6, 0, 1);
      // No celular, cada bilhete ainda anda um pouco (phoneShift, em metros) para ficar no meio
      // do quadro no momento de leitura, já que ali o olhar da câmera não aponta para o caminho.
      papers.forEach(({ group, pathX, side, phoneShift }) => { group.position.x = pathX + side * m(1.1) * lateral + (width < 600 ? m(phoneShift) : 0); });
      // O dinheiro nunca chega mais perto que 35 cm, para não raspar na lente.
      flyingObjects.forEach(({ object, pathX, side, offsetMeters }) => {
        object.position.x = pathX + side * m(Math.max(Math.min(offsetMeters, .35), offsetMeters * lateral));
      });
      // O contorno do Jota tem espessura mínima e máxima em pixels reais.
      renderer.getDrawingBufferSize(outlineMaterial.uniforms.uResolution.value);
      sceneryLineMaterial.resolution.set(width, height);
      kitchenLineMaterial.resolution.set(width, height);
      kitchenRedLineMaterial.resolution.set(width, height);
      // A foto da janela vale só para o tamanho de tela em que foi tirada.
      dropWindowView();
      dropBlurTarget();
      renderer.getDrawingBufferSize(sky.material.uniforms.uResolution.value);
      const ratio = renderer.getPixelRatio();
      outlineMaterial.uniforms.uMinPixels.value = 1.5 * ratio;
      outlineMaterial.uniforms.uMaxPixels.value = 4 * ratio;
      renderer.getDrawingBufferSize(helenaOutlineMaterial.uniforms.uResolution.value);
      helenaOutlineMaterial.uniforms.uMinPixels.value = 1.5 * ratio;
      helenaOutlineMaterial.uniforms.uMaxPixels.value = 4 * ratio;
      renderScene();
    };

    const renderScene = () => {
      ensureKitchen(progress);
      // Se a cozinha ainda não ficou pronta, a câmera espera na janela.
      const sceneProgress = kitchenState === "ready" ? Math.min(progress, 1) : Math.min(progress, STREET_END);
      const story = kitchenState === "ready" ? THREE.MathUtils.clamp((progress - 1) / (STORY_END - 1), 0, 1) : 0;
      const walk = THREE.MathUtils.clamp((sceneProgress - INTRO) / (STREET_END - INTRO), 0, 1);
      cameraPosition.lerpVectors(startPosition, endPosition, walk);
      cameraPosition.x += Math.sin(walk * Math.PI) * CAMERA_SWAY;
      cameraPosition.y += Math.sin(walk * Math.PI) * .22;
      lookAt.lerpVectors(startLookAt, endLookAt, walk);
      const descent = THREE.MathUtils.smoothstep(progress, 0, INTRO);
      cameraPosition.lerpVectors(highPosition, cameraPosition, descent);
      lookAt.lerpVectors(houseLookAt, lookAt, descent);
      // Depois da rua: recua reto, na altura do olho, atravessando a janela.
      const inside = THREE.MathUtils.smoothstep(sceneProgress, STREET_END, 1);
      if (inside > 0) {
        const rise = THREE.MathUtils.smoothstep(inside, 0, .2);
        // Depois de passar pela janela, a câmera recua em diagonal para a direita, para a
        // Helena e a mesa ficarem à esquerda do quadro, sem a lente passar por cima delas.
        // No celular (tela em pé) o quadro é estreito: quase sem desvio, e no fim a lente abre
        // um pouco e o olhar vira para a esquerda, para a Helena e a mesa caberem com a janela.
        const portrait = camera.aspect < 1;
        const drift = THREE.MathUtils.smoothstep(inside, .3, 1) * m(KITCHEN.cameraDrift) * (portrait ? .15 : 1);
        cameraPosition.set(WINDOW_X + drift, THREE.MathUtils.lerp(roadY(CAMERA_END_Z), KITCHEN_FLOOR, rise) + EYE_HEIGHT, THREE.MathUtils.lerp(CAMERA_END_Z, KITCHEN_CAMERA_Z, inside));
        // O olhar desce da casa lá em cima para a janela, quase na horizontal.
        const turn = THREE.MathUtils.smoothstep(inside, .5, 1);
        kitchenTarget.copy(kitchenLookAt);
        if (portrait) kitchenTarget.lerp(kitchenPortraitLookAt, turn);
        lookAt.lerp(kitchenTarget, THREE.MathUtils.smoothstep(inside, 0, .7));
        camera.fov = THREE.MathUtils.lerp(47, portrait ? 66 : 47, turn);
        camera.updateProjectionMatrix();
      }
      // Durante a história a câmera quase para: recua só mais 30 cm.
      if (story > 0) cameraPosition.z += m(.3) * THREE.MathUtils.smoothstep(story, 0, 1);
      // Wipe: a câmera desliza para a direita olhando sempre para a frente (o olhar anda junto).
      const ready = kitchenState === "ready";
      const portraitView = camera.aspect < 1;
      const rail = railAt(wipe, KITCHEN.cameraDrift * (portraitView ? .15 : 1));
      const inOpala = ready && Boolean(opalaGroup) && wipe > 0 && rail.distance > rail.kitchenLength;
      // Onde a câmera está no trilho da rua (x em metros, no espaço do Opala).
      const streetX = OPALA_WIPE_FROM + rail.distance - rail.kitchenLength;
      if (wipe > 0 && !inOpala) {
        cameraPosition.x += m(rail.distance);
        lookAt.x += m(rail.distance);
      }
      if (inOpala && opalaGroup) {
        // Do outro lado do preto ela já está agachada (olho a ~40 cm) e com o olhar final.
        cameraPosition.set(streetX, OPALA.wideFrom.y, OPALA.wideFrom.z).multiplyScalar(METER).add(opalaGroup.position);
        lookAt.subVectors(OPALA.wideLookAt, OPALA.wideFrom).multiplyScalar(METER).add(cameraPosition);
        if (portraitView) lookAt.x -= m(.5);
        camera.fov = portraitView ? 80 : 47;
        camera.updateProjectionMatrix();
      }
      // A luz vermelha acende logo depois que a câmera passa pela janela.
      const red = THREE.MathUtils.smoothstep(inside, .26, .45);
      // O sol da rua só serve para a sombra; dentro da cozinha ele não pode iluminar os móveis.
      sun.intensity = inside > 0 ? 0 : 1;
      // A cozinha (paredes de 2,7 m logo atrás do começo da rua) jogava a sombra do sol em cima
      // da parte baixa da rua. Ela só faz sombra lá dentro, onde quem ilumina é a lâmpada.
      const kitchenCasts = inside > 0;
      if (kitchenGroup && kitchenCasts !== kitchenCastsShadow) {
        kitchenCastsShadow = kitchenCasts;
        kitchenGroup.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          // Guarda se a peça fazia sombra originalmente (o chão e os brilhos não fazem).
          child.userData.kitchenCaster ??= child.castShadow;
          child.castShadow = kitchenCasts && child.userData.kitchenCaster;
        });
      }
      camera.position.copy(cameraPosition);
      camera.lookAt(lookAt);
      camera.updateMatrixWorld();
      sky.position.copy(camera.position);
      // Dentro da cozinha: troca a rua pela foto (tirada neste mesmo quadro, se ainda não existe).
      if (kitchenGroup && camera.position.z > WINDOW_INSIDE_Z) {
        if (!windowViewTarget) takeWindowView();
        showStreet(false);
      } else if (windowViewTarget) {
        dropWindowView();
      }
      if (kitchenGroup) kitchenGroup.visible = !inOpala;
      if (opalaGroup) opalaGroup.visible = inOpala;
      if (inOpala) windowView.visible = false;
      else if (!streetVisible) windowView.visible = true;
      // O farol estoura logo depois do branco e volta ao tamanho normal enquanto a luz baixa.
      // O rosa e o amarelo dos postes acendem só depois que o poste escuro sai da frente.
      opala?.update({ glowAmount: 0, figuresOn: true, lightsOn: inOpala ? THREE.MathUtils.smoothstep(streetX, WIPE.poleX + .6, WIPE.poleX + 2.8) : 0 });
      windowViewMaterial.uniforms.uTint.value = red;
      scrollArea.style.setProperty("--street-glow", (1 - red).toFixed(3));
      updateKitchen?.({ red, time: performance.now() / 1000, pixels: renderer.domElement.height });
      renderStory(storyItems, story, kitchenGroup);
      renderStory(opalaItems, inOpala && wipe >= 1 ? THREE.MathUtils.clamp((progress - NOTES_FROM) / (OPALA_END - NOTES_FROM), 0, 1) : 0, opalaGroup);
      // O papel gira só em torno do eixo vertical, então a borda de baixo fica sempre a 1,90 m.
      papers.forEach(({ group, mesh, material }, index) => {
        paperFacing.set(camera.position.x, group.position.y, camera.position.z);
        group.lookAt(paperFacing);
        mesh.getWorldPosition(paperCenter);
        const paperDistance = camera.position.distanceTo(paperCenter);
        // Ex.: a 2 unidades da lente (~1 m) o papel quase some e borra; a partir de 8 (~4 m) fica nítido.
        material.uniforms.uBlur.value = (1 - THREE.MathUtils.smoothstep(paperDistance, 2, 8)) * 6;
        // Só aparece depois que a câmera passa por baixo dele, a partir de ~1,3 m da lente, e fica
        // inteiro e nítido até a câmera passar pelo próximo. Um bilhete por vez (Deiver): este some
        // enquanto o próximo ainda está colado na lente, invisível. O último some antes da câmera chegar na janela (antes da "foto" da rua).
        const next = papers[index + 1];
        const handOff = next ? 1 - THREE.MathUtils.smoothstep(camera.position.z - next.group.position.z, .3, 2.6) : 1;
        const passed = THREE.MathUtils.smoothstep(camera.position.z - group.position.z, -.5, .5);
        material.uniforms.uOpacity.value = passed * THREE.MathUtils.smoothstep(paperDistance, 2.6, 6) * (1 - THREE.MathUtils.smoothstep(inside, .02, .15)) * handOff;
      });
      flyingObjects.forEach(({ object, spin }) => { object.rotation.y = spin * progress * Math.PI; });
      // Borrão do wipe: proporcional à velocidade na tela (um objeto a ~2,5 m, em ~1/2 quadro de
      // exposição), com teto. Some antes da câmera parar.
      renderer.getDrawingBufferSize(blurTargetSize);
      const horizontalTan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect;
      const metersPerSecond = wipe > 0 && wipe < 1 ? rail.speed : 0;
      const blurPixels = Math.min(metersPerSecond / (2.5 * horizontalTan) * (blurTargetSize.x / 2) / 120, blurTargetSize.x * .03);
      if (blurPixels > 1) {
        if (!blurTarget) blurTarget = new THREE.WebGLRenderTarget(blurTargetSize.x, blurTargetSize.y, { type: THREE.HalfFloatType, samples: 4 });
        blurMaterial.uniforms.uBlur.value = blurPixels;
        blurMaterial.uniforms.uTexel.value.set(1 / blurTargetSize.x, 1 / blurTargetSize.y);
        blurMaterial.uniforms.uScene.value = blurTarget.texture;
        renderer.setRenderTarget(blurTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(blurScene, blurCamera);
      } else {
        renderer.render(scene, camera);
      }
    };

    let lastFrameTime = performance.now();
    const animate = () => {
      progress += (targetProgress - progress) * .075;
      // O wipe anda no tempo, não no scroll: para a frente depois de WIPE_AT, para trás antes.
      const now = performance.now();
      const seconds = Math.min((now - lastFrameTime) / 1000, .1);
      lastFrameTime = now;
      const wipeTarget = kitchenState === "ready" && progress >= WIPE_AT ? 1 : 0;
      const step = seconds / wipeRail.seconds;
      wipe = wipeTarget > wipe ? Math.min(1, wipe + step) : Math.max(0, wipe - step);
      renderScene();
      frame = window.requestAnimationFrame(animate);
    };

    const updateScrollProgress = () => {
      const bounds = scrollArea.getBoundingClientRect();
      const distance = Math.max(scrollArea.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.min(1, Math.max(0, -bounds.top / distance));
      targetProgress = scrolled * OPALA_END;
      // --scroll-progress continua indo de 0 a 1 só na rua + recuo (o texto de abertura usa ele);
      // a barrinha de progresso usa o scroll inteiro.
      scrollArea.style.setProperty("--scroll-progress", Math.min(targetProgress, 1).toFixed(4));
      scrollArea.style.setProperty("--scroll-total", scrolled.toFixed(4));
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
      disposed = true;
      jota.dispose();
      outlineMaterial.dispose();
      helenaOutlineMaterial.dispose();
      disposeObject(world);
      sky.geometry.dispose();
      sky.material.dispose();
      papers.forEach(({ texture }) => texture?.dispose());
      storyTextures.forEach((texture) => texture.dispose());
      windowViewTarget?.dispose();
      blurTarget?.dispose();
      blurMaterial.dispose();
      blurQuad.geometry.dispose();
      windowView.geometry.dispose();
      windowViewMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [creditFont]);

  return (
    <main className={styles.animatic} ref={scrollRef}>
      <header className={styles.header}>
        {/* Logo do Deiver (Figma, nó 95:10148): azul na rua, escuro na cozinha, branco no celular deitado. */}
        <span className={styles.logoStack}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${styles.logo} ${styles.logoStreet}`} src="/enquanto-durar-a-fe/logo-enquanto-fe-azul.svg" width={187} height={16} alt="Enquanto durar a fé" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${styles.logo} ${styles.logoKitchen}`} src="/enquanto-durar-a-fe/logo-enquanto-fe-escuro.svg" width={187} height={16} alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${styles.logo} ${styles.logoCinema}`} src="/enquanto-durar-a-fe/logo-enquanto-fe.svg" width={187} height={16} alt="" aria-hidden="true" />
        </span>
        <a className={styles.headerBuy} href={AMAZON_URL} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/enquanto-durar-a-fe/icone-livro.svg" width={14} height={14} alt="" />
          Ler na Amazon
        </a>
        <i className={styles.headerLine} aria-hidden="true" />
      </header>

      <section className={styles.stage} aria-labelledby="book-title">
        <div className={styles.canvasShell} ref={containerRef} role="img" aria-label="Jota, de camisa clara e bolsa transversal, em frente ao portão da última casa de uma ladeira de paralelepípedos, no fim da tarde, enquanto a câmera desce a rua de costas" />
        <div className={styles.vignette} aria-hidden="true" />
        {[styles.glowBottomLeft, styles.glowRight, styles.glowRightHigh, styles.glowBottom, styles.glowPurple].map((glow) => <i key={glow} className={`${styles.glow} ${glow}`} aria-hidden="true" />)}
        <div className={styles.introMask} aria-hidden="true" />
        <div className={styles.copy}>
          <h1 id="book-title">Há quem tenha fé.<br />Há quem se aproveite dela.<br />E há Jota.</h1>
        </div>
        <div className={styles.scrollHint}>
          <p>Jota vende Bíblias de porta em porta.<br />O resto é mais difícil de explicar.</p>
          <span>Role para entrar <i aria-hidden="true">↓</i></span>
        </div>
        <p className={styles.reducedNote}>Quadro estático por preferência de movimento reduzido.</p>
        <div className={styles.progress} aria-hidden="true"><i /></div>
      </section>

      <section className={styles.ending}>
        <p>“E sobre o que você queria falar mesmo?”</p>
        <span>Até onde podemos ir por quem amamos?</span>
        <a className={styles.buy} href={AMAZON_URL} target="_blank" rel="noopener noreferrer">Ler na Amazon · R$ 17,99 ou no Kindle Unlimited ↗</a>
      </section>
    </main>
  );
}
