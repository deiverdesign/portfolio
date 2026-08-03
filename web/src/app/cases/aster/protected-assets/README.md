# Assets protegidos do case ASTER

Coloque aqui os arquivos finais listados em [`../assets/manifest.ts`](../assets/manifest.ts)
(ex: `physician-device-hero.jpg`, `known-patient.png`).

**Não coloque esses arquivos em `web/public/`.** Qualquer coisa em `public/`
tem uma URL pública que responde independente da senha — colocar um
screenshot real do ASTER lá derrubaria a proteção da seção inteira, mesmo
com a tela de senha funcionando.

Arquivos aqui só são entregues por uma rota que confere a sessão antes de
ler o disco (`../asset/[filename]/route.ts`), acessível em
`/cases/aster/asset/<nome-do-arquivo>` — só funciona pra quem já
desbloqueou o case.

Depois de colocar um arquivo aqui, troque o `<AssetPlaceholder assetId="..." />`
correspondente por uma tag de imagem normal apontando pra
`/cases/aster/asset/<nome-do-arquivo>`.
