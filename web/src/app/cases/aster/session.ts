import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Só protege o case ASTER — o cookie nunca é enviado em requisições fora
// de /cases/aster (é assim que o navegador trata o atributo Path).
export const ASTER_SESSION_COOKIE = "aster_session";
export const ASTER_COOKIE_PATH = "/cases/aster";

const SESSION_PAYLOAD = "unlocked";

function getPasswordFromEnv(): string {
  const password = process.env.ASTER_CASE_PASSWORD;
  if (!password) {
    throw new Error(
      "ASTER_CASE_PASSWORD não está configurada no ambiente. Ver web/README.md (seção ASTER) para instruções de setup."
    );
  }
  return password;
}

// Compara os dois lados como hash de tamanho fixo (32 bytes), não como
// string crua — evita vazar o tamanho da senha por um retorno antecipado
// quando os tamanhos diferem.
function constantTimeEquals(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

/** Confere a senha enviada pelo formulário contra ASTER_CASE_PASSWORD. */
export function verifyAsterPassword(candidate: string): boolean {
  return constantTimeEquals(candidate, getPasswordFromEnv());
}

// Assina o valor do cookie com HMAC (usando a própria senha como chave)
// pra impedir que alguém forje o cookie manualmente pelo DevTools —
// sem a senha, não dá pra calcular uma assinatura válida.
function sign(payload: string): string {
  return createHmac("sha256", getPasswordFromEnv()).update(payload).digest("hex");
}

export function createAsterSessionValue(): string {
  return `${SESSION_PAYLOAD}.${sign(SESSION_PAYLOAD)}`;
}

function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (payload !== SESSION_PAYLOAD || !signature) return false;
  return constantTimeEquals(signature, sign(payload));
}

/** Lê o cookie da sessão atual e confere se é uma sessão válida do ASTER. */
export async function isAsterUnlocked(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(ASTER_SESSION_COOKIE)?.value);
}
