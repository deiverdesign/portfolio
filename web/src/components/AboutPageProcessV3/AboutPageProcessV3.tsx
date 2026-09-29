import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { TagV3 } from "@/components/TagV3/TagV3";
import styles from "./AboutPageProcessV3.module.css";

export interface AboutPageProcessV3Props {
  locale: Locale;
}

const TAG_KEYS = [
  "about.process.tag.research",
  "about.process.tag.discovery",
  "about.process.tag.usability",
  "about.process.tag.specs",
] as const;

/**
 * Figma: "Design-Decisions-Section" (processo), node 2262:64712
 * (Desktop-Laptop). O banner à direita ("Complex Products Banner", node
 * 2148:8087) é um placeholder de verdade no próprio Figma — o Deiver
 * ainda não decidiu a imagem/vídeo (nota dele, em PT, cravada no
 * componente). Renderizado aqui como bloco reservado, sem inventar uma
 * imagem — trocar por `<img>`/`<video>` quando o asset existir.
 */
export function AboutPageProcessV3({ locale }: AboutPageProcessV3Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h2 className={styles.title}>{getCopy(locale, "about.process.title")}</h2>
          <div className={styles.body}>
            <p className={styles.subtitle}>{getCopy(locale, "about.process.subtitle")}</p>
            <p className={styles.paragraph}>{getCopy(locale, "about.process.body")}</p>
            <ul className={styles.tags}>
              {TAG_KEYS.map((key) => (
                <li key={key}>
                  <TagV3 label={getCopy(locale, key)} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Texto de placeholder interno, não copy editorial — por isso
            direto aqui, não no catálogo (site-copy.generated.json vem do
            Excel do Deiver, é conteúdo aprovado). Trocar todo esse bloco
            pela imagem/vídeo real assim que existir. */}
        <div className={styles.banner} role="img" aria-label="">
          <p className={styles.bannerNote}>
            {locale === "pt" ? "Imagem a definir." : "Image to be decided."}
          </p>
        </div>
      </div>
    </section>
  );
}
