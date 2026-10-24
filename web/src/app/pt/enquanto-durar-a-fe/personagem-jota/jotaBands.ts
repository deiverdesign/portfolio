import * as THREE from "three";
import { PALETTE, type Bands, type Strap } from "../animatic-material/celShading";

// Faixas de cor de cada parte do Jota na luz do Portão. Usadas pelos bonecos de teste
// (personagem-jota) e pelo modelo 3D (jota-3d).
// Azul-noite das linhas e da sombra mais funda, e o amarelo-limão da luz de contorno.
export const JOTA_INK = "#061830";
export const JOTA_RIM = "#ccd84e";

// Alça e fivela da bolsa, como no 2D (09/10/2026): couro azul-marinho quase preto, fivela
// azul-clara e traço azul-noite na borda. São desenhadas por cima da camisa, pela textura.
export const JOTA_STRAP: Strap = { lit: "#173a66", shade: "#0c1f40", buckle: "#3f7fb8", line: JOTA_INK };

export type JotaPart = "skin" | "shirt" | "trousers" | "shoes" | "hair" | "bag" | "watch";

export const JOTA_BANDS: Record<JotaPart, Bands> = {
  // Pele em três tons tirados do rosto simplificado do Deiver (09/10/2026): azul na luz,
  // verde-água na passagem para a sombra, azul escuro na sombra, e luz de contorno
  // amarelo-limão.
  skin: { lit: "#4eaed8", mid: "#6cd8ae", shade: "#2a669c", deep: JOTA_INK, rim: JOTA_RIM, rimAmount: .3 },
  // Camisa branca: amarela na luz, azul-clara e azul-marinho na sombra.
  shirt: { lit: "#f4f1a6", mid: PALETTE.pale, shade: "#7f8fc8", deep: PALETTE.navy, rim: PALETTE.orange, rimAmount: .18, strap: JOTA_STRAP },
  // Calça e sapato só em azuis escuros, com a mesma luz de contorno (Deiver, 09/10/2026).
  trousers: { lit: "#1d3d73", mid: "#16305e", shade: "#0d2147", deep: JOTA_INK, rim: JOTA_RIM, rimAmount: .2 },
  shoes: { lit: "#16305e", mid: "#0d2147", shade: JOTA_INK, deep: JOTA_INK, rim: JOTA_RIM, rimAmount: .2 },
  // Cabelo quase chapado no azul-noite das linhas, com o mesmo contorno amarelo-limão.
  hair: { lit: "#10234a", mid: JOTA_INK, shade: JOTA_INK, deep: JOTA_INK, rim: JOTA_RIM, rimAmount: .16 },
  // Bolsa no mesmo couro azul-marinho da alça.
  bag: { lit: "#173a66", mid: "#112c52", shade: "#0c1f40", deep: JOTA_INK, rim: JOTA_RIM, rimAmount: .2 },
  // Relógio como no 2D: azul-marinho chapado, igual à bolsa (o mostrador da textura do
  // Meshy saía manchado).
  watch: { lit: "#173a66", mid: "#112c52", shade: "#0c1f40", deep: JOTA_INK, rim: JOTA_RIM, rimAmount: .2 },
};

// Modelo do Meshy com textura, separado em regiões. Cada região usa as faixas acima e da
// textura sai só o traço: olhos, barba, colarinho, costuras.
// O "?v=" muda a cada versão do arquivo, para o navegador não usar a cópia antiga.
export const JOTA_MODEL_URL = "/enquanto-durar-a-fe/jota-meshy-textura-web.glb?v=10";

// Mesma ordem de tools/build_jota.py: o número de cada parte no mapa de regiões.
export const JOTA_PARTS: JotaPart[] = ["skin", "shirt", "trousers", "hair", "shoes", "bag", "watch"];
// Mapa de regiões, pixel a pixel na textura do modelo acima (gerado junto com ele).
export const JOTA_REGION_URL = "/enquanto-durar-a-fe/jota-regioes.png?v=9";

// Caixa do relógio: um cilindro achatado azul-marinho por cima do pulso, no lugar da caixa
// do Meshy, que saía com pele por cima (Deiver, 09/10/2026). Medida no arquivo ?v=9 com
// tools/relogio_pos.py, em metros, com o Jota já em 1,83 m, pés no chão e centralizado.
// Se o modelo mudar, medir de novo.
export const JOTA_WATCH_FACE = {
  center: new THREE.Vector3(.1605, .9031, -.0047),
  // Para onde a caixa aponta, saindo do pulso.
  normal: new THREE.Vector3(.8572, -.0765, .5093).normalize(),
  // Distância do centro do pulso até o meio do cilindro.
  lift: .025,
  radius: .018,
  depth: .008,
};

export function createJotaWatchFace(material: THREE.Material) {
  const { center, normal, lift, radius, depth } = JOTA_WATCH_FACE;
  const face = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 32), material);
  face.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  face.position.copy(center).addScaledVector(normal, lift);
  return face;
}

export function loadJotaRegions() {
  return new THREE.TextureLoader().loadAsync(JOTA_REGION_URL).then((map) => {
    // Números, não cores: sem mistura entre pixels vizinhos e na orientação do glTF.
    map.flipY = false;
    map.colorSpace = THREE.NoColorSpace;
    map.magFilter = THREE.NearestFilter;
    map.minFilter = THREE.NearestFilter;
    map.generateMipmaps = false;
    map.needsUpdate = true;
    return map;
  });
}
