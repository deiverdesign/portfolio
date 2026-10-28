import * as THREE from "three";
import { CITY, type Lamp } from "./opalaCidade";

// CHUVA PARADA da cena 3 (Deiver, 13/10: "tipo Homem-Aranha", "estática, não animada").
// Como no Aranhaverso, a chuva é feita de riscos finos e retos, não de gotas, e pega a cor
// da luz que está perto: amarela embaixo dos postes, rosa no fundo (perto do céu) e um
// azul-lavanda claro no resto. Os riscos ficam congelados no ar, no espaço da rua: quando a
// câmera anda, eles andam junto com o cenário (paralaxe), mas nunca caem.
// Cada risco tem a ponta de cima transparente e a de baixo mais forte, como um rastro.

const RAIN = {
  count: 2600,
  // Caixa onde a chuva existe, em metros. nearZ deixa ~1 m livre na frente da lente final
  // (a câmera para em z = 5,6), para nenhum risco passar colado no rosto.
  minX: -CITY.wallX,
  maxX: CITY.wallX,
  minY: 0,
  maxY: 13,
  nearZ: 4.6,
  farZ: -45,
  // Comprimento dos riscos e o vento (inclinação leve para a direita, sempre igual).
  minLength: .35,
  maxLength: 1.1,
  // .21 = a inclinação da gota do Deiver no Figma (86,5 de largura para 412 de altura).
  wind: .21,
  // Raio, em metros, da luz amarela em volta de cada poste (no chão, abaixo da lâmpada).
  lampRadius: 3.2,
};

// Gotas de perto: entre ~1 m da lente final (z 5,6) e o carro, por toda a largura da rua
// que a câmera atravessa. Largura em metros (1 cm ≈ 10 px a 1 m da lente).
const NEAR = {
  count: 300,
  minX: -8,
  maxX: 4,
  minY: 0,
  maxY: 4,
  nearZ: 4.7,
  farZ: 0,
  minLength: .63,
  maxLength: 1.47,
  // Largura = ~1% do comprimento, como no Figma (traço de ~4 px numa gota de 412 px).
  widthRatio: .01,
};

const COLORS = {
  base: new THREE.Color("#c3cbff"),
  pink: new THREE.Color("#ff8cbc"),
  lamp: new THREE.Color("#ffe08a"),
};

// Sorteio sempre igual (a chuva sai idêntica a cada visita), em vez de Math.random.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function buildRain(lamps: Lamp[]) {
  const random = seeded(13);
  // Dois grupos: a chuva de sempre e a que está sob a luz dos postes. A segunda acende
  // junto com os postes (depois do wipe), como a luz amarela do chão.
  const plain: number[][] = [[], []];
  const lit: number[][] = [[], []];
  const fall = new THREE.Vector3(RAIN.wind, -1, 0).normalize();
  const color = new THREE.Color();
  for (let i = 0; i < RAIN.count; i++) {
    // Mais riscos perto da câmera do que longe: no fundo eles se somam e viram névoa.
    const depth = Math.pow(random(), 1.6);
    const z = THREE.MathUtils.lerp(RAIN.nearZ, RAIN.farZ, depth);
    const x = THREE.MathUtils.lerp(RAIN.minX, RAIN.maxX, random());
    const y = THREE.MathUtils.lerp(RAIN.minY, RAIN.maxY, random());
    const length = THREE.MathUtils.lerp(RAIN.minLength, RAIN.maxLength, random());
    // Mais fraco no fundo, e cada risco com uma força diferente.
    const alpha = THREE.MathUtils.lerp(.95, .3, depth) * THREE.MathUtils.lerp(.5, 1, random());

    // Luz do poste mais perto: só embaixo da lâmpada, mais forte perto dela.
    let lampLight = 0;
    lamps.forEach(({ head }) => {
      if (y > head.y) return;
      const across = Math.hypot(x - head.x, z - head.z);
      lampLight = Math.max(lampLight, 1 - THREE.MathUtils.smoothstep(across, RAIN.lampRadius * .3, RAIN.lampRadius));
    });
    // Rosa do céu: cresce com a distância e com a altura.
    const pink = THREE.MathUtils.smoothstep(depth, .35, .95) * THREE.MathUtils.lerp(.6, 1, y / RAIN.maxY);
    color.copy(COLORS.base).lerp(COLORS.pink, pink);

    const top = [x, y, z];
    const bottom = [x + fall.x * length, y + fall.y * length, z];
    const target = lampLight > .05 ? lit : plain;
    if (lampLight > .05) color.lerp(COLORS.lamp, lampLight);
    target[0].push(...top, ...bottom);
    target[1].push(color.r, color.g, color.b, 0, color.r, color.g, color.b, alpha * (lampLight > .05 ? 1.4 : 1));
  }

  const group = new THREE.Group();
  const materials: THREE.LineBasicMaterial[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const make = ([positions, colors]: number[][]) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    // Cor com 4 números (RGBA): o three usa o quarto como transparência de cada ponta.
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
    const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
    const lines = new THREE.LineSegments(geometry, material);
    // Desenhada antes dos bilhetes (renderOrder 7): o bilhete fica sempre por cima da chuva.
    lines.renderOrder = 3;
    lines.frustumCulled = false;
    group.add(lines);
    materials.push(material);
    geometries.push(geometry);
    return material;
  };
  make(plain);
  const litMaterial = make(lit);

  // GOTAS DE PERTO (Deiver, 13/10, ref. Aranhaverso 2099): na frente, entre a câmera e o
  // carro, riscos maiores e mais grossos com um degradê de transparente (em cima) para pink
  // (embaixo). São fitas finas de verdade (não linhas de 1 px), viradas para a câmera.
  // As de trás continuam como estão. O pink é a luz do céu: acende com os postes.
  const nearPositions: number[] = [];
  const nearAlong: number[] = [];
  const side = new THREE.Vector3(-fall.y, fall.x, 0);
  for (let i = 0; i < NEAR.count; i++) {
    const z = THREE.MathUtils.lerp(NEAR.nearZ, NEAR.farZ, Math.pow(random(), .8));
    const x = THREE.MathUtils.lerp(NEAR.minX, NEAR.maxX, random());
    const y = THREE.MathUtils.lerp(NEAR.minY, NEAR.maxY, random());
    const length = THREE.MathUtils.lerp(NEAR.minLength, NEAR.maxLength, random());
    // A fita é 3x mais larga que o traço: a sobra vira o desfoque suave das bordas.
    const half = length * NEAR.widthRatio * 1.5;
    const bx = x + fall.x * length;
    const by = y + fall.y * length;
    // Dois triângulos: topo (along 0) e base (along 1).
    // along = 0 no topo e 1 na base; across = -1 e 1 nas bordas (para o desfoque das laterais).
    const corners = [
      [x - side.x * half, y - side.y * half, 0, -1], [x + side.x * half, y + side.y * half, 0, 1],
      [bx + side.x * half, by + side.y * half, 1, 1], [bx - side.x * half, by - side.y * half, 1, -1],
    ];
    [0, 1, 2, 0, 2, 3].forEach((corner) => {
      const [cx, cy, along, across] = corners[corner];
      nearPositions.push(cx, cy, z);
      nearAlong.push(along, across);
    });
  }
  const nearGeometry = new THREE.BufferGeometry();
  nearGeometry.setAttribute("position", new THREE.Float32BufferAttribute(nearPositions, 3));
  nearGeometry.setAttribute("along", new THREE.Float32BufferAttribute(nearAlong, 2));
  const nearMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uOpacity: { value: 1 } },
    vertexShader: `
      attribute vec2 along;
      varying vec2 vAlong;
      void main() {
        vAlong = along;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec2 vAlong;
      // Degradê do Figma do Deiver (Vector 469), de cima (0) para baixo (1):
      // 0% branco 0 · 38% branco 30% · 57% #F671B1 64% · 96% #FF007B 78% · 100% #FF91C6 80%,
      // com a camada a 80% e um leve desfoque (aqui, as bordas laterais suaves).
      vec4 stop(vec4 a, vec4 b, float from, float to, float t) {
        return mix(a, b, clamp((t - from) / (to - from), 0.0, 1.0));
      }
      void main() {
        float t = vAlong.x;
        vec4 color = stop(vec4(1.0, 1.0, 1.0, 0.0), vec4(1.0, 1.0, 1.0, .30), 0.0, .38, t);
        color = stop(color, vec4(.965, .443, .694, .64), .38, .57, t);
        color = stop(color, vec4(1.0, 0.0, .482, .78), .57, .96, t);
        color = stop(color, vec4(1.0, .569, .776, .80), .96, 1.0, t);
        // Desfoque em cada gota: o miolo (1/3 da fita) é cheio e as bordas somem suaves;
        // as pontas também se apagam um pouco.
        float edge = exp(-pow(abs(vAlong.y) * 2.4, 2.0));
        edge *= smoothstep(1.0, .97, t);
        gl_FragColor = vec4(color.rgb, color.a * .8 * edge * uOpacity);
      }
    `,
  });
  const nearDrops = new THREE.Mesh(nearGeometry, nearMaterial);
  nearDrops.renderOrder = 3;
  nearDrops.frustumCulled = false;
  group.add(nearDrops);
  geometries.push(nearGeometry);

  return {
    group,
    // 0 a 1, junto com os postes.
    setLights: (amount: number) => {
      litMaterial.opacity = amount;
      nearMaterial.uniforms.uOpacity.value = amount;
    },
    dispose: () => {
      nearMaterial.dispose();
      materials.forEach((material) => material.dispose());
      geometries.forEach((geometry) => geometry.dispose());
    },
  };
}
