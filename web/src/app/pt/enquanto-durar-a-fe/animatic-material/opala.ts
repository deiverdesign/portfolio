import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { METER, createOutlineMaterial } from "./celShading";
import { CITY, buildCity } from "./opalaCidade";
import { buildRain } from "./opalaChuva";

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
  headlightX: .68,
  headlightY: .57,
  headlightZ: 1.93,
  // Câmera: começa colada no farol da direita (detalhe do farol e da grade) e recua até ver
  // o carro inteiro com as três sombras. eye = altura do olho do cameraman em pé.
  // No detalhe a lente fecha (closeFov) para o farol e a grade encherem o quadro; no fim ela
  // abre de novo (47°, a lente do resto do site).
  eye: 1.64,
  closeFrom: inCarSpace(.4, 1.64, 4.3),
  closeLookAt: inCarSpace(.3, .78, 1.95),
  closeFov: 22,
  // No fim o cameraman se agacha quase no chão (olho a ~40 cm, como na montagem) e olha rua
  // abaixo, alinhado com o carro: o carro atravessado no meio da rua esconde o fim dela.
  wideFrom: new THREE.Vector3(.25, .4, 5.6),
  wideLookAt: new THREE.Vector3(.25, 2.3, -8),
};

// Transição cozinha → Opala (wipe por oclusão, Deiver 13/10). color = o preto azulado da
// parede em sombra, igual nas duas cenas (a pessoa não pode ver onde uma acaba e a outra
// começa). Tudo em metros, no espaço da rua; z = um pouco à frente da lente final.
export const WIPE = {
  color: "#05061a",
  poleX: -(CITY.curbX + .55),
  poleZ: OPALA.wideFrom.z - .22,
  poleRadius: .14,
  buildingZ: OPALA.wideFrom.z - .25,
};

// v2: o modelo agora leva uma textura pequena (1024 px) só para separar pintura, cromado,
// vidro e pneu; as cores finais vêm do shader.
// Onde o Jota fica, no espaço do carro: do outro lado do capô (x), perto do para-brisa (z),
// virado para o carro e debruçado sobre ele, com a mão e o pano em cima do capô (rascunho do
// Deiver, 13/10). height = altura dele curvado; lean negativo endireita um pouco o corpo e y o
// ergue 4 cm, para a mão subir até a lataria e aparecer da câmera baixa.
const JOTA_PANO = { x: 1.17, z: .9, turn: -Math.PI / 2, height: 1.8, lean: -.06, y: .04 };
const OPALA_URL = "/enquanto-durar-a-fe/opala-web.glb?v=5";
// O Jota passando pano no carro (modelo do Deiver no Meshy, 13/10), já na pose da montagem.
// Centro de cada olho e o raio da sombra em volta, nas unidades do arquivo (não em metros).
const JOTA_PANO_EYES = [new THREE.Vector3(-.0658, .6957, .1816), new THREE.Vector3(-.1551, .6856, .1756)];
const JOTA_PANO_EYE_RADIUS = .06;
// Altura do queixo (unidades do arquivo): a pele acima dela é o rosto.
const JOTA_PANO_CHIN = new THREE.Vector3(-.11, .5, .15);
// Onde fica o poste que ilumina a cabeça do Jota, em metros, a partir do queixo dele.
const JOTA_LAMP = { up: 2, forward: .7, left: .6 };
const JOTA_PANO_URL = "/enquanto-durar-a-fe/jota-pano-web.glb?v=2";
// Os dois amigos do Jota (modelos do Deiver no Meshy, 13/10), sem textura: viram sombras.
const FRIEND_LEANING_URL = "/enquanto-durar-a-fe/amigo-encostado-web.glb";
const FRIEND_ARMS_URL = "/enquanto-durar-a-fe/amigo-bracos-cruzados-web.glb";
// Quanto o amigo encostado inclina para trás, contra o carro (radianos).
const FRIEND_LEANING_TILT = .16;

const SKY_URL = "/enquanto-durar-a-fe/texturas/ceu-opala.webp?v=2";
// Pattern de asfalto molhado do Deiver (13/10), repetido no chão. Um quadro cobre 5 × 10 m
// (o comprido vai ao longo da rua, então os reflexos rosa ficam esticados para o fundo).
const ASPHALT_URL = "/enquanto-durar-a-fe/texturas/asfalto-opala.webp";
const ASPHALT_TILE = new THREE.Vector2(5, 10);
const SKY_ASPECT = 2044 / 1148;
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
  // Chuva parada no ar (Aranhaverso), na mesma rua.
  const rain = buildRain(city.lamps);
  space.add(rain.group);
  const lampHeads = city.lamps.map((lamp) => new THREE.Vector2(lamp.head.x, lamp.head.z));
  while (lampHeads.length < MAX_LAMPS) lampHeads.push(new THREE.Vector2(0, 9999));

  // --- Asfalto molhado: azul-marinho, com a luz dos postes no chão, os reflexos esticados das
  // lâmpadas vindo na direção da câmera, o rosa do céu refletido ao longe e a mancha quente
  // que o farol joga na frente do carro.
  const asphaltMap = new THREE.TextureLoader().load(ASPHALT_URL);
  asphaltMap.colorSpace = THREE.SRGBColorSpace;
  asphaltMap.wrapS = asphaltMap.wrapT = THREE.RepeatWrapping;
  asphaltMap.anisotropy = 8;
  const groundMaterial = new THREE.ShaderMaterial({
    defines: { MAX_LAMPS: String(MAX_LAMPS) },
    uniforms: {
      uAsphalt: { value: asphaltMap },
      uAsphaltTile: { value: ASPHALT_TILE },
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
      uLampOn: { value: 1 },
    },
    vertexShader: /* glsl */ `
      uniform float uMeter;
      varying vec2 vPoint;
      varying float vDistance;
      varying float vMeters;
      void main() {
        vPoint = position.xy;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vDistance = distance(world.xyz, cameraPosition) / uMeter;
        // Distância medida na escala do próprio chão (o pattern se desfaz só bem lá no fundo).
        vMeters = distance(world.xyz, cameraPosition) / length(modelMatrix[0].xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    // vPoint = (x, -z) do chão, porque o plano foi deitado.
    fragmentShader: /* glsl */ `
      uniform sampler2D uAsphalt;
      uniform vec2 uAsphaltTile;
      uniform vec3 uBase;
      uniform vec3 uFar;
      uniform vec3 uWarm;
      uniform vec3 uLamp;
      uniform vec3 uSkyPink;
      uniform vec2 uLamps[MAX_LAMPS];
      uniform float uCarYaw;
      uniform vec3 uUnder;
      uniform float uGlow;
      uniform float uLampOn;
      varying vec2 vPoint;
      varying float vDistance;
      varying float vMeters;
      float hash(float n) { return fract(sin(n * 91.7) * 43758.5453); }
      void main() {
        vec2 p = vec2(vPoint.x, -vPoint.y);
        // O pattern do Deiver é a base. Longe, ele se desfaz no azul do fundo (de longe, o
        // desenho repetido viraria um xadrez miúdo e tremido).
        vec3 asphalt = texture2D(uAsphalt, p / uAsphaltTile).rgb;
        vec3 color = mix(asphalt, mix(uBase, uFar, smoothstep(10.0, 120.0, vDistance)), smoothstep(90.0, 320.0, vMeters) * .75);
        // Rosa do céu refletido no asfalto molhado, mais forte quanto mais longe (ângulo raso),
        // quebrado em ondinhas horizontais.
        float ripple = .55 + .45 * sin(p.y * 2.3 + sin(p.x * .7) * 1.5);
        color = mix(color, uSkyPink, smoothstep(70.0, 260.0, vMeters) * .3 * ripple);
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
        color = mix(color, uLamp, min(light, 1.0) * .22 * uLampOn);
        color = mix(color, uLamp, min(streak, 1.0) * .55 * uLampOn);
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
      // v4: a peça de cada triângulo já vem gravada no arquivo (_REGION), decidida na
      // resolução cheia do Meshy antes de simplificar. Sem ela, cai no cálculo pela textura.
      const baked = child.geometry.getAttribute("_region");
      if (baked) child.geometry.setAttribute("aRegion", baked);
      else child.geometry = carRegions(child.geometry, original.map);
      const material = createCarMaterial();
      original.map?.dispose();
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

  // Faróis: a própria lente do modelo acende (peça "lâmpada", no shader do carro); aqui fica
  // só o brilho em volta (o brilho é o que "apaga" a cozinha), centrado na lente.
  const haloTexture = radialTexture();
  const halos: THREE.Sprite[] = [];
  [-1, 1].forEach((side) => {
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTexture, color: NIGHT.warm, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    halo.position.set(side * OPALA.headlightX, OPALA.headlightY, OPALA.headlightZ + .03);
    halo.renderOrder = 5;
    car.add(halo);
    halos.push(halo);
  });

  // --- O Jota e os dois amigos (montagem do Deiver, 13/10). O Jota, junto à porta do motorista,
  // curvado, passa um pano na lataria: pintado como na montagem (roupa azul-marinho, pele azul,
  // pano claro, fio rosa nas bordas). Os amigos continuam sombras pretas: um encostado na
  // traseira, do mesmo lado; o outro afastado, na calçada da direita.
  const jota = new THREE.Group();
  // No espaço do carro: lado esquerdo (-x), na altura da porta, de frente para a lataria (+x).
  jota.position.set(JOTA_PANO.x, JOTA_PANO.y, JOTA_PANO.z);
  jota.rotation.y = JOTA_PANO.turn;
  car.add(jota);
  const figures: THREE.Object3D[] = [jota];
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(JOTA_PANO_URL, (gltf) => {
    const model = gltf.scene;
    const meshes: THREE.Mesh[] = [];
    model.traverse((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
    meshes.forEach((child) => {
      const original = child.material as THREE.MeshStandardMaterial;
      child.geometry = bakeRegions(child.geometry, original.map, figureRegionOfPixel);
      // A textura continua só para o rosto: os traços escuros (olhos, sobrancelha, barba) e a
      // sombra dos olhos (veja createFigureMaterial).
      child.material = createFigureMaterial(original.map);
      original.dispose();
      const ink = new THREE.Mesh(child.geometry, carOutline);
      ink.onBeforeRender = (renderer) => { renderer.getDrawingBufferSize(carOutline.uniforms.uResolution.value); };
      child.add(ink);
    });
    // O modelo vem curvado; JOTA_PANO.height é a altura dele assim (o Jota em pé tem 1,83 m).
    const box = new THREE.Box3().setFromObject(model);
    model.scale.setScalar(JOTA_PANO.height / box.getSize(new THREE.Vector3()).y);
    box.setFromObject(model);
    model.position.y -= box.min.y;
    model.position.x -= (box.min.x + box.max.x) / 2;
    model.position.z -= (box.min.z + box.max.z) / 2;
    // Inclinação do corpo (veja JOTA_PANO.lean), girando em torno dos pés.
    const lean = new THREE.Group();
    lean.rotation.x = JOTA_PANO.lean;
    lean.add(model);
    jota.add(lean);
    // Olhos no espaço do próprio modelo (medidos na textura do Meshy: onde está cada pupila).
    // A cada quadro vão para o mundo, porque o shader compara com a posição no mundo.
    const material = meshes[0].material as THREE.ShaderMaterial;
    const lampOffset = new THREE.Vector3();
    const cameraLeft = new THREE.Vector3();
    meshes[0].onBeforeRender = (_renderer, _scene, camera) => {
      model.updateWorldMatrix(true, false);
      // Poste: 2 m acima da cabeça, um pouco à frente dele (para o lado da câmera) e à esquerda
      // da câmera. Medido a partir da câmera, para valer em qualquer quadro.
      const head = material.uniforms.uLampPos.value.copy(JOTA_PANO_CHIN).applyMatrix4(model.matrixWorld);
      camera.getWorldDirection(lampOffset).setY(0).normalize();
      cameraLeft.set(lampOffset.z, 0, -lampOffset.x);
      head.addScaledVector(lampOffset, -JOTA_LAMP.forward).addScaledVector(cameraLeft, JOTA_LAMP.left);
      head.y += JOTA_LAMP.up;
      JOTA_PANO_EYES.forEach((eye, i) => material.uniforms.uEyes.value[i].copy(eye).applyMatrix4(model.matrixWorld));
      material.uniforms.uEyeRadius.value = JOTA_PANO_EYE_RADIUS * model.matrixWorld.getMaxScaleOnAxis();
      material.uniforms.uFaceY.value = JOTA_PANO_CHIN.clone().applyMatrix4(model.matrixWorld).y;
    };
  });
  // Os dois amigos (modelos do Deiver no Meshy, 13/10, já na pose): sombras quase pretas com o
  // fio rosa do céu nas bordas, como nos recortes dele. Um encostado na traseira, mãos no bolso e
  // pernas cruzadas; o outro de braços cruzados na calçada da direita, olhando para o carro.
  const friendMaterial = createSilhouetteMaterial();
  const friend = (url: string, parent: THREE.Object3D, height: number, x: number, y: number, z: number, turn: number, lean = 0) => {
    const body = new THREE.Group();
    body.position.set(x, y, z);
    body.rotation.y = turn;
    body.visible = false;
    parent.add(body);
    figures.push(body);
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(url, (gltf) => {
      const model = gltf.scene;
      const meshes: THREE.Mesh[] = [];
      model.traverse((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
      meshes.forEach((child) => {
        (child.material as THREE.Material).dispose();
        if (!child.geometry.getAttribute("normal")) child.geometry.computeVertexNormals();
        child.material = friendMaterial;
        const ink = new THREE.Mesh(child.geometry, carOutline);
        ink.onBeforeRender = (renderer) => { renderer.getDrawingBufferSize(carOutline.uniforms.uResolution.value); };
        child.add(ink);
      });
      const box = new THREE.Box3().setFromObject(model);
      model.scale.setScalar(height / box.getSize(new THREE.Vector3()).y);
      box.setFromObject(model);
      model.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
      // Inclinação para trás (encostado), girando em torno dos pés.
      const tilt = new THREE.Group();
      tilt.rotation.x = -lean;
      tilt.add(model);
      body.add(tilt);
    });
  };
  // Encostado na traseira, lado esquerdo, de costas para o carro.
  friend(FRIEND_LEANING_URL, car, 1.8, -1.12, 0, -1.3, -Math.PI / 2, FRIEND_LEANING_TILT);
  // O outro, afastado, em pé na calçada da direita, de braços cruzados olhando para o carro.
  friend(FRIEND_ARMS_URL, space, 1.85, CITY.curbX + .9, CITY.curbHeight, -3.2, -Math.PI / 2 - .5);

  // Posição do farol da direita no mundo (é dali que a luz nasce na cozinha).
  const headlight = (target: THREE.Vector3) => target.set(OPALA.headlightX, OPALA.headlightY, OPALA.headlightZ).applyMatrix4(car.matrixWorld);

  // --- Wipe de entrada (Deiver, 13/10): a câmera desliza para a direita vindo da cozinha e
  // passa colada atrás de um prédio em sombra e de um poste escuro, da mesma cor da parede da
  // cozinha. Os dois ficam a ~25 cm da lente, à esquerda do lugar final da câmera: no quadro
  // final eles estão bem fora da tela. A borda direita do poste é a que revela a rua.
  const occluderMaterial = new THREE.MeshBasicMaterial({ color: WIPE.color, side: THREE.DoubleSide });
  const shadowBuilding = new THREE.Mesh(new THREE.BoxGeometry(6, 12, .2), occluderMaterial);
  shadowBuilding.position.set(WIPE.poleX - .05 - 3, 6, WIPE.buildingZ - .1);
  space.add(shadowBuilding);
  const darkPole = new THREE.Mesh(new THREE.CylinderGeometry(WIPE.poleRadius, WIPE.poleRadius, 8.2, 20), occluderMaterial);
  darkPole.position.set(WIPE.poleX, 4.1, WIPE.poleZ);
  space.add(darkPole);

  // glowAmount = 0 a 1: quanto o farol "estoura". figures = as três sombras visíveis.
  // lightsOn = 0 a 1: rosa do céu nas bordas e luz amarela dos postes (acendem depois do wipe).
  const update = ({ glowAmount, figuresOn, lightsOn = 1 }: { glowAmount: number; figuresOn: boolean; lightsOn?: number }) => {
    glow.value = 1;
    halos.forEach((halo) => halo.scale.setScalar(THREE.MathUtils.lerp(.7, 5, glowAmount)));
    figures.forEach((figure) => { figure.visible = figuresOn; });
    city.setLights(lightsOn);
    rain.setLights(lightsOn);
    groundMaterial.uniforms.uLampOn.value = lightsOn;
  };

  return {
    group: root,
    space,
    update,
    headlight,
    dispose: () => {
      city.dispose();
      rain.dispose();
      asphaltMap.dispose();
      occluderMaterial.dispose();
      shadowBuilding.geometry.dispose();
      darkPole.geometry.dispose();
    },
  };
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
// Peças do carro: cada triângulo do modelo vira UMA peça (lata, cromado, vidro, pneu, lanterna,
// pisca). A textura original do Meshy só serve para decidir isso; ela tem sujeira, ferrugem e
// reflexos pintados, e se a cor fosse lida ponto a ponto, cada mancha virava uma pinta no carro.
// Decidindo por triângulo, e depois deixando cada um "votar" com os vizinhos, as peças ficam
// chapadas e limpas, como num desenho.
const REGION = { paint: 0, chrome: 1, glass: 2, tire: 3, tail: 4, blinker: 5 };

// Textura do Opala v3 (13/10, já nas cores da cena): azul = lata, amarelo = cromado,
// laranja = lanternas e piscas, cinza = grade e placa (cromado), azul quase preto = vidro ou
// pneu (decidido depois pela altura e pelas rodas, em splitDarkParts).
function regionOfPixel(r: number, g: number, b: number) {
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  const saturation = high > .001 ? (high - low) / high : 0;
  if (r > .3 && g < r * .6 && b < r * .4) return REGION.tail;
  if (r > .3 && g > .25 && b < r * .5) return REGION.chrome;
  if (saturation < .3 && high > .1) return REGION.chrome;
  if (high < .1) return REGION.tire;
  return REGION.paint;
}

function carRegions(source: THREE.BufferGeometry, map: THREE.Texture | null) {
  return bakeRegions(source, map, regionOfPixel, (geometry, region) => {
    splitDarkParts(geometry, region);
    paintTires(geometry, region);
  });
}

// Igual para qualquer modelo do Meshy: cada triângulo recebe a peça que a maioria dos pontos
// dele indica na textura (classify), depois os vizinhos votam, e por fim um ajuste opcional.
function bakeRegions(
  source: THREE.BufferGeometry,
  map: THREE.Texture | null,
  classify: (r: number, g: number, b: number) => number,
  finish?: (geometry: THREE.BufferGeometry, region: Uint8Array) => void,
) {
  const geometry = source.index ? source.toNonIndexed() : source.clone();
  const count = geometry.attributes.position.count;
  const triangles = count / 3;
  const region = new Uint8Array(triangles);
  const image = map?.image as CanvasImageSource & { width: number; height: number } | undefined;
  if (image && image.width) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    // A textura vem em sRGB; os limites acima foram acertados com a cor linear.
    const linear = new Float32Array(256).map((_, i) => { const c = i / 255; return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); });
    // UVs crus (inteiros 0..65535 quando quantizados): converte uma vez, sem chamar getX a cada ponto.
    const uvAttribute = geometry.attributes.uv as THREE.BufferAttribute;
    const uvScale = uvAttribute.normalized && uvAttribute.array instanceof Uint16Array ? 1 / 65535 : uvAttribute.normalized && uvAttribute.array instanceof Uint8Array ? 1 / 255 : 1;
    const uvRaw = uvAttribute.array;
    const uvStride = uvAttribute.itemSize;
    const weights = [[1 / 3, 1 / 3, 1 / 3], [.7, .15, .15], [.15, .7, .15], [.15, .15, .7], [.45, .45, .1], [.1, .45, .45], [.45, .1, .45]];
    const votes = new Uint8Array(6);
    const { width, height } = canvas;
    for (let t = 0; t < triangles; t++) {
      votes.fill(0);
      const o0 = t * 3 * uvStride, o1 = o0 + uvStride, o2 = o1 + uvStride;
      for (const [a, b, c] of weights) {
        const u = (uvRaw[o0] * a + uvRaw[o1] * b + uvRaw[o2] * c) * uvScale;
        const v = (uvRaw[o0 + 1] * a + uvRaw[o1 + 1] * b + uvRaw[o2 + 1] * c) * uvScale;
        const x = Math.min(width - 1, Math.max(0, Math.floor((u - Math.floor(u)) * width)));
        const y = Math.min(height - 1, Math.max(0, Math.floor((v - Math.floor(v)) * height)));
        const i = (y * width + x) * 4;
        votes[classify(linear[pixels[i]], linear[pixels[i + 1]], linear[pixels[i + 2]])]++;
      }
      let best = 0;
      for (let r = 1; r < 6; r++) if (votes[r] > votes[best]) best = r;
      region[t] = best;
    }
    smoothRegions(geometry, region);
    finish?.(geometry, region);
  }
  const perVertex = new Float32Array(count);
  for (let i = 0; i < count; i++) perVertex[i] = region[Math.floor(i / 3)];
  geometry.setAttribute("aRegion", new THREE.BufferAttribute(perVertex, 1));
  return geometry;
}

// Cada triângulo olha os vizinhos que dividem uma aresta com ele: se a maioria é outra peça,
// ele vira essa peça. Assim somem as pintas soltas (um triângulo de "vidro" no meio da lata).
function smoothRegions(geometry: THREE.BufferGeometry, region: Uint8Array) {
  // Vértices no mesmo lugar (separados só pela costura da textura) contam como um só.
  // O modelo guarda posições como números inteiros (quantizadas): a chave é feita deles.
  const position = geometry.attributes.position;
  const raw = position.array;
  const stride = (position as THREE.BufferAttribute).itemSize;
  const ids = new Map<number, number>();
  const vertexId = new Uint32Array(position.count);
  for (let i = 0; i < position.count; i++) {
    const o = i * stride;
    const key = Number.isInteger(raw[o])
      ? ((raw[o] + 32768) * 65536 + (raw[o + 1] + 32768)) * 65536 + (raw[o + 2] + 32768)
      : Math.round(raw[o] * 1e4) * 1e10 + Math.round(raw[o + 1] * 1e4) * 1e5 + Math.round(raw[o + 2] * 1e4);
    let id = ids.get(key);
    if (id === undefined) { id = ids.size; ids.set(key, id); }
    vertexId[i] = id;
  }
  const triangles = region.length;
  const firstOwner = new Map<number, number>();
  const neighbors: number[][] = Array.from({ length: triangles }, () => []);
  for (let t = 0; t < triangles; t++) {
    for (let e = 0; e < 3; e++) {
      const a = vertexId[t * 3 + e];
      const b = vertexId[t * 3 + (e + 1) % 3];
      const key = Math.min(a, b) * 2097152 + Math.max(a, b);
      const other = firstOwner.get(key);
      if (other === undefined) firstOwner.set(key, t);
      else { neighbors[t].push(other); neighbors[other].push(t); }
    }
  }
  const votes = new Float32Array(6);
  for (let pass = 0; pass < 4; pass++) {
    const next = region.slice();
    for (let t = 0; t < triangles; t++) {
      votes.fill(0);
      votes[region[t]] += 1.2;
      for (const n of neighbors[t]) votes[region[n]] += 1;
      let best = region[t];
      for (let r = 0; r < 6; r++) if (votes[r] > votes[best]) best = r;
      next[t] = best;
    }
    region.set(next);
  }
}

// A ferrugem escura embaixo das portas também é lida como "pneu" e vira um serrilhado preto.
// Pneu de verdade só existe em volta das duas rodas: acha o centro de cada eixo e o raio, e o
// que for "pneu" longe das rodas volta a ser lata.
// Escuro em cima da linha da cintura do carro é vidro. Lanterna na metade da frente (lado -x
// do modelo) é pisca.
function splitDarkParts(geometry: THREE.BufferGeometry, region: Uint8Array) {
  const raw = geometry.attributes.position.array;
  const stride = geometry.attributes.position.itemSize;
  let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < raw.length; i += stride) {
    minX = Math.min(minX, raw[i]); maxX = Math.max(maxX, raw[i]);
    minY = Math.min(minY, raw[i + 1]); maxY = Math.max(maxY, raw[i + 1]);
  }
  const belt = minY + (maxY - minY) * .58;
  const middleX = (minX + maxX) / 2;
  for (let t = 0; t < region.length; t++) {
    const o = t * 3 * stride;
    const y = (raw[o + 1] + raw[o + 1 + stride] + raw[o + 1 + stride * 2]) / 3;
    const x = (raw[o] + raw[o + stride] + raw[o + stride * 2]) / 3;
    if (region[t] === REGION.tire && y > belt) region[t] = REGION.glass;
    if (region[t] === REGION.tail && x < middleX) region[t] = REGION.blinker;
  }
}

// Na textura nova o pneu é azul como a lata, então ele é achado pela forma: os pontos mais
// baixos do carro são onde os pneus tocam o chão (dois grupos, frente e trás). Em volta de cada
// eixo, um anel (sem o miolo da calota) vira pneu.
function paintTires(geometry: THREE.BufferGeometry, region: Uint8Array) {
  const raw = geometry.attributes.position.array;
  const stride = geometry.attributes.position.itemSize;
  const triangles = region.length;
  const center = new Float32Array(triangles * 3);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let t = 0; t < triangles; t++) {
    for (let k = 0; k < 3; k++) {
      const o = t * 3 * stride + k;
      const c = (raw[o] + raw[o + stride] + raw[o + stride * 2]) / 3;
      center[t * 3 + k] = c;
      min[k] = Math.min(min[k], c);
      max[k] = Math.max(max[k], c);
    }
  }
  const height = max[1] - min[1];
  const halfWidth = (max[2] - min[2]) / 2;
  const middleZ = (max[2] + min[2]) / 2;
  const middleX = (max[0] + min[0]) / 2;
  const contact: number[] = [];
  for (let t = 0; t < triangles; t++) if (center[t * 3 + 1] < min[1] + height * .015) contact.push(center[t * 3]);
  if (contact.length < 4) return;
  const front = contact.filter((x) => x < middleX);
  const back = contact.filter((x) => x >= middleX);
  if (!front.length || !back.length) return;
  const median = (list: number[]) => list.sort((a, b) => a - b)[Math.floor(list.length / 2)];
  const axles = [median(front), median(back)];
  const radius = height * .25;
  const hubY = min[1] + radius;
  for (let t = 0; t < triangles; t++) {
    const x = center[t * 3], y = center[t * 3 + 1], z = center[t * 3 + 2];
    if (Math.abs(z - middleZ) < halfWidth * .55) continue;
    const d = Math.min(Math.hypot(x - axles[0], y - hubY), Math.hypot(x - axles[1], y - hubY));
    if (d < radius * .95 && d > radius * .5) region[t] = REGION.tire;
  }
}

function keepTiresOnWheels(geometry: THREE.BufferGeometry, region: Uint8Array) {
  // Centro de cada triângulo, calculado uma vez (nas unidades cruas do modelo; só importa a proporção).
  const raw = geometry.attributes.position.array;
  const stride = geometry.attributes.position.itemSize;
  const triangles = region.length;
  const center = new Float32Array(triangles * 3);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let t = 0; t < triangles; t++) {
    for (let k = 0; k < 3; k++) {
      const o = t * 3 * stride + k;
      const c = (raw[o] + raw[o + stride] + raw[o + stride * 2]) / 3;
      center[t * 3 + k] = c;
      if (c < min[k]) min[k] = c;
      if (c > max[k]) max[k] = c;
    }
  }
  const along = max[0] - min[0] >= max[2] - min[2] ? 0 : 2;
  const length = max[along] - min[along];
  const low = min[1] + (max[1] - min[1]) * .45;
  const tires: number[] = [];
  for (let t = 0; t < triangles; t++) if (region[t] === REGION.tire && center[t * 3 + 1] < low) tires.push(t);
  if (tires.length < 20) return;
  // Duas rodas ao longo do comprimento: k-médias com 2 grupos.
  const middle = (min[along] + max[along]) / 2;
  let axles = [middle - length * .3, middle + length * .3];
  for (let step = 0; step < 8; step++) {
    const sum = [0, 0];
    const count = [0, 0];
    tires.forEach((t) => { const c = center[t * 3 + along]; const k = Math.abs(c - axles[0]) < Math.abs(c - axles[1]) ? 0 : 1; sum[k] += c; count[k]++; });
    axles = axles.map((a, k) => (count[k] ? sum[k] / count[k] : a));
  }
  let top = min[1];
  tires.forEach((t) => { top = Math.max(top, center[t * 3 + 1]); });
  const radius = (top - min[1]) / 2;
  const hubY = min[1] + radius;
  for (let t = 0; t < triangles; t++) {
    if (region[t] !== REGION.tire) continue;
    const c = center[t * 3 + along];
    const nearest = Math.min(Math.abs(c - axles[0]), Math.abs(c - axles[1]));
    if (Math.hypot(nearest, center[t * 3 + 1] - hubY) > radius * 1.15) region[t] = REGION.paint;
  }
}

// Peças do Jota na textura do Meshy: 0 calça e sapato (quase preto), 1 camisa e cabelo
// (azul-marinho), 2 pele (azul-claro), 3 pano (cinza claro).
const FIGURE = { dark: 0, shirt: 1, skin: 2, cloth: 3 };
function figureRegionOfPixel(r: number, g: number, b: number) {
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  const saturation = high > .001 ? (high - low) / high : 0;
  const luminance = .2126 * r + .7152 * g + .0722 * b;
  if (saturation > .35 && b > r * 1.4) return luminance > .25 ? FIGURE.skin : FIGURE.shirt;
  if (saturation < .2 && luminance > .12) return FIGURE.cloth;
  return FIGURE.dark;
}

// Pintura do Jota: duas faixas por peça (luz e sombra, mesma luz do carro) e o fio rosa do céu.
// Na pele, a textura do Meshy dá duas coisas: os traços escuros finos (olhos, sobrancelha, barba)
// e, lida borrada, uma mancha de sombra em volta dos olhos, como o Jota da cena 1: os olhos
// ficam escondidos na sombra das sobrancelhas, sem pupila nem brilho.
function createFigureMaterial(map: THREE.Texture | null) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uSocket: { value: new THREE.Color("#0c1250") },
      uEyes: { value: [new THREE.Vector3(0, -1e4, 0), new THREE.Vector3(0, -1e4, 0)] },
      uEyeRadius: { value: 0 },
      uFaceY: { value: 1e4 },
      uLampPos: { value: new THREE.Vector3(0, 1e4, 0) },
      // Cabeça sob o poste: 4 tons de azul, do plano que pega a luz até a sombra funda.
      // [0] sombra funda, [1] sombra, [2] meio, [3] luz (azul claro puxado para o amarelo).
      uHair: { value: [new THREE.Color("#050828"), new THREE.Color("#0d1450"), new THREE.Color("#2b3ca6"), new THREE.Color("#a4a9dc")] },
      uHead: { value: [new THREE.Color("#070b34"), new THREE.Color("#121a5c"), new THREE.Color("#3346b4"), new THREE.Color("#b9b9dc")] },
      uBeard: { value: new THREE.Color("#0c1250") },
      uInk: { value: new THREE.Color("#03041a") },
      uLight: { value: new THREE.Vector3(-.35, .85, .4).normalize() },
      uShade: { value: [new THREE.Color("#03041a"), new THREE.Color("#070b30"), new THREE.Color("#1d2a92"), new THREE.Color("#6d7cc9")] },
      uLit: { value: [new THREE.Color("#0b1040"), new THREE.Color("#121a5c"), new THREE.Color("#3f58cf"), new THREE.Color("#d9e0fb")] },
      uRim: { value: new THREE.Color("#ff4f86") },
    },
    vertexShader: /* glsl */ `
      attribute float aRegion;
      varying float vRegion;
      varying vec2 vUv;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vRegion = aRegion;
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uSocket, uInk;
      uniform vec3 uEyes[2];
      uniform float uEyeRadius, uFaceY;
      uniform vec3 uLampPos, uBeard;
      uniform vec3 uHair[4];
      uniform vec3 uHead[4];
      varying vec2 vUv;
      varying vec3 vWorld;
      uniform vec3 uLight, uRim;
      uniform vec3 uShade[4];
      uniform vec3 uLit[4];
      varying float vRegion;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec3 n = normalize(vNormal);
        if (!gl_FrontFacing) n = -n;
        vec3 v = normalize(vView);
        int r = int(floor(vRegion + .5));
        vec3 shade = uShade[0], lit = uLit[0];
        if (r == 1) { shade = uShade[1]; lit = uLit[1]; }
        else if (r == 2) { shade = uShade[2]; lit = uLit[2]; }
        else if (r == 3) { shade = uShade[3]; lit = uLit[3]; }
        vec3 color = dot(n, uLight) > .15 ? lit : shade;
        // Olhos: uma sombra chapada em volta de cada um esconde o olho inteiro (pele, branco do
        // olho e óculos), como no Jota da cena 1. Na pele fora dela, só os traços bem escuros da
        // textura (sobrancelha, barba, contorno do nariz).
        float socket = step(min(distance(vWorld, uEyes[0]), distance(vWorld, uEyes[1])), uEyeRadius);
        float edge = 1.0 - max(dot(n, v), 0.0);
        if (vWorld.y > uFaceY && r != 3) {
          // Cabeça (acima do queixo): só a luz dura do poste, alto e um pouco à frente dele, como
          // no rascunho do Deiver. Poucos planos chapados: o topo dos cachos, a testa, a ponte do
          // nariz e o alto das maçãs pegam luz; olhos, bigode, barba e queixo ficam na sombra.
          vec3 lamp = normalize(uLampPos - vWorld);
          float d = dot(n, lamp);
          int band = d > .62 ? 3 : (d > .42 ? 2 : (d > 0. ? 1 : 0));
          // Olhos: dentro da órbita a luz não entra (no máximo o tom de sombra, como o resto do
          // rosto que não pega luz), sem uma mancha de cor própria.
          if (socket > .5) band = min(band, 1);
          vec3 tones[4];
          if (r == 2) { tones[0] = uHead[0]; tones[1] = uHead[1]; tones[2] = uHead[2]; tones[3] = uHead[3]; }
          else { tones[0] = uHair[0]; tones[1] = uHair[1]; tones[2] = uHair[2]; tones[3] = uHair[3]; }
          color = band == 3 ? tones[3] : (band == 2 ? tones[2] : (band == 1 ? tones[1] : tones[0]));
          if (r == 2) {
            // Barba e bigode (traços escuros da textura): azul-marinho, não preto; a luz só pega o
            // que estiver bem de frente para o poste.
            float sharp = dot(texture2D(uMap, vUv).rgb, vec3(.2126, .7152, .0722));
            color = mix(color, band == 3 ? tones[2] : uBeard, step(sharp, .07));
          }
          // Fio rosa fino só no lado oposto ao poste.
          color = mix(color, uRim, smoothstep(.78, .9, edge) * step(dot(n, lamp), -.15) * .9);
        } else {
          if (r == 2) {
            float sharp = dot(texture2D(uMap, vUv).rgb, vec3(.2126, .7152, .0722));
            color = mix(color, uInk, step(sharp, .07) * (1.0 - socket));
          }
          color = mix(color, uSocket, socket);
          color = mix(color, uRim, smoothstep(.62, .82, edge) * step(.0, n.y - n.x * .3) * .85);
        }
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

// Amigos do Jota: quase pretos, com o fio rosa do céu nas bordas que olham para cima e um
// azul-marinho bem escuro onde a luz da rua bate (para o volume não sumir de vez).
function createSilhouetteMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDark: { value: new THREE.Color("#04051a") },
      uLit: { value: new THREE.Color("#0b0f3c") },
      uLight: { value: new THREE.Vector3(-.35, .85, .4).normalize() },
      uRim: { value: new THREE.Color("#ff4f86") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDark, uLit, uLight, uRim;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec3 n = normalize(vNormal);
        if (!gl_FrontFacing) n = -n;
        vec3 color = dot(n, uLight) > .35 ? uLit : uDark;
        float edge = 1.0 - max(dot(n, normalize(vView)), 0.0);
        color = mix(color, uRim, smoothstep(.6, .8, edge) * step(.0, n.y - n.x * .3) * .9);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

function createCarMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
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
      uLamp: { value: new THREE.Color(NIGHT.warm) },
    },
    vertexShader: /* glsl */ `
      attribute float aRegion;
      varying float vRegion;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vLocal;
      void main() {
        vRegion = aRegion;
        vLocal = position;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLight, uDeep, uMid, uLit, uShine, uChromeDark, uChromeLit, uGlass, uGlassLit, uGlint, uTire, uTail, uRim, uLamp;
      varying float vRegion;
      varying vec3 vLocal;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec3 n = normalize(vNormal);
        if (!gl_FrontFacing) n = -n;
        vec3 v = normalize(vView);
        float diffuse = dot(n, uLight);
        float spec = pow(max(dot(reflect(-uLight, n), v), 0.0), 18.0);
        float edge = 1.0 - max(dot(n, v), 0.0);
        // Peça deste triângulo (veja carRegions): 0 lata, 1 cromado, 2 vidro, 3 pneu, 4 lanterna,
        // 5 pisca, 6 lente do farol (acesa, sem sombra nem fio rosa), 7 aro da roda.
        float r = floor(vRegion + .5);
        if (r > 6.5) {
          // Aro: a cor do carro, chapada, sem brilho (o brilho virava uma estrela na calota).
          gl_FragColor = vec4(dot(normalize(vNormal), uLight) < -.05 ? uDeep : uMid, 1.0);
          #include <colorspace_fragment>
          return;
        }
        if (r > 5.5) {
          gl_FragColor = vec4(uLamp, 1.0);
          #include <colorspace_fragment>
          return;
        }
        bool paint = r < .5;
        bool chrome = abs(r - 1.0) < .5;
        bool tail = abs(r - 4.0) < .5;
        bool blinker = abs(r - 5.0) < .5;
        vec3 color;
        if (paint) {
          // Faixas chapadas: sombra, meio, luz e o brilho lavanda nas curvas viradas para cima.
          color = diffuse < -.05 ? uDeep : diffuse < .35 ? uMid : uLit;
          color = mix(color, uShine, step(.55, spec) * .9);
        } else if (blinker) {
          color = uGlint;
        } else if (tail) {
          color = uTail;
        } else if (chrome) {
          // Cromado (referência do Deiver, 13/10): quase todo claro, azul só no lado de baixo.
          color = diffuse < -.25 ? uChromeDark : uChromeLit;
        } else if (abs(r - 2.0) < .5) {
          // Vidro: um azul só, com dois riscos diagonais de reflexo (como na referência),
          // presos ao carro para não "nadarem" quando a câmera anda.
          color = uGlass;
          float s = fract((vLocal.x * .8 - vLocal.y * 1.4) * 2.2);
          color = mix(color, uGlassLit, (step(.08, s) - step(.2, s)) + (step(.28, s) - step(.31, s)));
        } else {
          color = uTire;
        }
        // Fio rosa do céu nas bordas viradas para cima/para a esquerda.
        color = mix(color, uRim, smoothstep(.72, .9, edge) * step(.05, n.y - n.x * .3) * .8);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}
