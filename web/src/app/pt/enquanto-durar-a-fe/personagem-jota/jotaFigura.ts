import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { createCelMaterial } from "../animatic-material/celShading";
import { createJotaWatchFace, JOTA_BANDS, JOTA_MODEL_URL, JOTA_PARTS, loadJotaRegions, type JotaPart } from "./jotaBands";

// O Jota 3D pronto para entrar numa cena: modelo do Meshy em cel limpo, contorno, rosto
// 2D e caixa do relógio. Tudo em metros, com os pés em y 0, centralizado e com 1,83 m;
// quem usa escala o grupo para as unidades da cena (ex.: group.scale.setScalar(METER)).

const HEIGHT = 1.83;

// Rosto 2D desenhado pelo Deiver (olhos, sobrancelhas, boca), colado na cabeça 3D como
// um adesivo projetado de frente. x e y: centro do desenho em metros, visto de frente
// ("esquerdo" é o lado esquerdo de quem olha). width: largura em metros; a altura segue
// a proporção do desenho. Os arquivos vêm de tools/jota_rosto.py.
const FACE_URL = "/enquanto-durar-a-fe/jota-rosto/";
const FACE_PARTS = [
  { file: "olho-esquerdo.png", x: -.083, y: 1.632, width: .044 },
  { file: "olho-direito.png", x: -.0115, y: 1.632, width: .044 },
  { file: "boca.png", x: -.05, y: 1.552, width: .046 },
  { file: "sobrancelha-esquerda.png", x: -.08, y: 1.657, width: .052 },
  { file: "sobrancelha-direita.png", x: -.015, y: 1.657, width: .038 },
];

// Rosto pintado (Deiver, 12/10/2026): luz e sombra do rosto vêm de uma pintura feita sobre o
// molde frontal (2000 × 2400 px), não da luz 3D. A pintura é colada de frente só sobre a pele,
// numa caixa que cobre a cabeça (x/y: centro em metros; width/height: tamanho), e já traz
// sobrancelhas, boca e as órbitas na sombra, então os desenhos 2D do rosto ficam escondidos.
// Cabelo, corpo e roupa continuam com a luz 3D.
const PAINTED_FACE = { file: "rosto-pintado.webp?v=3", x: -.047, y: 1.6, width: .3, height: .36 };
const PAINTED_FACE_KEEPS: string[] = [];
// Com o rosto pintado, a pele 3D que a pintura não alcança (sob a franja, atrás da orelha,
// no "V" da gola, mãos) usa tons escuros tirados da própria pintura, em vez do ciano.
const PAINTED_SKIN_FALLBACK = { lit: "#505f72", mid: "#424e61", shade: "#2c3548", rimAmount: 0 };

// paintedFace: usa o rosto pintado no lugar dos olhos e da boca desenhados.
export function loadJotaFigure({ outline, anisotropy = 1, paintedFace = false }: { outline: THREE.Material; anisotropy?: number; paintedFace?: boolean }) {
  const faceParts = [
    ...(paintedFace ? [{ ...PAINTED_FACE, painted: true }] : []),
    ...FACE_PARTS.filter((part) => !paintedFace || PAINTED_FACE_KEEPS.includes(part.file)).map((part) => ({ ...part, painted: false })),
  ];
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];
  let disposed = false;

  const ready = Promise.all([
    new GLTFLoader().loadAsync(JOTA_MODEL_URL),
    loadJotaRegions(),
    Promise.all(faceParts.map((part) => new THREE.TextureLoader().loadAsync(FACE_URL + part.file))),
  ]).then(([gltf, regions, faces]) => {
    textures.push(regions, ...faces);
    if (disposed) { textures.forEach((texture) => texture.dispose()); return; }
    const model = gltf.scene;
    let skin: THREE.Mesh | undefined;
    // Junta as malhas antes: o contorno entra como filho de cada uma.
    const meshes: THREE.Mesh[] = [];
    model.traverse((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
    meshes.forEach((child) => {
      const original = child.material as THREE.MeshStandardMaterial;
      const part = original.name as JotaPart;
      const band = paintedFace && part === "skin" ? { ...JOTA_BANDS.skin, ...PAINTED_SKIN_FALLBACK } : JOTA_BANDS[part] ?? JOTA_BANDS.shirt;
      if (part === "skin") skin = child;
      const id = JOTA_PARTS.indexOf(part);
      const region = id >= 0 ? { map: regions, id } : undefined;
      // O traço da textura só entra na pele (olhos, barba) e na camisa (colarinho, alça).
      const ink = original.map && (part === "skin" || part === "shirt")
        ? { map: original.map, median: (original.userData.inkMedian as number | undefined) ?? .5, cut: part === "skin" ? .3 : 0 }
        : undefined;
      if (ink) textures.push(ink.map);
      child.material = createCelMaterial({ ...band, ink, region, clean: true, cleanTones: part === "skin" ? 3 : 2 });
      original.dispose();
      child.add(new THREE.Mesh(child.geometry, outline));
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Pés no chão, centralizado e com 1,83 m.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = HEIGHT / size.y;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    // Ainda fora do grupo: os adesivos saem nas coordenadas do próprio Jota.
    model.updateMatrixWorld(true);

    const watchFace = createJotaWatchFace(createCelMaterial({ ...JOTA_BANDS.watch, clean: true, cleanTones: 2 }));
    watchFace.add(new THREE.Mesh(watchFace.geometry, outline));
    watchFace.castShadow = true;
    watchFace.receiveShadow = true;
    group.add(model, watchFace);

    if (!skin) return;
    faceParts.forEach((facePart, index) => {
      const paint = faces[index];
      paint.colorSpace = THREE.SRGBColorSpace;
      paint.anisotropy = anisotropy;
      const aspect = paint.image.height / paint.image.width;
      // A caixa de projeção vai do nariz até o fundo dos olhos. A do rosto pintado é mais
      // funda, para pegar também as bochechas e as orelhas (só a metade da frente da cabeça).
      const decalSize = new THREE.Vector3(facePart.width, facePart.width * aspect, facePart.painted ? .2 : .1);
      const position = new THREE.Vector3(facePart.x, facePart.y, facePart.painted ? .02 : .07);
      const material = createCelMaterial({ ...JOTA_BANDS.skin, paint, clean: true, cleanTones: 3 });
      // Puxa o adesivo para a frente da pele; as sobrancelhas (por último) ficam por cima.
      material.polygonOffset = true;
      material.polygonOffsetFactor = -2;
      material.polygonOffsetUnits = -2 - index * 2;
      const decal = new THREE.Mesh(new DecalGeometry(skin!, position, new THREE.Euler(), decalSize), material);
      decal.receiveShadow = true;
      decal.renderOrder = 1 + index;
      group.add(decal);
    });
  });

  const dispose = () => {
    disposed = true;
    group.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry.dispose();
      if (child.material !== outline) (child.material as THREE.Material).dispose();
    });
    textures.forEach((texture) => texture.dispose());
  };

  return { group, ready, dispose };
}
