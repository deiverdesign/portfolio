import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { METER, createCelMaterial } from "./celShading";
import { KITCHEN } from "./cozinhaCinza";

// Cena 3 — o Opala (versão em cinza, só formas, para testar o movimento).
// Rascunho do Deiver (12/10): a câmera sai de costas pela porta da casa da Helena, a porta
// encolhe numa parede cinza enorme, a parede some e o Opala aparece entre a câmera e a porta.
// Tudo em METROS, nas mesmas coordenadas da cozinha: z = 0 na parede da janela, a parede do
// fundo (com a porta) termina em z 6,15 e daí para trás é a rua do Opala.
export const OPALA = {
  // Porta nova na parede do fundo da cozinha (x = centro do vão).
  doorX: .6,
  doorWidth: .9,
  doorHeight: 2.1,
  // Face de fora da parede do fundo.
  wallZ: KITCHEN.depth + .15,
  // Onde o carro fica (a câmera passa por cima dele, como no quadro 9 do rascunho).
  carZ: 13,
  // Até onde a câmera recua: saindo pela porta (exitTo) e depois revelando o Opala (end).
  exitTo: 11,
  end: 18.5,
};

const OPALA_URL = "/enquanto-durar-a-fe/opala-web.glb?v=1";
// Opala do Meshy: 1,9 de comprimento no arquivo. A 2,15 fica com ~4,1 m e 1,45 m de altura
// (o modelo é estilizado, mais alto que o real; a altura é o que importa para a câmera passar por cima).
const OPALA_SCALE = 2.15;

const gray = (lit: string, mid: string, shade: string) => createCelMaterial({ lit, mid, shade, deep: shade, clean: true, cleanTones: 3 });

export function buildOpalaGray() {
  const root = new THREE.Group();
  const outside = new THREE.Group();
  outside.scale.setScalar(METER);
  root.add(outside);
  const { doorX, doorWidth, doorHeight, wallZ, carZ } = OPALA;

  // --- Parede enorme por fora da casa, com o vão da porta ----------------------------------
  // Transparente para poder sumir (quadro 9). 60 m de largura e 20 m de altura: de qualquer
  // ponto do recuo ela ocupa a tela inteira.
  const wallMaterial = gray("#c9c9c4", "#b4b4af", "#8e8e8a");
  wallMaterial.transparent = true;
  const wallWidth = 60;
  const wallHeight = 20;
  const wall = new THREE.Group();
  outside.add(wall);
  const wallPiece = (w: number, h: number, x: number, y: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMaterial);
    mesh.position.set(x, y, wallZ);
    wall.add(mesh);
  };
  const doorLeft = doorX - doorWidth / 2;
  const doorRight = doorX + doorWidth / 2;
  wallPiece(wallWidth / 2 + doorLeft, wallHeight, (-wallWidth / 2 + doorLeft) / 2, wallHeight / 2);
  wallPiece(wallWidth / 2 - doorRight, wallHeight, (wallWidth / 2 + doorRight) / 2, wallHeight / 2);
  wallPiece(doorWidth, wallHeight - doorHeight, doorX, (wallHeight + doorHeight) / 2);
  // Batente de fora (um pouco mais claro), como no rascunho.
  const trimMaterial = gray("#e2e2de", "#cfcfca", "#a4a4a0");
  trimMaterial.transparent = true;
  const trim = (w: number, h: number, x: number, y: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, .05), trimMaterial);
    mesh.position.set(x, y, wallZ + .025);
    wall.add(mesh);
  };
  trim(.08, doorHeight + .08, doorLeft - .04, (doorHeight + .08) / 2);
  trim(.08, doorHeight + .08, doorRight + .04, (doorHeight + .08) / 2);
  trim(doorWidth + .16, .08, doorX, doorHeight + .04);

  // --- A porta vista de fora: foto da cozinha presa no vão --------------------------------
  // Quando a câmera sai, a cozinha (pesada) deixa de ser desenhada e o vão passa a mostrar uma
  // "foto" dela, tirada da posição da câmera naquele quadro. A foto é projetada da mesma lente,
  // então encaixa no vão sem pular. Quando a parede some, a porta fica como um vulto vermelho.
  const doorViewMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uMap: { value: null as THREE.Texture | null },
      uViewProjection: { value: new THREE.Matrix4() },
      uOpacity: { value: 1 },
      uGhost: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform mat4 uViewProjection;
      uniform float uOpacity;
      uniform float uGhost;
      varying vec3 vWorld;
      void main() {
        vec4 clip = uViewProjection * vec4(vWorld, 1.0);
        vec2 uv = clip.xy / clip.w * .5 + .5;
        vec3 color = texture2D(uMap, uv).rgb;
        // Vulto: só o vermelho da janela continua forte; o resto vira um vinho transparente.
        float red = clamp(color.r - max(color.g, color.b), 0.0, 1.0);
        vec3 ghost = mix(vec3(.35, .02, .08), vec3(1.0, .15, .3), smoothstep(.1, .6, red));
        gl_FragColor = vec4(mix(color, ghost, uGhost), uOpacity);
        #include <colorspace_fragment>
      }
    `,
  });
  const doorView = new THREE.Mesh(new THREE.PlaneGeometry(doorWidth, doorHeight), doorViewMaterial);
  doorView.position.set(doorX, doorHeight / 2, wallZ - .01);
  doorView.visible = false;
  doorView.renderOrder = 6;
  outside.add(doorView);

  // --- Chão e fundo cinza ------------------------------------------------------------------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), gray("#6e6e6a", "#5f5f5b", "#4a4a47"));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(doorX, -.01, wallZ + 30);
  ground.receiveShadow = true;
  outside.add(ground);
  // Fundo: uma caixa enorme cinza-médio em volta de tudo, vista por dentro.
  const backdrop = new THREE.Mesh(new THREE.BoxGeometry(160, 60, 160), new THREE.MeshBasicMaterial({ color: "#7c7c78", side: THREE.BackSide }));
  backdrop.position.set(doorX, 29, wallZ + 10);
  backdrop.visible = false;
  outside.add(backdrop);

  // --- Opala, Jota e os dois amigos (sombras pretas) ----------------------------------------
  const carMaterial = gray("#bdbdb8", "#9a9a95", "#5a5a56");
  const car = new THREE.Group();
  car.position.set(doorX, 0, carZ);
  // Um pouco girado, como no quadro 10 (a frente vira para a direita e para a câmera).
  car.rotation.y = -.18;
  outside.add(car);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(OPALA_URL, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      (child.material as THREE.Material).dispose();
      child.material = carMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    model.scale.setScalar(OPALA_SCALE);
    // Rodas no chão, centralizado.
    const box = new THREE.Box3().setFromObject(model);
    model.position.y -= box.min.y;
    model.position.x -= (box.min.x + box.max.x) / 2;
    model.position.z -= (box.min.z + box.max.z) / 2;
    car.add(model);
  });

  // Amigos: só silhuetas pretas (Deiver). Manequins de cápsula por enquanto.
  const black = new THREE.MeshBasicMaterial({ color: "#050505" });
  const mannequin = (height: number, x: number, z: number, turn: number, lean = 0) => {
    const body = new THREE.Group();
    body.position.set(x, 0, z);
    body.rotation.y = turn;
    body.rotation.z = lean;
    const scale = height / 1.8;
    const part = (geometry: THREE.BufferGeometry, px: number, py: number, pz = 0) => {
      const mesh = new THREE.Mesh(geometry, black);
      mesh.position.set(px * scale, py * scale, pz * scale);
      mesh.scale.setScalar(scale);
      body.add(mesh);
      return mesh;
    };
    part(new THREE.CapsuleGeometry(.075, .72, 4, 10), -.1, .43);
    part(new THREE.CapsuleGeometry(.075, .72, 4, 10), .1, .43);
    part(new THREE.CapsuleGeometry(.19, .42, 4, 14), 0, 1.18).scale.z *= .65;
    part(new THREE.CapsuleGeometry(.055, .58, 4, 10), -.27, 1.12);
    part(new THREE.CapsuleGeometry(.055, .58, 4, 10), .27, 1.12);
    part(new THREE.SphereGeometry(.12, 16, 12), 0, 1.66);
    outside.add(body);
  };
  // Um encostado na traseira do carro, à direita; outro atrás do carro, de costas, meio escondido
  // (1,6 m para o lado do caminho da câmera, para ela não passar raspando nele).
  mannequin(1.78, doorX + 2.55, carZ + .2, -.4, .06);
  mannequin(1.72, doorX - 1.6, carZ - 1.6, Math.PI - .3);

  // Onde o Jota fica: à esquerda do carro, de frente para a câmera (quadros 10 e 11).
  const jotaSpot = new THREE.Vector3(doorX - 2.7, 0, carZ + .3);

  // fade = 0 a 1 enquanto a parede some; ghost = 0 a 1 enquanto a porta vira vulto vermelho.
  const update = ({ wallOpacity, doorOpacity, ghost }: { wallOpacity: number; doorOpacity: number; ghost: number }) => {
    wallMaterial.opacity = wallOpacity;
    trimMaterial.opacity = wallOpacity;
    wall.visible = wallOpacity > .001;
    // Parede opaca = escreve profundidade normal; sumindo, não esconde o que está atrás.
    wallMaterial.depthWrite = wallOpacity > .999;
    trimMaterial.depthWrite = wallOpacity > .999;
    backdrop.visible = wallOpacity < .999;
    doorViewMaterial.uniforms.uOpacity.value = doorOpacity;
    doorViewMaterial.uniforms.uGhost.value = ghost;
  };

  // Recebe a foto da cozinha (textura + a matriz da lente que tirou a foto).
  const setDoorView = (texture: THREE.Texture | null, viewProjection?: THREE.Matrix4) => {
    doorViewMaterial.uniforms.uMap.value = texture;
    if (viewProjection) doorViewMaterial.uniforms.uViewProjection.value.copy(viewProjection);
    doorView.visible = Boolean(texture);
  };

  const dispose = () => {
    carMaterial.dispose();
    black.dispose();
    doorViewMaterial.dispose();
  };

  // space = o grupo em metros (para prender o Jota e os bilhetes).
  return { group: root, space: outside, update, setDoorView, jotaSpot, dispose };
}
