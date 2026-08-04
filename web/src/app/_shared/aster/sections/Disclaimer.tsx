import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./Disclaimer.module.css";

const COPY: Record<Locale, { label: string; strong: string; rest: string }> = {
  en: {
    label: "Disclaimer",
    strong: "ASTER is a portfolio reconstruction using fictional data.",
    rest: " The interface and interactions were independently recreated to communicate the concept and do not reproduce a confidential client system. Clinical, legal, regulatory and ethical validation would require broader multidisciplinary work.",
  },
  pt: {
    label: "Aviso",
    strong: "O ASTER é uma reconstrução de portfólio usando dados fictícios.",
    rest: " A interface e as interações foram recriadas de forma independente para comunicar o conceito e não reproduzem um sistema confidencial de cliente. Validação clínica, legal, regulatória e ética exigiria um trabalho multidisciplinar mais amplo.",
  },
};

export function Disclaimer({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <aside className={styles.disclaimer} aria-label={t.label}>
      <p>
        <strong>{t.strong}</strong>
        {t.rest}
      </p>
    </aside>
  );
}
