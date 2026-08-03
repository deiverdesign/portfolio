import { lockAster } from "./actions";
import styles from "./LockButton.module.css";

/**
 * Formulário simples chamando a Server Action que apaga o cookie de
 * sessão. É um <form>, não um botão com onClick, de propósito: assim
 * funciona mesmo antes do JavaScript da página carregar (progressive
 * enhancement padrão do Next.js pra forms com Server Action).
 */
export function LockButton() {
  return (
    <form action={lockAster} className={styles.form}>
      <button type="submit" className={styles.button}>
        Lock this case
      </button>
    </form>
  );
}
