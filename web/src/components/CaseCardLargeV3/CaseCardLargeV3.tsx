import { Fragment, type CSSProperties } from "react";

import { CaseHeroNoise } from "@/components/CaseHeroBackground/CaseHeroNoise";
import { IconV3 } from "@/components/IconV3/IconV3";
import { TagV3 } from "@/components/TagV3/TagV3";
import type { RasterAsset } from "@/content/home-assets";
import styles from "./CaseCardLargeV3.module.css";

export interface CaseCardLargeV3Props {
  /** "large" (742×480) é o card "destaque" — só a SCRIOO tem hoje, mas
   * qualquer case pode virar o destaque no futuro (é escolha de posição
   * na Home, não uma propriedade fixa do case). "small" (472×480) é o
   * tamanho dos outros 4. Confirmado no Figma em 27/09: não é a mesma
   * proporção encolhida, é um card mais quadrado — os dois tamanhos só
   * compartilham a altura (480px). */
  size?: "large" | "small";
  /** Linhas explícitas do título — a quebra de linha é intencional no
   * Figma, não reflow automático de CSS. */
  titleLines: string[];
  href: string;
  /** Renderizado mesmo quando `decorative` já tem uma marca desenhada nele
   * (ex.: SCRIOO) — o Figma real mostra os dois juntos, não é redundante.
   * Opcional só pra cases sem asset de logo próprio ainda. */
  logoSrc?: string;
  logoAlt?: string;
  /** Tamanho renderizado do logo em px — calcule com
   * `getHomeBrandLogoSize(brand, 1.2)` em home-assets.ts (1.2 é a escala
   * medida no Figma pros 5 cases da Home em 28/09/2026, sobre o
   * componente raiz `HOME_BRAND_LOGO_SIZE`). Não aproxime por categoria
   * "mark"/"wordmark" — cada logo tem sua própria proporção calibrada. */
  logoWidth?: number;
  logoHeight?: number;
  devices: RasterAsset;
  /** Asset específico do enquadramento mobile. Quando omitido, reutiliza
   * `devices`; a posição continua vindo de `mobileDevicesStyle`. */
  mobileDevices?: RasterAsset;
  /** Posição/tamanho do `devices` — genuinamente diferente por case
   * (SCRIOO/HP encostam na direita e sangram por cima; Theodoor
   * centraliza; Intuit ancora à esquerda), conferido no Figma real de
   * cada um em 27/09. Não generalizar um default único. */
  devicesStyle?: CSSProperties;
  mobileDevicesStyle?: CSSProperties;
  /** Segunda camada de imagem, atrás de `devices` — só a Aster usa (o
   * Figma real tem "Back-Aster"/"front-Aster" como duas fotos
   * sobrepostas, não uma composição única). Testei essa hipótese pro
   * HP/Intuit primeiro (achei um asset parecido nos dois) e descartei:
   * o asset "extra" que aparece no código gerado do Figma pra esses dois
   * cai inteiramente fora da área visível do card (clipado por
   * `overflow:hidden`) — resto de camada, não elemento real de design. */
  secondDevice?: RasterAsset;
  secondDeviceStyle?: CSSProperties;
  /** Grafismo decorativo específico do case (ex.: o container da SCRIOO).
   * Encostado no canto superior esquerdo, sem padding. */
  decorative?: RasterAsset;
  /** Opacidade extra do grafismo decorativo. O nome do arquivo original
   * exportado do Figma tinha "-60perCent-Alpha" — mas medi o canal alfa
   * do PNG (`getImageData`) e o desenho em si é ~100% opaco onde visível;
   * o nome era uma instrução ("use a 60%"), não uma descrição do arquivo
   * (mesma lição do NORTE.md 2.2/13: nome de arquivo é rótulo, não spec).
   * Por isso o valor certo aqui é 0.6, aplicado via esta prop — não 1. */
  decorativeOpacity?: number;
  /** Stops do gradiente de fundo, de cima pra baixo (conferido no Figma
   * via get_design_context, não aproximado). Ignorado se `background` for
   * passado. */
  gradientFrom?: string;
  gradientTo?: string;
  /** Valor de `background` CSS completo — usar quando o fundo do case não
   * é um gradiente vertical simples de 2 stops (ex.: Intuit). */
  background?: string;
  /** Cor do grão do noise — tom sobre tom da cor do case (NORTE.md 6.6,
   * "Backgrounds e noise dos heroes de case": mesmo sistema, só a cor do
   * grão muda entre cases). */
  noiseColor: string;
  /** Cor do título default. A SCRIOO tem fundo claro (verde) e título
   * escuro — os outros 4 têm fundo colorido/foto e título BRANCO
   * (`foreground/neutral/inverse/strong` no Figma). Não é uma escolha de
   * modo automática a partir do `background`; teria que analisar
   * luminância pra generalizar, e nenhum dos 5 cases mistura os dois — por
   * isso é prop explícita, não inferida. */
  titleColor?: string;
  /** Título mostrado no painel de hover (diferente do título default —
   * ex. "CURE/SCRIOO" em vez da descrição de marketing). */
  hoverTitle: string;
  /** Citação em 1ª pessoa mostrada no hover. */
  hoverQuote: string;
  /** No mobile não existe hover: a contribuição curta fica sempre visível. */
  mobileTitle?: string;
  hoverTags: string[];
  /** Case protegido/confidencial (ex.: Aster) — mostra um selo de cadeado
   * no canto, tanto no estado default quanto no hover. Confirmado no
   * Figma em 27/09 (node 2264:72142), não é aproximação. */
  locked?: boolean;
  className?: string;
}

/**
 * Figma: instância "Cases Cards" na Home, fileKey zpaQNzgjhG5ZKafe2cxnkm,
 * node 2167:6206 (SCRIOO, Desktop Large) para o estado default; hover
 * conferido via `get_design_context` no node 2262:60981 em 27/09/2026.
 * Os outros 4 cases (HP/Theodoor/Intuit/Aster) conferidos separadamente
 * no mesmo dia, cada um no seu node real — ver comentários em
 * `CaseCardLargeV3.module.css` pro achado de tamanho (large/small) e pro
 * selo de cadeado do Aster.
 *
 * Simplificações assumidas no hover, documentadas por não terem asset
 * disponível: o pequeno vetor decorativo (~71×24, canto superior do
 * painel) foi omitido. O brilho (`Ellipse 13`) é aproximado por
 * `radial-gradient` em vez do PNG original.
 *
 * Ainda em aberto: variante exclusiva para mobile (conteúdo já existe no
 * catálogo, layout ainda não foi implementado — e no mobile todos os 5
 * cases têm o mesmo tamanho, o fork large/small é só do Desktop/Tablet).
 */
export function CaseCardLargeV3({
  size = "large",
  titleLines,
  href,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  devices,
  mobileDevices,
  devicesStyle,
  mobileDevicesStyle,
  secondDevice,
  secondDeviceStyle,
  decorative,
  decorativeOpacity = 1,
  gradientFrom,
  gradientTo,
  background,
  noiseColor,
  titleColor,
  hoverTitle,
  hoverQuote,
  mobileTitle,
  hoverTags,
  locked = false,
  className,
}: CaseCardLargeV3Props) {
  const sizeClass = size === "small" ? styles.small : styles.large;
  const classes = className ? `${styles.root} ${sizeClass} ${className}` : `${styles.root} ${sizeClass}`;
  const resolvedBackground = background ?? `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`;

  return (
    <a href={href} className={classes} style={{ background: resolvedBackground }}>
      {decorative && (
        <img
          src={decorative.src}
          alt=""
          aria-hidden="true"
          className={styles.decorative}
          style={{ opacity: decorativeOpacity }}
        />
      )}

      <CaseHeroNoise color={noiseColor} />

      {logoSrc && (
        <img
          src={logoSrc}
          alt={logoAlt ?? ""}
          className={styles.logo}
          style={{ width: logoWidth, height: logoHeight }}
        />
      )}

      {locked && (
        <span className={styles.lockBadge} aria-label="Case protegido — acesso sob solicitação">
          <IconV3 name="lock" size={18} className={styles.lockIcon} />
        </span>
      )}

      {secondDevice && (
        <img
          src={secondDevice.src}
          width={secondDevice.width}
          height={secondDevice.height}
          alt=""
          className={styles.secondDevice}
          style={secondDeviceStyle}
        />
      )}

      <img
        src={devices.src}
        width={devices.width}
        height={devices.height}
        alt=""
        className={styles.devices}
        style={devicesStyle}
      />

      <img
        src={(mobileDevices ?? devices).src}
        width={(mobileDevices ?? devices).width}
        height={(mobileDevices ?? devices).height}
        alt=""
        className={styles.mobileDevices}
        style={mobileDevicesStyle}
      />

      <p className={styles.title} style={titleColor ? { color: titleColor } : undefined}>
        {titleLines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>

      <div className={styles.mobileContent} style={titleColor ? { color: titleColor } : undefined}>
        <p className={styles.mobileTitle}>{mobileTitle ?? hoverQuote}</p>
        <div className={styles.mobileTags}>
          {hoverTags.slice(0, 2).map((tag) => (
            <TagV3 key={tag} label={tag} />
          ))}
        </div>
      </div>

      <div className={styles.hoverPanel}>
        {/* Brilho decorativo removido a pedido do Deiver em 27/09 — a
            aproximação por radial-gradient não convenceu. Vai ser
            repensado na v3.2, não é pra reimplementar sem pedido novo. */}
        <p className={styles.hoverQuote}>{hoverQuote}</p>
        <p className={styles.hoverTitle}>{hoverTitle}</p>
        <div className={styles.hoverTags}>
          {hoverTags.map((tag) => (
            <TagV3 key={tag} label={tag} />
          ))}
        </div>
        {locked && (
          <span
            className={styles.hoverLockBadge}
            aria-label="Case protegido — acesso sob solicitação"
          >
            <IconV3 name="lock" size={18} className={styles.lockIcon} />
          </span>
        )}
        <span className={styles.hoverButton} aria-hidden="true">
          <IconV3 name="arrow-right" size={14} />
        </span>
      </div>
    </a>
  );
}
