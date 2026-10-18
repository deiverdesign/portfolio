import type { NextConfig } from "next";

// Endereços curtos da prévia do hotsite (Deiver, 14/10, +domínio próprio em 16/10):
// quem abre qualquer um desses hosts cai direto na experiência do livro, sem o
// caminho longo. A barra de endereço continua mostrando só o domínio curto
// (é um "rewrite": o servidor entrega outra página, mas o link não muda).
// Ex.: enquantodurarafe.com.br/ → /pt/enquanto-durar-a-fe
// Só vale para esses domínios; deiver.com.br e as outras prévias não mudam.
const HOTSITE_HOSTS = [
  "enquanto-durar-a-fe.vercel.app",
  "enquantodurarafe.com.br",
  "www.enquantodurarafe.com.br",
];

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles: roda antes das páginas normais, senão "/" abriria a home do portfólio.
      beforeFiles: HOTSITE_HOSTS.map((host) => ({
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: "/pt/enquanto-durar-a-fe",
      })),
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
