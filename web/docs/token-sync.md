# Sincronização segura de tokens

`src/styles/tokens.css` é a superfície integrada e revisada do site. Ela contém tokens vindos do
Figma e extensões locais necessárias para temas e componentes. Nenhum script pode sobrescrevê-la,
criar branches ou fazer commits automaticamente.

## Fluxo

1. Configure `FIGMA_TOKEN` somente no terminal. O token precisa do escopo
   `file_variables:read`; nunca o cole em chats ou arquivos do repositório.
2. Rode `npm run sync-tokens` em `web/`.
3. Revise `tmp/token-sync/tokens.figma.candidate.css` e o relatório de drift.
4. Integre deliberadamente apenas as mudanças aprovadas em `src/styles/tokens.css`.
5. Rode `npm run check-token-sync`, `npm run check-tokens`, lint e TypeScript.

`npm run sync-tokens -- --check` não grava candidato e retorna código 1 se algum token gerado
estiver ausente ou diferente no CSS atual. Tokens que existem apenas no CSS atual são classificados
como extensões locais preservadas, não como remoções.

## Contrato com o Figma

O arquivo deve expor as coleções `Primitives`, `Semantic`, `Spacing` e `Font size`. `Spacing` e
`Font size` devem conter exatamente os modos necessários ao site: `Desktop`, `Tablet` e `Mobile`.
Aliases ausentes, ciclos, modos incompletos e nomes CSS duplicados interrompem a geração.

O endpoint REST de Variables exige `file_variables:read` e pode não estar disponível no plano da
conta. Nesse caso, o fallback correto é uma exportação pela Figma Plugin API seguindo o mesmo
formato validado; não se deve enfraquecer as validações nem voltar a copiar valores silenciosamente.

`scripts/generate-tokens.mjs` é um snapshot estático legado. Ele também só escreve um candidato em
`tmp/token-sync/` e não deve ser tratado como fonte atual dos tokens.
