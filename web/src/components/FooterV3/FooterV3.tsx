import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { HOME_ASSETS } from "@/content/home-assets";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
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
 * A palavra "Spark" na tagline recebe uma microinteração de partículas no
 * hover — contrato completo em V3-HANDOFF.md, seção "Footer —
 * microinteração de partículas em 'Spark'" (não é no NORTE.md, referência
 * corrigida em 27/09). Marcado como [PENDENTE] lá, não bloqueia o primeiro
 * release; este componente ainda renderiza a tagline estática, sem esse
 * efeito.
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
  const { logo, locationTree, graphismFooter } = HOME_ASSETS.identity;

  return (
    <footer className={classes}>
      <div className={styles.topRow}>
        <div className={styles.identity}>
          <img src={logo} alt="Deiver Brito" className={styles.logo} />
          <div className={styles.identityDetails}>
            <p className={styles.jobTitle}>{getCopy(locale, "shared.identity.job-title")}</p>
            <span className={styles.location}>
              <img src={locationTree} alt="" aria-hidden="true" className={styles.locationIcon} />
              {getCopy(locale, "shared.footer.location")}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <ButtonV3 href={resumeHref} variant="secondary">
            {getCopy(locale, "shared.footer.resume")}
            <IconV3 name="download" size={16} />
          </ButtonV3>
          <ButtonV3 href={linkedinHref} variant="secondary" target="_blank" rel="noopener noreferrer">
            {getCopy(locale, "shared.footer.linkedin")}
            <IconV3 name="linkedin" size={16} />
          </ButtonV3>
          <ButtonV3 href={homeHref} variant="primary">
            {getCopy(locale, "shared.footer.home")}
          </ButtonV3>
          <ButtonV3 href={aboutHref} variant="primary">
            {getCopy(locale, "shared.footer.about")}
          </ButtonV3>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.metaRow}>
        <img src={graphismFooter} alt="" aria-hidden="true" className={styles.graphismFooter} />
        <p className={styles.copyright}>{getCopy(locale, "shared.footer.copyright")}</p>
      </div>

      <p className={styles.tagline}>
        {getCopy(locale, "shared.footer.tagline")}
      </p>

      <div className={styles.blackBar} aria-hidden="true" />
    </footer>
  );
}
