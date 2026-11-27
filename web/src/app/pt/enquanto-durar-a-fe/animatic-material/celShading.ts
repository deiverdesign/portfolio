import * as THREE from "three";

// Peças compartilhadas pelas páginas de material (POC 3) e de personagem:
// escala, paleta, luz fixa e o material cel shading de 4 faixas.

// Escala: o Jota tem 3.71 unidades do chão ao topo da cabeça e mede 1,83 m.
// Ex.: 1,90 m × METER ≈ 3.85 unidades.
// Sombra só do sol (luz direcional). O getShadowMask() do three.js multiplica TODAS as sombras,
// inclusive a da lâmpada da cozinha: as paredes da cozinha tapavam a lâmpada e escureciam o
// começo da rua inteiro (a "sombra enorme" que o Deiver viu depois da cena 2).
const SUN_SHADOW_GLSL = /* glsl */ `
  float getSunShadowMask() {
    float shadow = 1.0;
    #if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
      DirectionalLightShadow directionalLight;
      #pragma unroll_loop_start
      for (int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i++) {
        directionalLight = directionalLightShadows[i];
        shadow *= receiveShadow ? getShadow(directionalShadowMap[i], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[i]) : 1.0;
      }
      #pragma unroll_loop_end
    #endif
    return shadow;
  }
`;

export const JOTA_HEIGHT_UNITS = 3.71;
export const METER = JOTA_HEIGHT_UNITS / 1.83;
export const m = (meters: number) => meters * METER;

// Luz fixa, baixa, vindo da direita e um pouco de trás da câmera, como na Frame 547:
// as fachadas viradas para a direita acendem em amarelo; a rua fica em cobalto.
export const LIGHT_DIRECTION = new THREE.Vector3(0.8, 0.38, 0.3).normalize();

// Paleta tirada da Frame 547. Cada material escolhe 4 faixas dela:
// lit (luz direta) → mid → shade → deep (sombra projetada ou face de costas).
export const PALETTE = {
  yellow: "#f1ee3c",
  yellowGreen: "#cfe24a",
  pale: "#c3cde6",
  cobaltLight: "#4157c9",
  cobalt: "#2f3fae",
  cobaltDark: "#24308f",
  navy: "#1a1f6e",
  ink: "#0e1042",
  violet: "#5b2f86",
  maroon: "#6e2c6a",
  leafEdge: "#6f8cff",
  orange: "#ff9b3d",
  teal: "#1f6f86",
  tealGreen: "#2e8c74",
};

// ink: textura de onde sai só o traço (o que é mais escuro que a mediana da região).
// cut: abaixo desse valor (0–1) a textura vira a cor mais funda da faixa (barba, bigode).
export type Ink = { map: THREE.Texture; median: number; strength?: number; cut?: number };
// clean: poucas cores e bordas retas, sem tremido. Para personagens. cleanTones: 2 (luz e
// sombra) ou 3 (luz, meio-tom e sombra, usado no rosto).
// strap: alça e fivela desenhadas pixel a pixel pela textura do ink (escuro = alça,
// cinza-azulado = fivela), com traço fino na borda. Só funciona junto com ink.
export type Strap = { lit: string; shade: string; buckle: string; line: string; cut?: number };
// region: mapa de regiões na textura (um número por pixel). O material só desenha os pixels
// cujo número é o seu id; nas bordas entre partes, a borda segue o desenho da textura.
export type Region = { map: THREE.Texture; id: number };
// paint: desenho 2D colado no modelo (olhos, boca). Na textura, alfa 1 = cor do desenho,
// alfa ~0,5 = pele (a cor vem da luz do 3D), alfa 0 = vazio.
export type Bands = { lit: string; mid: string; shade: string; deep: string; rim?: string; rimAmount?: number; nearFade?: boolean; ink?: Ink; strap?: Strap; region?: Region; paint?: THREE.Texture; clean?: boolean; cleanTones?: 2 | 3 };

const celVertexShader = /* glsl */ `
  #include <common>
  #include <shadowmap_pars_vertex>
  varying vec3 vNormalWorld;
  varying vec3 vWorldPosition;
  #if defined(USE_INK) || defined(USE_PAINT) || defined(USE_REGION)
    varying vec2 vTexUv;
  #endif

  void main() {
    #if defined(USE_INK) || defined(USE_PAINT) || defined(USE_REGION)
      vTexUv = uv;
    #endif
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <begin_vertex>
    #include <project_vertex>
    #include <worldpos_vertex>
    #include <shadowmap_vertex>
    vNormalWorld = normalize(mat3(modelMatrix) * objectNormal);
    vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
  }
`;

const celFragmentShader = /* glsl */ `
  #include <common>
  #include <packing>
  #include <bsdfs>
  #include <lights_pars_begin>
  #include <shadowmap_pars_fragment>
  #include <shadowmask_pars_fragment>
  ${SUN_SHADOW_GLSL}

  uniform vec3 uLit;
  uniform vec3 uMid;
  uniform vec3 uShade;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform float uRimAmount;
  uniform vec3 uLightDirection;
  uniform float uGrain;
  uniform float uNearFade;
  uniform float uClean;
  uniform float uCleanTones;
  varying vec3 vNormalWorld;
  varying vec3 vWorldPosition;
  #ifdef USE_INK
    uniform sampler2D uInk;
    uniform float uInkMedian;
    uniform float uInkStrength;
    uniform float uInkCut;
  #endif
  #ifdef USE_STRAP
    uniform vec3 uStrapLit;
    uniform vec3 uStrapShade;
    uniform vec3 uBuckle;
    uniform vec3 uStrapLine;
    uniform float uStrapCut;
  #endif
  #ifdef USE_PAINT
    uniform sampler2D uPaint;
  #endif
  #ifdef USE_REGION
    uniform sampler2D uRegion;
    uniform float uRegionId;
  #endif
  #if defined(USE_INK) || defined(USE_PAINT) || defined(USE_REGION)
    varying vec2 vTexUv;
  #endif

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    #ifdef USE_REGION
      float regionId = floor(texture2D(uRegion, vTexUv).r * 255.0 + 0.5);
      if (regionId < 254.5 && abs(regionId - uRegionId) > 0.5) discard;
    #endif
    vec3 normal = normalize(vNormalWorld);
    if (!gl_FrontFacing) normal = -normal;
    float facing = dot(normal, uLightDirection);
    float shadow = getSunShadowMask();
    float light = facing * shadow;

    // Ruído preso ao mundo: as fronteiras entre faixas tremem como tinta de impressão
    // e não "escorregam" quando a câmera anda.
    float edge = (valueNoise(vWorldPosition.xz * 2.3 + vWorldPosition.y * 1.7) - 0.5) * 0.08 * (1.0 - uClean);

    vec3 color;
    if (uClean > 0.5) {
      // Cel limpo: luz e sombra, borda reta, como em desenho animado. Com 3 tons, o
      // terceiro (uMid) é a luz rebatida: só na borda do lado da sombra, como no desenho.
      bool inLight = facing > 0.08 && shadow > 0.5;
      vec3 toCamera = normalize(cameraPosition - vWorldPosition);
      float edgeness = 1.0 - max(dot(normal, toCamera), 0.0);
      if (inLight) color = uLit;
      else if (uCleanTones > 2.5 && edgeness > 0.58) color = uMid;
      else color = uShade;
    }
    else if (facing <= edge || shadow < 0.5) color = uDeep;
    else if (light > 0.55 + edge) color = uLit;
    else if (light > 0.22 + edge) color = uMid;
    else color = uShade;

    // Luz de contorno seletiva: só nos materiais com uRimAmount > 0.
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rim = 1.0 - max(dot(normal, viewDirection), 0.0);
    if (uRimAmount > 0.0 && rim > 1.0 - uRimAmount && facing > 0.0) color = uRim;

    #ifdef USE_INK
      // Traço da textura: só o que é mais escuro que o tom médio da região escurece a
      // faixa (olhos, barba, costuras). As cores continuam sendo as do site.
      vec3 inkColor = texture2D(uInk, vTexUv).rgb;
      float inkValue = pow(dot(inkColor, vec3(0.3, 0.59, 0.11)), 1.0 / 2.2);
      float detail = clamp(inkValue / uInkMedian, 0.2, 1.0);
      color *= mix(1.0, detail, uInkStrength);
      // O que é bem escuro na textura (barba, bigode) vira a cor de linha, com borda curva.
      if (uInkCut > 0.0) color = mix(color, uDeep, smoothstep(uInkCut + 0.05, uInkCut - 0.05, inkValue));

      #ifdef USE_STRAP
        // Alça: o que é escuro na textura. Fivela: tom médio puxado para o azul (a camisa
        // puxa para o verde). Cor chapada de luz ou sombra, e um traço onde a peça termina.
        bool strapInLight = facing > 0.08 && shadow > 0.5;
        float strapMask = smoothstep(uStrapCut + 0.04, uStrapCut - 0.04, inkValue);
        float buckleEdge = 0.8;
        float bluish = smoothstep(-0.01, 0.02, inkColor.b - inkColor.g);
        float buckleMask = (1.0 - strapMask) * bluish * smoothstep(buckleEdge + 0.04, buckleEdge - 0.04, inkValue);
        color = mix(color, strapInLight ? uStrapLit : uStrapShade, strapMask);
        color = mix(color, strapInLight ? uBuckle : uBuckle * 0.6, buckleMask);
        float width = fwidth(inkValue) * 1.2 + 1e-4;
        float strapLine = 1.0 - smoothstep(width * 0.5, width, abs(inkValue - uStrapCut));
        color = mix(color, uStrapLine, strapLine);
      #endif
    #endif

    #ifdef USE_PAINT
      vec4 paint = texture2D(uPaint, vTexUv);
      if (paint.a < 0.25) discard;
      if (paint.a > 0.75) color = paint.rgb;
    #endif

    // Ruído de impressão leve: grão fino na tela + mancha larga no mundo.
    float grain = hash(floor(gl_FragCoord.xy)) - 0.5;
    float blotch = valueNoise(vWorldPosition.xy * 0.9 + vWorldPosition.zx * 0.6) - 0.5;
    color *= 1.0 + (grain * uGrain + blotch * 0.07) * (1.0 - uClean * 0.75);

    // Objetos no ar quase somem quando estão colados na lente e ganham corpo ao se afastar.
    float lensDistance = distance(cameraPosition, vWorldPosition);
    float alpha = mix(1.0, smoothstep(0.2, 1.6, lensDistance), uNearFade);

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export const skyVertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const skyFragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHigh;
  uniform vec3 uMiddle;
  uniform vec3 uLow;
  uniform vec3 uHorizon;
  varying vec3 vDirection;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float h = clamp(vDirection.y, -0.1, 1.0);
    vec3 color = mix(uHorizon, uLow, smoothstep(0.06, 0.16, h));
    color = mix(color, uMiddle, smoothstep(0.14, 0.26, h));
    color = mix(color, uHigh, smoothstep(0.24, 0.4, h));
    color = mix(color, uTop, smoothstep(0.38, 0.7, h));

    // Estrelas presas à direção do céu, não à tela.
    vec2 cell = floor(vec2(atan(vDirection.z, vDirection.x) * 160.0, h * 260.0));
    float star = step(0.9965, hash(cell)) * smoothstep(0.2, 0.4, h);
    color = mix(color, vec3(0.95, 0.93, 0.55), star * 0.85);

    float grain = hash(floor(gl_FragCoord.xy)) - 0.5;
    color *= 1.0 + grain * 0.12;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createCelMaterial({ lit, mid, shade, deep, rim = PALETTE.yellow, rimAmount = 0, nearFade = false, ink, strap, region, paint, clean = false, cleanTones = 2 }: Bands) {
  const defines: Record<string, string> = {};
  if (ink) defines.USE_INK = "";
  if (paint) defines.USE_PAINT = "";
  if (ink && strap) defines.USE_STRAP = "";
  if (region) defines.USE_REGION = "";
  const material = new THREE.ShaderMaterial({
    lights: true,
    defines,
    transparent: nearFade,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      {
        uLit: { value: new THREE.Color(lit) },
        uMid: { value: new THREE.Color(mid) },
        uShade: { value: new THREE.Color(shade) },
        uDeep: { value: new THREE.Color(deep) },
        uRim: { value: new THREE.Color(rim) },
        uRimAmount: { value: rimAmount },
        uLightDirection: { value: LIGHT_DIRECTION.clone() },
        uGrain: { value: 0.16 },
        uNearFade: { value: nearFade ? 1 : 0 },
        uClean: { value: clean ? 1 : 0 },
        uCleanTones: { value: cleanTones },
      },
    ]),
    vertexShader: celVertexShader,
    fragmentShader: celFragmentShader,
  });
  // A textura entra depois do merge: o merge clona texturas, e o clone não sobe para a GPU.
  if (ink) {
    material.uniforms.uInk = { value: ink.map };
    material.uniforms.uInkMedian = { value: ink.median };
    material.uniforms.uInkStrength = { value: ink.strength ?? .85 };
    material.uniforms.uInkCut = { value: ink.cut ?? 0 };
  }
  if (paint) material.uniforms.uPaint = { value: paint };
  if (region) {
    material.uniforms.uRegion = { value: region.map };
    material.uniforms.uRegionId = { value: region.id };
  }
  if (strap) {
    material.uniforms.uStrapLit = { value: new THREE.Color(strap.lit) };
    material.uniforms.uStrapShade = { value: new THREE.Color(strap.shade) };
    material.uniforms.uBuckle = { value: new THREE.Color(strap.buckle) };
    material.uniforms.uStrapLine = { value: new THREE.Color(strap.line) };
    material.uniforms.uStrapCut = { value: strap.cut ?? .42 };
  }
  return material;
}

// Contorno de desenho: uma casca do mesmo modelo, virada do avesso e empurrada para fora
// pela normal (o Solidify do Blender). A espessura segue o tamanho no mundo, mas fica
// sempre entre minPixels e maxPixels na tela, para não sumir de longe nem engrossar de perto.
const outlineVertexShader = /* glsl */ `
  uniform float uWorldWidth;
  uniform float uMinPixels;
  uniform float uMaxPixels;
  uniform vec2 uResolution;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normal);
    vec2 direction = normalize(viewNormal.xy + vec2(1e-5));
    float pixels = clamp(uWorldWidth * projectionMatrix[1][1] * uResolution.y * 0.5 / clip.w, uMinPixels, uMaxPixels);
    clip.xy += direction * pixels * 2.0 / uResolution * clip.w;
    gl_Position = clip;
  }
`;

const outlineFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createOutlineMaterial({ color = PALETTE.ink, worldWidth = 0.006, minPixels = 1.5, maxPixels = 4 }: { color?: string; worldWidth?: number; minPixels?: number; maxPixels?: number } = {}) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uWorldWidth: { value: worldWidth },
      uMinPixels: { value: minPixels },
      uMaxPixels: { value: maxPixels },
      // Tamanho da tela em pixels reais; atualize no resize.
      uResolution: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: outlineVertexShader,
    fragmentShader: outlineFragmentShader,
  });
}

export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      const materialWithMap = material as THREE.MeshBasicMaterial;
      materialWithMap.map?.dispose();
      material.dispose();
    });
  });
}

// Textura pintada pelo Deiver (ex.: o paralelepípedo do Figma), com a cor dele na luz e
// só a sombra de verdade por cima: onde cai sombra, a textura escurece para o azul.
// Ex.: a sombra do Jota na rua anda junto com ele; o resto fica igual ao desenho.
const paintedVertexShader = /* glsl */ `
  #include <common>
  #include <shadowmap_pars_vertex>
  uniform mat3 uMapTransform;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    // Repetição e deslocamento da textura (texture.repeat/offset).
    vUv = (uMapTransform * vec3(uv, 1.0)).xy;
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <begin_vertex>
    #include <project_vertex>
    #include <worldpos_vertex>
    vWorldPosition = worldPosition.xyz;
    #include <shadowmap_vertex>
  }
`;

const paintedFragmentShader = /* glsl */ `
  #include <common>
  #include <packing>
  #include <bsdfs>
  #include <lights_pars_begin>
  #include <shadowmap_pars_fragment>
  #include <shadowmask_pars_fragment>
  ${SUN_SHADOW_GLSL}
  uniform sampler2D uMap;
  uniform vec3 uShadow;
  uniform float uGrain;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  float grainHash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }
  void main() {
    vec3 color = texture2D(uMap, vUv).rgb;
    // Grão ancorado no chão (não na tela): ajuda a textura pintada a conversar com os
    // materiais ilustrados, sem "nadar" quando a câmera se move.
    float fleck = smoothstep(0.84, 0.98, grainHash(floor(vWorldPosition.xz * 56.0)));
    color *= 1.0 - fleck * uGrain;
    color = mix(color * uShadow, color, step(0.5, getSunShadowMask()));
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createPaintedMaterial(map: THREE.Texture, shadow = "#5a68c8", grain = 0) {
  const material = new THREE.ShaderMaterial({
    lights: true,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      { uMap: { value: null }, uMapTransform: { value: new THREE.Matrix3() }, uShadow: { value: new THREE.Color(shadow) }, uGrain: { value: grain } },
    ]),
    vertexShader: paintedVertexShader,
    fragmentShader: paintedFragmentShader,
  });
  // UniformsUtils.merge copia valores; a textura entra depois para não ser clonada.
  material.uniforms.uMap.value = map;
  // Mesma matriz (não uma cópia): mudar map.repeat depois e chamar map.updateMatrix() basta.
  map.updateMatrix();
  material.uniforms.uMapTransform.value = map.matrix;
  return material;
}
