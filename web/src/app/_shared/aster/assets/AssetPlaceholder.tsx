import { asterAssetManifest, type AsterAssetId } from "./manifest";
import styles from "./AssetPlaceholder.module.css";

export interface AssetPlaceholderProps {
  assetId: AsterAssetId;
  /** Estilo do placeholder — "photo" (retangular) ou "device" (mais estreito, pro hero do médico). */
  variant?: "photo" | "device";
}

/**
 * Renderiza um espaço reservado documentado pro asset final (ver
 * assets/manifest.ts). Isso não é decoração: é a especificação de
 * handoff — proporção, dimensão mínima, formato e alt text — visível
 * direto na página, pra trocar por um arquivo real sem adivinhar nada.
 */
export function AssetPlaceholder({ assetId, variant = "photo" }: AssetPlaceholderProps) {
  const spec = asterAssetManifest[assetId];

  if (spec.src) {
    if (/\.(mp4|webm|mov)$/i.test(spec.src)) {
      return (
        <video
          className={`${styles.image} ${styles[variant]}`}
          src={spec.src}
          controls
          playsInline
          aria-label={spec.alt}
        />
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    const img = <img src={spec.src} alt={spec.alt} className={`${styles.image} ${styles[variant]}`} />;

    if (!spec.srcMobile) return img;

    return (
      <picture>
        <source media="(max-width: 599px)" srcSet={spec.srcMobile} />
        {img}
      </picture>
    );
  }

  return (
    <div
      className={`${styles.placeholder} ${styles[variant]}`}
      style={{ aspectRatio: spec.aspectRatio }}
      role="img"
      aria-label={`Imagem ainda não disponível: ${spec.label}`}
    >
      <div className={styles.body} aria-hidden="true">
        <span className={styles.tag}>Placeholder</span>
        <p className={styles.label}>{spec.label}</p>
        <dl className={styles.specs}>
          <div>
            <dt>Proporção</dt>
            <dd>{spec.aspectRatio}</dd>
          </div>
          <div>
            <dt>Mínimo</dt>
            <dd>
              {spec.minWidth}×{spec.minHeight}px
            </dd>
          </div>
          <div>
            <dt>Formato</dt>
            <dd>{spec.format}</dd>
          </div>
        </dl>
        <p className={styles.altNote}>Alt text final: “{spec.alt}”</p>
      </div>
    </div>
  );
}
