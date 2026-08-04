import Link from "next/link";
import { LockButton } from "./LockButton";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./AsterHeader.module.css";

const COPY: Record<Locale, { back: string; homeHref: string }> = {
  en: { back: "Back to portfolio", homeHref: "/en" },
  pt: { back: "Voltar ao portfólio", homeHref: "/" },
};

export function AsterHeader({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <Link href={t.homeHref} className={styles.back}>
          <span aria-hidden="true">←</span> {t.back}
        </Link>
        <span className={styles.identity}>Deiver Brito</span>
      </div>
      <span className={styles.wordmark}>ASTER</span>
      <LockButton locale={locale} />
    </header>
  );
}
