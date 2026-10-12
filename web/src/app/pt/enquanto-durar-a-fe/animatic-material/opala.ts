import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { METER, createCelMaterial } from "./celShading";
import { JOTA_MODEL_URL } from "../personagem-jota/jotaBands";

// Cena 3 — o Opala, à noite (direção do Deiver, 12/10): a cozinha é apagada pela luz do farol
// do Opala. Quando a luz baixa, o próprio farol aparece, depois o carro inteiro, parado, e só
// então o Jota e os dois amigos, três silhuetas inteiramente pretas.
// Tudo em METROS. O carro fica na origem, com a frente virada para +z (para a câmera).
// Eixos: x = largura (direita positiva, olhando de frente para o carro), y = altura.
export const OPALA = {
  // Comprimento e altura do carro na cena (o modelo do Meshy é estilizado: ~4,1 × 1,45 m).
  scale: 2.15,
  // Faróis, no espaço do carro: um de cada lado da grade, na frente.
  headlightX: .6,
  headlightY: .72,
  headlightZ: 2.0,
  // Câmera: começa colada no farol da direita (detalhe do farol e da grade) e recua até ver
  // o carro inteiro com as três sombras. eye = altura do olho do cameraman.
  // No detalhe a lente fecha (closeFov) para o farol e a grade encherem o quadro; no fim ela
  // abre de novo (47°, a lente do resto do site).
  eye: 1.64,
  closeFrom: new THREE.Vector3(.4, 1.64, 4.3),
  closeLookAt: new THREE.Vector3(.3, .78, 1.95),
  closeFov: 22,
  wideFrom: new THREE.Vector3(-.4, 1.64, 8.6),
  wideLookAt: new THREE.Vector3(-.75, .95, 0),
};

const OPALA_URL = "/enquanto-durar-a-fe/opala-web.glb?v=1";

// Paleta da noite (referência do Deiver: céu e morros em azul e roxo profundos, verde
// envelhecido do Opala, branco quente do farol).
const NIGHT = {
  skyTop: "#05062a",
  skyMid: "#1a1361",
  skyHorizon: "#4a1f86",
  ground: "#140f3a",
  groundFar: "#2a1a63",
  warm: "#fff1d2",
};
// Verde do Opala: claro desbotado na luz, oliva no meio, quase preto-esverdeado na sombra.
const CAR_GREEN = { lit: "#6f8d58", mid: "#45603f", shade: "#1f3028", deep: "#0e1716" };

export function buildOpalaNight() {
  const root = new THREE.Group();
  const space = new THREE.Group();
  space.scale.setScalar(METER);
  root.add(space);
  const glow = { value: 1 };

  // --- Céu: degradê vertical em volta de tudo, com estrelas pequenas -------------------------
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(NIGHT.skyTop) },
        uMid: { value: new THREE.Color(NIGHT.skyMid) },
        uHorizon: { value: new THREE.Color(NIGHT.skyHorizon) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        varying vec3 vDirection;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
        void main() {
          float up = clamp(vDirection.y, 0.0, 1.0);
          vec3 color = mix(uHorizon, uMid, smoothstep(0.0, .18, up));
          color = mix(color, uTop, smoothstep(.18, .6, up));
          // Estrelas: pontinhos redondos esparsos, só no alto.
          vec2 cell = vec2(atan(vDirection.x, vDirection.z) * 60.0, up * 90.0);
          vec2 id = floor(cell);
          vec2 inside = fract(cell) - .5;
          float star = step(.965, hash(id)) * (1.0 - smoothstep(.08, .16, length(inside))) * smoothstep(.12, .3, up);
          color += vec3(1.0, .93, .7) * star * .8;
          gl_FragColor = vec4(color, 1.0);
          #include <colorspace_fragment>
        }
      `,
    }),
  );
  sky.position.y = 2;
  space.add(sky);

  // --- Chão: roxo-azulado escuro, com a mancha quente que o farol joga na frente do carro ----
  const groundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(NIGHT.ground) },
      uFar: { value: new THREE.Color(NIGHT.groundFar) },
      uWarm: { value: new THREE.Color(NIGHT.warm) },
      uGlow: glow,
    },
    vertexShader: /* glsl */ `
      varying vec2 vPoint;
      void main() {
        vPoint = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    // vPoint = (x, -z) do chão, porque o plano foi deitado.
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uFar;
      uniform vec3 uWarm;
      uniform float uGlow;
      varying vec2 vPoint;
      void main() {
        vec2 p = vec2(vPoint.x, -vPoint.y);
        vec3 color = mix(uBase, uFar, smoothstep(6.0, 28.0, length(p)));
        // Duas manchas do farol, alongadas para a frente do carro (como a luz do poste da rua).
        float pool = 0.0;
        for (int i = 0; i < 2; i++) {
          float side = i == 0 ? -.6 : .6;
          vec2 d = (p - vec2(side * 1.2, 4.0)) / vec2(1.0, 2.1);
          pool += exp(-dot(d, d) * 1.6);
        }
        vec2 core = (p - vec2(0.0, 3.0)) / vec2(1.4, 1.2);
        pool = min(pool * .55 + exp(-dot(core, core) * 2.0) * .35, 1.0);
        color = mix(color, uWarm, pool * .6 * uGlow);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  space.add(ground);

  // --- Opala: parado, de frente para a câmera, verde envelhecido ------------------------------
  const carMaterial = createCelMaterial({ ...CAR_GREEN, rim: "#c9d8a0", rimAmount: .25, clean: true, cleanTones: 3 });
  const car = new THREE.Group();
  space.add(car);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(OPALA_URL, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      (child.material as THREE.Material).dispose();
      child.material = carMaterial;
    });
    model.scale.setScalar(OPALA.scale);
    // O comprimento do modelo está no eixo x: gira 90° para a frente olhar para +z.
    model.rotation.y = -Math.PI / 2;
    const box = new THREE.Box3().setFromObject(model);
    model.position.y -= box.min.y;
    model.position.x -= (box.min.x + box.max.x) / 2;
    model.position.z -= (box.min.z + box.max.z) / 2;
    car.add(model);
  });

  // Faróis: disco de luz quente + brilho em volta (o brilho é o que "apaga" a cozinha).
  const discMaterial = new THREE.MeshBasicMaterial({ color: NIGHT.warm });
  const haloTexture = radialTexture();
  const halos: THREE.Sprite[] = [];
  [-1, 1].forEach((side) => {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(.085, 32), discMaterial);
    disc.position.set(side * OPALA.headlightX, OPALA.headlightY, OPALA.headlightZ + .01);
    car.add(disc);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTexture, color: NIGHT.warm, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    halo.position.copy(disc.position).add(new THREE.Vector3(0, 0, .05));
    halo.renderOrder = 5;
    car.add(halo);
    halos.push(halo);
  });

  // --- Três silhuetas pretas: Jota encostado no carro, um amigo perto do capô, outro afastado,
  // de costas. Sem rosto, roupa ou objeto: só a pose diferencia.
  const black = new THREE.MeshBasicMaterial({ color: "#020205" });
  const jota = new THREE.Group();
  // Encostado na lateral esquerda do carro, o corpo inclinado para trás, contra a porta.
  jota.position.set(-1.12, 0, .1);
  jota.rotation.set(0, .35, -.07);
  space.add(jota);
  const figures: THREE.Object3D[] = [jota];
  // Mesmo arquivo do Jota da rua (já no cache), só a forma, toda preta.
  new GLTFLoader().load(JOTA_MODEL_URL, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      [child.material].flat().forEach((material) => material.dispose());
      child.material = black;
    });
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(1.83 / size.y);
    box.setFromObject(model);
    model.position.y -= box.min.y;
    model.position.x -= (box.min.x + box.max.x) / 2;
    model.position.z -= (box.min.z + box.max.z) / 2;
    jota.add(model);
  });
  const mannequin = (height: number, x: number, z: number, turn: number, lean = 0) => {
    const body = new THREE.Group();
    body.position.set(x, 0, z);
    body.rotation.set(0, turn, lean);
    const scale = height / 1.8;
    const part = (geometry: THREE.BufferGeometry, px: number, py: number) => {
      const mesh = new THREE.Mesh(geometry, black);
      mesh.position.set(px * scale, py * scale, 0);
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
    space.add(body);
    figures.push(body);
  };
  // Amigo perto do capô: ao lado da quina da frente, do lado esquerdo, virado para o Jota.
  mannequin(1.76, -1.75, 1.5, -.9);
  // O outro, afastado e de costas, mais para trás e para a esquerda.
  mannequin(1.72, -3.5, -1.9, Math.PI + .25);

  // Posição do farol da direita no mundo (é dali que a luz nasce na cozinha).
  const headlight = (target: THREE.Vector3) => target.set(OPALA.headlightX, OPALA.headlightY, OPALA.headlightZ).applyMatrix4(space.matrixWorld);

  // glowAmount = 0 a 1: quanto o farol "estoura" (1 = brilho enorme, logo depois do branco).
  // figures = as três sombras aparecem só quando a câmera já abriu (antes ficam fora do quadro).
  const update = ({ glowAmount, figuresOn }: { glowAmount: number; figuresOn: boolean }) => {
    glow.value = 1;
    halos.forEach((halo) => halo.scale.setScalar(THREE.MathUtils.lerp(.7, 5, glowAmount)));
    figures.forEach((figure) => { figure.visible = figuresOn; });
  };

  return { group: root, space, update, headlight };
}

function radialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(.18, "rgba(255,255,255,.7)");
    gradient.addColorStop(.5, "rgba(255,255,255,.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}
