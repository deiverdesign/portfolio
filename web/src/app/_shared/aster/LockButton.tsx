import { lockAster } from "./actions";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./LockButton.module.css";

const COPY: Record<Locale, string> = {
  en: "Lock this case",
  pt: "Trancar este case",
};

/**
 * Formulário simples chamando a Server Action que apaga o cookie de
 * sessão. É um <form>, não um botão com onClick, de propósito: assim
 * funciona mesmo antes do JavaScript da página carregar (progressive
 * enhancement padrão do Next.js pra forms com Server Action).
 */
export function LockButton({ locale, context = "light" }: { locale: Locale; context?: "light" | "dark" }) {
  return (
    <form action={lockAster} className={styles.form}>
      <button type="submit" className={`${styles.button} ${styles[context]}`}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <rect x="3" y="6.5" width="8" height="6" rx="1" />
          <path d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        {COPY[locale]}
      </button>
    </form>
  );
}
