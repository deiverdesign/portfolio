import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { METER, createOutlineMaterial } from "./celShading";
import { JOTA_MODEL_URL } from "../personagem-jota/jotaBands";
import { CITY, buildCity } from "./opalaCidade";

// Cena 3 — o Opala, à noite (direção do Deiver, 12/10): a cozinha é apagada pela luz do farol
// do Opala. Quando a luz baixa, o próprio farol aparece, depois o carro inteiro, parado, e só
// então o Jota e os dois amigos, três silhuetas inteiramente pretas.
// Tudo em METROS. O carro fica na origem. No "espaço do carro" a frente aponta para +z; na rua
// ele fica atravessado na diagonal (yaw), com o nariz para a direita da câmera, como na
// montagem do Deiver (13/10). Eixos: x = largura, y = altura, z = comprimento da rua.
const CAR_YAW = THREE.MathUtils.degToRad(36);
const inCarSpace = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), CAR_YAW);
export const OPALA = {
  yaw: CAR_YAW,
  // Comprimento e altura do carro na cena (o modelo do Meshy é estilizado: ~4,1 × 1,45 m).
  scale: 2.15,
  // Faróis, no espaço do carro: um de cada lado da grade, na frente.
  headlightX: .6,
  headlightY: .72,
  headlightZ: 2.0,
  // Câmera: começa colada no farol da direita (detalhe do farol e da grade) e recua até ver
  // o carro inteiro com as três sombras. eye = altura do olho do cameraman em pé.
  // No detalhe a lente fecha (closeFov) para o farol e a grade encherem o quadro; no fim ela
  // abre de novo (47°, a lente do resto do site).
  eye: 1.64,
  closeFrom: inCarSpace(.4, 1.64, 4.3),
  closeLookAt: inCarSpace(.3, .78, 1.95),
  closeFov: 22,
  // No fim o cameraman se agacha quase no chão (olho a ~45 cm, como na montagem) e olha rua
  // abaixo: o carro atravessado enche o meio do quadro, de três quartos pela frente.
  wideFrom: new THREE.Vector3(-.7, .4, 5.3),
  wideLookAt: new THREE.Vector3(.35, 2.5, -8),
};

// v2: o modelo agora leva uma textura pequena (1024 px) só para separar pintura, cromado,
// vidro e pneu; as cores finais vêm do shader.
const OPALA_URL = "/enquanto-durar-a-fe/opala-web.glb?v=2";

const SKY_URL = "/enquanto-durar-a-fe/texturas/ceu-opala.webp";
const SKY_ASPECT = 1672 / 941;
// Quantos postes o asfalto molhado reflete (os mais perto da câmera vêm primeiro).
const MAX_LAMPS = 10;

// Paleta da cena (referência do Deiver, 13/10): céu rosa pintado, prédios e rua em azuis
// profundos, detalhes em amarelo (postes, farol).
const NIGHT = {
  ground: "#10225a",
  groundFar: "#1b2b72",
  warm: "#fff4b8",
};
// Contorno escuro de desenho em volta do carro (as cores da pintura estão em createCarMaterial).
const CAR_INK = "#04071f";

export function buildOpalaNight() {
  const root = new THREE.Group();
  const space = new THREE.Group();
  space.scale.setScalar(METER);
  root.add(space);
  const glow = { value: 1 };

  // --- Céu: a pintura rosa do Deiver, presa à tela (como o céu da rua) ----------------------
  // Na horizontal ela acompanha a tela; na vertical o pé da imagem fica na linha do horizonte
  // (um pouco abaixo, para a névoa clara do pé da imagem encostar no chão) e o alto dela a ~38° acima, então o céu não "escorrega" quando a câmera baixa ou sobe.
  const skyMap = new THREE.TextureLoader().load(SKY_URL);
  skyMap.colorSpace = THREE.SRGBColorSpace;
  const skyResolution = new THREE.Vector2(1, 1);
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uMap: { value: skyMap },
        uResolution: { value: skyResolution },
        uImageAspect: { value: SKY_ASPECT },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform vec2 uResolution;
        uniform float uImageAspect;
        varying vec3 vDirection;
        void main() {
          float screenAspect = uResolution.x / uResolution.y;
          float x = gl_FragCoord.x / uResolution.x - .5;
          // Tela mais estreita que a imagem: mostra só o meio dela (celular vê o centro).
          float u = .5 + x * min(1.0, screenAspect / uImageAspect);
          float v = clamp((vDirection.y + .07) / .69, .004, .996);
          gl_FragColor = texture2D(uMap, vec2(u, v));
          #include <colorspace_fragment>
        }
      `,
    }),
  );
  sky.onBeforeRender = (renderer) => { renderer.getDrawingBufferSize(skyResolution); };
  // O céu fica sempre atrás: a rua vai além da esfera, e os prédios do fundo não podem sumir.
  (sky.material as THREE.ShaderMaterial).depthTest = false;
  sky.renderOrder = -1;
  sky.position.y = 2;
  space.add(sky);

  // --- A cidade: prédios, comércio, calçadas, postes e fios (opalaCidade.ts) -----------------
  const city = buildCity();
  space.add(city.group);
  const lampHeads = city.lamps.map((lamp) => new THREE.Vector2(lamp.head.x, lamp.head.z));
  while (lampHeads.length < MAX_LAMPS) lampHeads.push(new THREE.Vector2(0, 9999));

  // --- Asfalto molhado: azul-marinho, com a luz dos postes no chão, os reflexos esticados das
  // lâmpadas vindo na direção da câmera, o rosa do céu refletido ao longe e a mancha quente
  // que o farol joga na frente do carro.
  const groundMaterial = new THREE.ShaderMaterial({
    defines: { MAX_LAMPS: String(MAX_LAMPS) },
    uniforms: {
      uBase: { value: new THREE.Color(NIGHT.ground) },
      uFar: { value: new THREE.Color(NIGHT.groundFar) },
      uWarm: { value: new THREE.Color(NIGHT.warm) },
      uLamp: { value: new THREE.Color("#fff09a") },
      uSkyPink: { value: new THREE.Color("#c42e6e") },
      uLamps: { value: lampHeads.slice(0, MAX_LAMPS) },
      uCarYaw: { value: OPALA.yaw },
      uUnder: { value: new THREE.Color("#2a0418") },
      uMeter: { value: METER },
      uGlow: glow,
    },
    vertexShader: /* glsl */ `
      uniform float uMeter;
      varying vec2 vPoint;
      varying float vDistance;
      void main() {
        vPoint = position.xy;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vDistance = distance(world.xyz, cameraPosition) / uMeter;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    // vPoint = (x, -z) do chão, porque o plano foi deitado.
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uFar;
      uniform vec3 uWarm;
      uniform vec3 uLamp;
      uniform vec3 uSkyPink;
      uniform vec2 uLamps[MAX_LAMPS];
      uniform float uCarYaw;
      uniform vec3 uUnder;
      uniform float uGlow;
      varying vec2 vPoint;
      varying float vDistance;
      float hash(float n) { return fract(sin(n * 91.7) * 43758.5453); }
      void main() {
        vec2 p = vec2(vPoint.x, -vPoint.y);
        vec3 color = mix(uBase, uFar, smoothstep(10.0, 120.0, vDistance));
        // Rosa do céu refletido no asfalto molhado, mais forte quanto mais longe (ângulo raso),
        // quebrado em ondinhas horizontais.
        float ripple = .55 + .45 * sin(p.y * 2.3 + sin(p.x * .7) * 1.5);
        color = mix(color, uSkyPink, smoothstep(22.0, 110.0, vDistance) * .36 * ripple);
        float light = 0.0;
        float streak = 0.0;
        for (int i = 0; i < MAX_LAMPS; i++) {
          vec2 lamp = uLamps[i];
          vec2 d = (p - lamp) / vec2(2.2, 3.0);
          light += exp(-dot(d, d) * 1.4);
          // Reflexo: faixa fina embaixo da lâmpada, esticada para a câmera (+z), tremida.
          float along = p.y - lamp.y;
          float across = (p.x - lamp.x) / (.22 + along * .025);
          float band = .45 + .55 * step(.35, fract(p.y * 1.7 + hash(float(i)) * 3.0));
          streak += exp(-across * across) * smoothstep(-.5, 1.0, along) * (1.0 - smoothstep(4.0, 11.0, along)) * band;
        }
        color = mix(color, uLamp, min(light, 1.0) * .22);
        color = mix(color, uLamp, min(streak, 1.0) * .55);
        // Daqui para baixo, no espaço do carro (a frente dele aponta para +z).
        float c = cos(uCarYaw), s = sin(uCarYaw);
        vec2 q = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
        // Embaixo do carro: sombra bordô, como na montagem.
        vec2 under = q / vec2(1.05, 2.25);
        color = mix(color, uUnder, (1.0 - smoothstep(.75, 1.1, length(under))) * .85);
        // Duas manchas do farol, alongadas para a frente do carro (como a luz do poste da rua).
        float pool = 0.0;
        for (int i = 0; i < 2; i++) {
          float side = i == 0 ? -.6 : .6;
          vec2 d = (q - vec2(side * 1.2, 4.0)) / vec2(1.0, 2.1);
          pool += exp(-dot(d, d) * 1.6);
        }
        vec2 core = (q - vec2(0.0, 3.0)) / vec2(1.4, 1.2);
        pool = min(pool * .55 + exp(-dot(core, core) * 2.0) * .35, 1.0);
        color = mix(color, uWarm, pool * .6 * uGlow);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  // O chão cobre a rua inteira, da câmera até o fundo (CITY.farZ).
  // (O plano é deslocado na própria geometria: assim as contas do shader continuam em metros
  // do espaço do carro.)
  const groundGeometry = new THREE.PlaneGeometry(60, CITY.nearZ - CITY.farZ + 40);
  groundGeometry.translate(0, -(CITY.nearZ + CITY.farZ) / 2, 0);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  space.add(ground);

  // --- Opala: parado, atravessado na rua -----------------------------------------------------
  const carOutline = createOutlineMaterial({ color: CAR_INK, worldWidth: .012 * METER, minPixels: 1.5, maxPixels: 4.5 });
  const car = new THREE.Group();
  car.rotation.y = OPALA.yaw;
  space.add(car);
  const carMaterials: THREE.Material[] = [];
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(OPALA_URL, (gltf) => {
    const model = gltf.scene;
    const meshes: THREE.Mesh[] = [];
    model.traverse((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
    meshes.forEach((child) => {
      const original = child.material as THREE.MeshStandardMaterial;
      const material = createCarMaterial(original.map);
      original.dispose();
      carMaterials.push(material);
      child.material = material;
      // Contorno: a mesma forma, virada do avesso e um pouco maior, toda escura.
      const ink = new THREE.Mesh(child.geometry, carOutline);
      ink.onBeforeRender = (renderer) => { renderer.getDrawingBufferSize(carOutline.uniforms.uResolution.value); };
      child.add(ink);
    });
    model.scale.setScalar(OPALA.scale);
    // O comprimento do modelo está no eixo x, com a frente no lado -x: gira 90° para a frente
    // olhar para +z. (Antes girava para o outro lado e a câmera via a traseira do carro.)
    model.rotation.y = Math.PI / 2;
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

  // --- Três silhuetas pretas (pose da montagem do Deiver, 13/10): o Jota junto à porta do
  // motorista, virado para o carro; um amigo encostado na traseira, do mesmo lado; o outro
  // afastado, na calçada da direita. Sem rosto, roupa ou objeto: só a pose diferencia.
  const black = new THREE.MeshBasicMaterial({ color: "#020205" });
  const jota = new THREE.Group();
  // No espaço do carro: lado esquerdo (-x), na altura da porta, de frente para a lataria.
  jota.position.set(-1.3, 0, .35);
  jota.rotation.set(.1, Math.PI / 2, 0);
  car.add(jota);
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
  const mannequin = (parent: THREE.Object3D, height: number, x: number, y: number, z: number, turn: number, lean = 0) => {
    const body = new THREE.Group();
    body.position.set(x, y, z);
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
    parent.add(body);
    figures.push(body);
  };
  // Encostado na traseira, lado esquerdo, de costas para o carro e o corpo inclinado contra ele.
  mannequin(car, 1.76, -1.2, 0, -1.55, -Math.PI / 2, -.12);
  // O outro, afastado, em pé na calçada da direita, olhando para o carro.
  mannequin(space, 1.72, CITY.curbX + .9, CITY.curbHeight, -3.2, -Math.PI / 2 - .5);

  // Posição do farol da direita no mundo (é dali que a luz nasce na cozinha).
  const headlight = (target: THREE.Vector3) => target.set(OPALA.headlightX, OPALA.headlightY, OPALA.headlightZ).applyMatrix4(car.matrixWorld);

  // glowAmount = 0 a 1: quanto o farol "estoura" (1 = brilho enorme, logo depois do branco).
  // figures = as três sombras aparecem só quando a câmera já abriu (antes ficam fora do quadro).
  const update = ({ glowAmount, figuresOn }: { glowAmount: number; figuresOn: boolean }) => {
    glow.value = 1;
    halos.forEach((halo) => halo.scale.setScalar(THREE.MathUtils.lerp(.7, 5, glowAmount)));
    figures.forEach((figure) => { figure.visible = figuresOn; });
  };

  return { group: root, space, update, headlight, dispose: city.dispose };
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

// Pintura do Opala (montagem do Deiver, 13/10): cobalto escuro e saturado, gasto, com brilhos
// lavanda nas curvas de cima, cromados quase brancos, vidro azul com reflexo amarelo e um fio
// rosa do céu nas bordas. A textura original (verde, com ferrugem) só diz o que é cada parte:
// verde = pintura, cinza claro = cromado, quase preto = vidro/pneu, vermelho/laranja = lanternas.
function createCarMaterial(map: THREE.Texture | null) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uLight: { value: new THREE.Vector3(-.35, .85, .4).normalize() },
      uDeep: { value: new THREE.Color("#001256") },
      uMid: { value: new THREE.Color("#0b2f8b") },
      uLit: { value: new THREE.Color("#1d45b2") },
      uShine: { value: new THREE.Color("#93a6f2") },
      uChromeDark: { value: new THREE.Color("#1a3592") },
      uChromeLit: { value: new THREE.Color("#dfe6ff") },
      uGlass: { value: new THREE.Color("#0a1a5c") },
      uGlassLit: { value: new THREE.Color("#3c60c2") },
      uGlint: { value: new THREE.Color("#fff08f") },
      uTire: { value: new THREE.Color("#02030d") },
      uTail: { value: new THREE.Color("#d42a4a") },
      uRim: { value: new THREE.Color("#ff4f86") },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uLight, uDeep, uMid, uLit, uShine, uChromeDark, uChromeLit, uGlass, uGlassLit, uGlint, uTire, uTail, uRim;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec3 t = texture2D(uMap, vUv).rgb;
        float high = max(max(t.r, t.g), t.b);
        float low = min(min(t.r, t.g), t.b);
        float saturation = high > .001 ? (high - low) / high : 0.0;
        float luminance = dot(t, vec3(.2126, .7152, .0722));
        vec3 n = normalize(vNormal);
        if (!gl_FrontFacing) n = -n;
        vec3 v = normalize(vView);
        float diffuse = dot(n, uLight);
        float spec = pow(max(dot(reflect(-uLight, n), v), 0.0), 18.0);
        float edge = 1.0 - max(dot(n, v), 0.0);
        bool paint = t.g > t.r * 1.15 && t.g > t.b * .95 && saturation > .2;
        bool tail = t.r > t.g * 1.5 && t.r > .12;
        // Laranja (pisca da frente) acende amarelo como o farol; só o vermelho é lanterna.
        bool blinker = tail && t.g > t.r * .3;
        bool chrome = !paint && !tail && saturation < .22 && luminance > .3;
        vec3 color;
        if (paint) {
          // Faixas chapadas: sombra, meio, luz e o brilho lavanda nas curvas viradas para cima.
          color = diffuse < -.05 ? uDeep : diffuse < .35 ? uMid : uLit;
          color = mix(color, uShine, step(.55, spec) * .9);
          // Pintura gasta: as manchas de ferrugem do original viram manchas mais escuras.
          float wear = smoothstep(.12, .03, t.g - t.r);
          color = mix(color, uDeep, wear * .55);
        } else if (blinker) {
          color = uGlint;
        } else if (tail) {
          color = uTail;
        } else if (chrome) {
          // Cromado: quase branco onde reflete a luz, azul onde não.
          color = mix(uChromeDark, uChromeLit, step(.2, diffuse * .6 + spec));
        } else if (n.y > .35) {
          // Vidro de cima (para-brisa, vigia): azul claro com um risco de reflexo amarelo.
          color = mix(uGlass, uGlassLit, smoothstep(.35, .7, n.y));
          color = mix(color, uGlint, step(.6, spec) * .85);
        } else {
          color = luminance < .1 ? uTire : uGlass;
        }
        // Fio rosa do céu nas bordas viradas para cima/para a esquerda.
        color = mix(color, uRim, smoothstep(.72, .9, edge) * step(.05, n.y - n.x * .3) * .8);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}
