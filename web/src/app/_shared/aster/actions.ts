"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/components/NavBar/NavBar";
import {
  ASTER_COOKIE_PATH,
  ASTER_SESSION_COOKIE,
  createAsterSessionValue,
  verifyAsterPassword,
} from "./session";

export interface UnlockAsterState {
  error: string | null;
  unlocked?: boolean;
}

const WRONG_PASSWORD_MESSAGE: Record<Locale, string> = {
  en: "That password didn't work. Please try again.",
  pt: "Essa senha não funcionou. Tente novamente.",
};

// `locale` vem pré-preenchido via .bind() no PasswordGate — useActionState
// só controla (state, formData), então o idioma precisa chegar assim pra
// devolver a mensagem de erro no idioma certo.
export async function unlockAster(
  locale: Locale,
  _prevState: UnlockAsterState,
  formData: FormData
): Promise<UnlockAsterState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0 || !verifyAsterPassword(password)) {
    return { error: WRONG_PASSWORD_MESSAGE[locale], unlocked: false };
  }

  const store = await cookies();
  store.set(ASTER_SESSION_COOKIE, createAsterSessionValue(), {
    httpOnly: true,
    // `secure` em HTTP impede o fluxo de funcionar no localhost. Em
    // produção o cookie continua restrito a HTTPS.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ASTER_COOKIE_PATH,
    // Sem maxAge/expires: cookie de sessão — some quando o navegador fecha.
  });

  return { error: null, unlocked: true };
}
