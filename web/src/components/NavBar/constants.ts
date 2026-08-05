/**
 * Constantes de locale compartilhadas entre Server e Client Components.
 *
 * Precisam viver num arquivo SEM "use client": Server Components não
 * conseguem importar valores simples (não-componentes) de um módulo
 * marcado "use client" — o import resolve como referência de cliente,
 * não como o valor em si, e vira `undefined` em tempo de execução no
 * lado do servidor. `NavBar.tsx` (client) e as páginas/Server Components
 * que usam essas constantes (Home, About, Footer) importam as duas daqui.
 */

export type Locale = "pt" | "en";

/** Currículo é o mesmo PDF pra quem já fala português ou inglês — só o conteúdo do arquivo muda por idioma. */
export const RESUME_HREF: Record<Locale, string> = {
  pt: "/curriculo-deiver-brito.pdf",
  en: "/resume-deiver-brito.pdf",
};

/** Nome do arquivo salvo no download — independe do nome do arquivo em /public. */
export const RESUME_DOWNLOAD_NAME: Record<Locale, string> = {
  pt: "Deiver-Brito-Curriculo.pdf",
  en: "Deiver-Brito-Resume.pdf",
};

export const HOME_HREF: Record<Locale, string> = {
  pt: "/pt",
  en: "/",
};
