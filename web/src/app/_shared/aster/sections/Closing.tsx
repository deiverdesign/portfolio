import Link from "next/link";
import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { ExternalLink } from "./ExternalLink";
import { ASTER_FIGJAM_URL, ASTER_PROTOTYPE_URL } from "./links";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./Closing.module.css";

const COPY: Record<Locale, {
  statement: string;
  prototypeLink: string;
  figjamLink: string;
  backLink: string;
  homeHref: string;
}> = {
  en: {
    statement:
      "Designing clinical AI is not only about what the system can do. It is about defining when it should act, when it should wait, and how people remain in control.",
    prototypeLink: "Explore the interactive prototype",
    figjamLink: "Explore the discovery board",
    backLink: "Back to portfolio",
    homeHref: "/en",
  },
  pt: {
    statement:
      "Desenhar IA clínica não é só sobre o que o sistema consegue fazer. É sobre definir quando ele deve agir, quando deve esperar e como as pessoas permanecem no controle.",
    prototypeLink: "Explore o protótipo interativo",
    figjamLink: "Explore o board de discovery",
    backLink: "Voltar ao portfólio",
    homeHref: "/",
  },
};

export function Closing({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <section className={styles.closing} aria-labelledby="closing-heading">
      <div className={styles.inner}>
        <div className={styles.visual}>
          <AssetPlaceholder assetId="aster-closing-workspace" locale={locale} />
        </div>

        <div className={styles.text}>
          <p id="closing-heading" className={styles.statement}>
            {t.statement}
          </p>

          <div className={styles.links}>
            <ExternalLink href={ASTER_PROTOTYPE_URL} className={styles.primaryLink}>
              {t.prototypeLink}
            </ExternalLink>
            <ExternalLink href={ASTER_FIGJAM_URL} className={styles.secondaryLink}>
              {t.figjamLink}
            </ExternalLink>
          </div>

          <Link href={t.homeHref} className={styles.backLink}>
            <span aria-hidden="true">←</span> {t.backLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
