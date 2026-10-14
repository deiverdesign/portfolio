import type { NextConfig } from "next";

// Endereço curto da prévia do hotsite (Deiver, 14/10): quem abre
// enquanto-durar-a-fe.vercel.app cai direto na experiência do livro, sem o
// caminho longo. A barra de endereço continua mostrando só o domínio curto
// (é um "rewrite": o servidor entrega outra página, mas o link não muda).
// Ex.: enquanto-durar-a-fe.vercel.app/ → /pt/enquanto-durar-a-fe/animatic-material
// Só vale para esse domínio; deiver.com.br e as outras prévias não mudam.
const HOTSITE_HOST = "enquanto-durar-a-fe.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles: roda antes das páginas normais, senão "/" abriria a home do portfólio.
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: HOTSITE_HOST }],
          destination: "/pt/enquanto-durar-a-fe/animatic-material",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
