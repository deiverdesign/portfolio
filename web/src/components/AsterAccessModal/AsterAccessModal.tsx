"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { getHomeBrandLogo } from "@/content/home-assets";
import type { Locale } from "@/content/i18n";
import { unlockAster, type UnlockAsterState } from "@/app/_shared/aster/actions";
import styles from "./AsterAccessModal.module.css";

const INITIAL_STATE: UnlockAsterState = { error: null, unlocked: false };

const COPY: Record<Locale, {
  title: string;
  description: string;
  placeholder: string;
  submit: string;
  checking: string;
  retry: string;
  wrong: string;
  help: string;
  requestAccess: string;
  emailSubject: string;
  emailBody: string;
  close: string;
}> = {
  en: {
    title: "Private case study",
    description: "This case contains a detailed reconstruction of product-design work and is shared selectively.",
    placeholder: "Enter password",
    submit: "View case",
    checking: "Checking...",
    retry: "Try again",
    wrong: "This password doesn’t look right.",
    help: "Try again or email me at: hello@deiver.com.br",
    requestAccess: "Need access? Request the password",
    emailSubject: "Aster case study access",
    emailBody: "Hi Deiver, I'd like access to the Aster case study.",
    close: "Close dialog",
  },
  pt: {
    title: "Case privado",
    description: "Este case contém uma reconstrução detalhada de trabalho de product design e é compartilhado seletivamente.",
    placeholder: "Digite a senha",
    submit: "Ver case",
    checking: "Verificando...",
    retry: "Tentar novamente",
    wrong: "Essa senha não parece correta.",
    help: "Tente novamente ou me escreva em: hello@deiver.com.br",
    requestAccess: "Precisa de acesso? Peça a senha",
    emailSubject: "Acesso ao case Aster",
    emailBody: "Oi, Deiver. Gostaria de solicitar acesso ao case Aster.",
    close: "Fechar diálogo",
  },
};

export interface AsterAccessModalProps {
  locale: Locale;
  caseHref: string;
  onClose: () => void;
}

/** Modal de acesso ao case privado ASTER. Figma: 2413:15215. */
export function AsterAccessModal({ locale, caseHref, onClose }: AsterAccessModalProps) {
  const t = COPY[locale];
  const boundUnlock = unlockAster.bind(null, locale);
  const [state, formAction, pending] = useActionState(boundUnlock, INITIAL_STATE);
  const [editedSinceError, setEditedSinceError] = useState(false);
  const [isAccessRequestVisible, setIsAccessRequestVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = Boolean(state.error) && !editedSinceError;
  const requestEmailHref = `mailto:hello@deiver.com.br?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(t.emailBody)}`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (state.unlocked) window.location.assign(caseHref);
  }, [caseHref, state.unlocked]);

  useEffect(() => {
    if (state.error) inputRef.current?.focus();
  }, [state.error]);

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={hasError ? `${styles.dialog} ${styles.errorState}` : styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="aster-access-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.closeRow}>
          <button type="button" className={styles.closeButton} aria-label={t.close} onClick={onClose}>
            <IconV3 name="close" size={24} />
          </button>
        </div>

        <div className={styles.logoWrap}>
          <img src={getHomeBrandLogo("aster", "original")} alt="Aster" className={styles.logo} />
        </div>

        <form action={formAction} className={styles.form} noValidate>
          <div className={styles.copy}>
            <h2 id="aster-access-title">{t.title}</h2>
            <p>{t.description}</p>
          </div>

          <div className={styles.formControls}>
            <div className={styles.fieldGroup}>
              <div className={hasError ? `${styles.field} ${styles.fieldError}` : styles.field}>
                <label className={styles.srOnly} htmlFor="aster-access-password">{t.placeholder}</label>
                <input
                  ref={inputRef}
                  id="aster-access-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={t.placeholder}
                  required
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? "aster-access-error" : undefined}
                  onInput={() => setEditedSinceError(true)}
                />
                <IconV3 name="lock" size={16} className={styles.lock} />
              </div>

              {hasError && (
                <p id="aster-access-error" className={styles.error} role="alert">
                  <IconV3 name="octagon-alert-2" size={14} />
                  {t.wrong}
                </p>
              )}
            </div>

            {hasError && <p className={styles.help}>{t.help}</p>}
          </div>

          <ButtonV3
            variant="primary"
            className={styles.submit}
            type="submit"
            disabled={pending || hasError}
          >
            {pending ? t.checking : hasError ? t.retry : t.submit}
            {!pending && !hasError && <IconV3 name="arrow-right" size={16} />}
          </ButtonV3>

          <div className={styles.requestAccess}>
            <ButtonV3
              variant="tertiary"
              size="medium"
              type="button"
              className={styles.requestButton}
              aria-expanded={isAccessRequestVisible}
              onClick={() => setIsAccessRequestVisible(true)}
            >
              {t.requestAccess}
            </ButtonV3>
            {isAccessRequestVisible && (
              <a className={styles.requestEmail} href={requestEmailHref}>
                hello@deiver.com.br
              </a>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
