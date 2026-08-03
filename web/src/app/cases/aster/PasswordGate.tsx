"use client";

import { useActionState, useEffect, useRef } from "react";
import { unlockAster, type UnlockAsterState } from "./actions";
import theme from "./aster-theme.module.css";
import styles from "./PasswordGate.module.css";

const initialState: UnlockAsterState = { error: null };

/**
 * Tela de entrada do case ASTER. Só é renderizada quando não existe um
 * cookie de sessão válido (ver page.tsx) — o conteúdo protegido nunca
 * chega a ser enviado ao navegador antes da senha ser confirmada, porque
 * essa checagem acontece no servidor, não escondendo o case com CSS.
 */
export function PasswordGate() {
  const [state, formAction, pending] = useActionState(unlockAster, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.error) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [state.error]);

  return (
    <div className={`${theme.theme} ${styles.gate}`}>
      <div className={styles.card}>
        <p className={styles.wordmark}>ASTER</p>
        <h1 className={styles.title}>Private case study</h1>
        <p className={styles.description}>
          This case contains a detailed reconstruction of product-design work and is shared
          selectively.
        </p>

        <form action={formAction} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="aster-password" className={styles.label}>
              Password
            </label>
            <input
              ref={inputRef}
              id="aster-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-invalid={state.error ? "true" : undefined}
              aria-describedby="aster-password-error"
              className={styles.input}
            />
          </div>

          <div role="alert" id="aster-password-error" className={styles.error}>
            {state.error}
          </div>

          <button type="submit" className={styles.submit} disabled={pending}>
            {pending ? "Checking…" : "View case"}
          </button>
        </form>
      </div>
    </div>
  );
}
