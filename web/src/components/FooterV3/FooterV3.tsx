import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import styles from "./FooterV3.module.css";

export interface FooterV3Props {
  locale: Locale;
  homeHref: string;
  aboutHref: string;
  resumeHref: string;
  linkedinHref: string;
  className?: string;
}

/**
 * Figma: componente "Footer", fileKey zpaQNzgjhG5ZKafe2cxnkm, frame
 * 1821:36880 (Desktop 1821:36881, Mobile 1925:17668).
 *
 * Pendência de asset: o pequeno grafismo hexagonal ao lado do copyright
 * ("DEIVER-Graphism-Footer", ~57×35) ainda não foi exportado/auditado —
 * este componente funciona sem ele, e o espaço fica vazio até chegar.
 *
 * A palavra "Spark" na tagline recebe uma microinteração de partículas no
 * hover (ver NORTE.md 6.6, "Footer — microinteração de partículas"); este
 * componente ainda renderiza a tagline estática, sem esse efeito.
 */
export function FooterV3({
  locale,
  homeHref,
  aboutHref,
  resumeHref,
  linkedinHref,
  className,
}: FooterV3Props) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  const { logo, jobTitle, locationTree } = HOME_ASSETS.identity;

  return (
    <footer className={classes}>
      <div className={styles.topRow}>
        <div className={styles.identity}>
          <img src={logo} alt="Deiver Brito" className={styles.logo} />
          <div className={styles.identityDetails}>
            <img
              src={jobTitle}
              alt={locale === "pt" ? "Product Designer Sênior" : "Sr. Product Designer"}
              className={styles.jobTitle}
            />
            <span className={styles.location}>
              <img src={locationTree} alt="" aria-hidden="true" className={styles.locationIcon} />
              {getCopy(locale, "shared.footer.location")}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <ButtonV3 href={homeHref} variant="primary">
            {getCopy(locale, "shared.footer.home")}
          </ButtonV3>
          <ButtonV3 href={aboutHref} variant="primary">
            {getCopy(locale, "shared.footer.about")}
          </ButtonV3>
          <ButtonV3 href={resumeHref} variant="secondary">
            {getCopy(locale, "shared.footer.resume")} <span aria-hidden="true">↓</span>
          </ButtonV3>
          <ButtonV3 href={linkedinHref} variant="secondary">
            {getCopy(locale, "shared.footer.linkedin")}
          </ButtonV3>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.metaRow}>
        <p className={styles.copyright}>{getCopy(locale, "shared.footer.copyright")}</p>
      </div>

      <p className={styles.tagline}>
        {getCopy(locale, "shared.footer.tagline")}
      </p>

      <div className={styles.blackBar} aria-hidden="true" />
    </footer>
  );
}
