"use server";

import { cookies } from "next/headers";
import {
  ASTER_COOKIE_PATH,
  ASTER_SESSION_COOKIE,
  createAsterSessionValue,
  verifyAsterPassword,
} from "./session";

export interface UnlockAsterState {
  error: string | null;
}

const WRONG_PASSWORD_MESSAGE = "That password didn't work. Please try again.";

export async function unlockAster(
  _prevState: UnlockAsterState,
  formData: FormData
): Promise<UnlockAsterState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0 || !verifyAsterPassword(password)) {
    return { error: WRONG_PASSWORD_MESSAGE };
  }

  const store = await cookies();
  store.set(ASTER_SESSION_COOKIE, createAsterSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: ASTER_COOKIE_PATH,
    // Sem maxAge/expires: cookie de sessão — some quando o navegador fecha.
  });

  return { error: null };
}

export async function lockAster(): Promise<void> {
  const store = await cookies();
  store.delete({ name: ASTER_SESSION_COOKIE, path: ASTER_COOKIE_PATH });
}
