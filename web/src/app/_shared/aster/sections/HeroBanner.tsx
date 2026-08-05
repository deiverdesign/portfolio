import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import type { Locale } from "@/components/NavBar/constants";
import styles from "./HeroBanner.module.css";

/** Imagem grande entre o Hero e o Disclaimer — médica com paciente, sem eyebrow/título próprios. */
export function HeroBanner({ locale }: { locale: Locale }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <AssetPlaceholder assetId="aster-hero-banner" locale={locale} />
      </div>
    </div>
  );
}
