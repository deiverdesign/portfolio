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
  wind: .14,
  // Raio, em metros, da luz amarela em volta de cada poste (no chão, abaixo da lâmpada).
  lampRadius: 3.2,
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

  return {
    group,
    // 0 a 1, junto com os postes.
    setLights: (amount: number) => { litMaterial.opacity = amount; },
    dispose: () => {
      materials.forEach((material) => material.dispose());
      geometries.forEach((geometry) => geometry.dispose());
    },
  };
}
