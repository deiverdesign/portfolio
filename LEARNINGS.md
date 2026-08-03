# Aprendizados do projeto

Este arquivo reúne, por categoria, as regras, decisões técnicas e boas
práticas que surgiram construindo este portfólio com o Claude Code — tanto
coisas específicas deste repositório quanto lições que valem pra qualquer
projeto. É complementar ao [CLAUDE.md](CLAUDE.md) (que fala de como
trabalhar comigo) e às skills em [`.claude/skills/`](.claude/skills/) (que
são instruções automáticas, carregadas quando a IA reconhece a situação).

## Índice

1. [Como trabalhar comigo](#1-como-trabalhar-comigo)
2. [Figma ↔ Código](#2-figma--código)
3. [Componentes React e CSS](#3-componentes-react-e-css)
4. [Storybook](#4-storybook)
5. [Deploy (Vercel + GitHub Actions)](#5-deploy-vercel--github-actions)
6. [Acessibilidade (WCAG AA)](#6-acessibilidade-wcag-aa)
7. [Boas práticas gerais (valem pra qualquer projeto)](#7-boas-práticas-gerais-valem-pra-qualquer-projeto)
8. [Referência rápida](#8-referência-rápida)

---

## 1. Como trabalhar comigo

(Resumo do [CLAUDE.md](CLAUDE.md) — se algo divergir, o CLAUDE.md manda.)

- Sou designer aprendendo a programar, autista (nível 1) + TDAH, penso
  bottom-up: mostrar o exemplo/código antes de nomear o conceito.
- Respostas diretas, sem rodeio, mas gentis. Jargão técnico só com uma
  explicação de 1 frase na primeira vez que aparecer.
- Se um pedido for ambíguo, perguntar com um exemplo do que foi entendido,
  em vez de assumir.
- **Autorizado sem perguntar**: `git commit`/`git push` pra `main`; rebuild +
  deploy do Storybook na Vercel.
- **Sempre precisa perguntar, mesmo com o acima**: apagar recurso na nuvem,
  abrir Pull Request de verdade, qualquer coisa envolvendo senha/token meu.

---

## 2. Figma ↔ Código

### Duas formas de acessar dados do Figma — e quando usar cada uma

| | API REST (`sync-tokens.mjs`) | Plugin API (`use_figma`/MCP) |
|---|---|---|
| Como acessa | `https://api.figma.com/v1/...` com um token pessoal (`FIGMA_TOKEN`) | Fala direto com o Figma desktop app aberto |
| Trava de plano | Endpoint de variáveis exige o escopo `file_variables:read`, que **só existe em planos Organization/Enterprise** | Nenhuma trava de plano — sempre funciona |
| Quando usar | Automação sem humano no loop (ex: um script rodando sozinho, ou um futuro pipeline via webhook) | No dia a dia, com a IA no loop — é o caminho usado a sessão inteira |

Regra prática: **peça pro Figma através do `use_figma`, não assuma qual
escopo de token escolher sem checar** — o erro 403 do Figma sempre nomeia o
escopo certo, mas descobrir isso *depois* de gerar o token errado custa um
ciclo inteiro. Ver a skill `figma-variables-api-access`.

### Nunca aproxime um valor que dá pra consultar exato

Isso já causou bug reincidente na sessão (brilho do Hero, altura da imagem
do card, variante do botão Contato, ícone do NavBar): sempre que o dado
real está disponível no Figma (posição, cor, geometria de um vetor), **pegue
o valor exato via `get_design_context`/`use_figma`**, mesmo que uma
aproximação visual "pareça igual" de longe. Um exemplo concreto do que deu
errado: aproximar a posição de um brilho (`left: -8%, top: 35%`) quando o
dado exato já tinha sido consultado antes na mesma conversa.

### Pipeline de sincronização de tokens (Etapa 5, hoje embrionário)

`scripts/sync-tokens.mjs`: busca as variáveis reais do Figma via API REST,
regenera `web/src/styles/tokens.css`, e — se algo mudou — cria uma branch +
commit **local**. De propósito, ele **não** dá `git push` nem abre Pull
Request sozinho — isso fica manual, porque afeta o repositório
compartilhado.

Etapa 6 (arquitetura, ainda não construída): um **webhook** do Figma
(evento `LIBRARY_PUBLISH`, que dispara só quando alguém publica a
biblioteca de propósito — não a cada tecla digitada) chamaria um endpoint
pequeno, que dispararia o GitHub Action já existente, que rodaria o
`sync-tokens.mjs` com um token real (exigiria plano Organization), abriria
o PR sozinho, e um humano revisaria e mergearia. Hoje, sem esse plano, essa
parte continua sendo "abro o Claude Code e peço".

---

## 3. Componentes React e CSS

### O mesmo `min-width` não serve pra Desktop e Tablet ao mesmo tempo

Os containers de Desktop (1280px) e Tablet (768px real testado) têm larguras
úteis bem diferentes (1232px vs ~714px). Um `min-width` calibrado pra dar 2
colunas no container estreito do Tablet quase sempre cabe 3 no container
largo do Desktop. **Antes de escolher um valor, calcule**: pra caber N
colunas com gap G num container de largura W, `N * minWidth + (N-1) * G <=
W`, e pra NÃO caber N+1, `(N+1) * minWidth + N * G > W`. Se os dois
breakpoints pedem contagens de coluna diferentes, é preciso uma regra
específica por `@media`, não um único valor global.

### Imagem de card com altura fixa, não aspect-ratio

`height: 260px` fixo (igual em todos os breakpoints) + `object-fit: cover` é
mais robusto que computar um aspect-ratio por card — garante que cards
lado a lado tenham a mesma altura de imagem mesmo com larguras diferentes.

### Extraia um componente pequeno quando o mesmo padrão visual se repete

`Tag`, `LinkTertiary` e `Icon` nasceram assim: apareciam 2+ vezes em lugares
diferentes do Figma com o mesmo papel. Um sinal de que vale a pena: o Figma
já deu nome ao padrão (ex: "Link/Tertiary") — isso normalmente indica que
ele mesmo já tentou unificar uma inconsistência.

### Ícones: sempre do vetor real, nunca desenhado à mão

Os ícones do NavBar (menu/close) começaram como SVG desenhado à mão e foram
trocados depois pelos vetores reais do Figma. O componente `Icon` usa
`stroke="currentColor"` pra herdar a cor do contexto (funciona em qualquer
fundo/tema sem precisar de uma variante por cor).

### Fonte que existe no Figma mas não estava carregada no código

O Figma usava DM Mono pra números pequenos (`01`, legendas) — o código só
carregava DM Sans e Boldonse. Um gap assim só aparece quando alguém constrói
um componente novo comparando com precisão contra o Figma; vale conferir
`next/font/google` no `layout.tsx` sempre que uma fonte "nova" aparecer numa
consulta ao Figma.

---

## 4. Storybook

- **Conteúdo genérico por padrão**: `"Label"`, `"Case Study One"`, imagem
  placeholder cinza — nunca dado real de produção (foto de cliente, nome de
  case). Ver skill `storybook-story-conventions`.
- **Fundo do canvas**: nesta versão do Storybook (9/10), o parâmetro certo é
  `initialGlobals: { backgrounds: { value: 'gray' } }` — `parameters.backgrounds.default`
  (a API antiga, mais documentada por aí) **não funciona mais** e falha
  silenciosamente (sem erro, só não aplica).
- **Placeholder de imagem via SVG inline**: nunca envolva uma string que já
  tem `%23` (o `#` escapado) num `encodeURIComponent()` de novo — duplica o
  escape (`%2523`), produz uma cor inválida, e a imagem renderiza preta sem
  nenhum erro no console.
- **Deploy**: builda pra uma pasta estática (`storybook-static/`) e publica
  na Vercel como projeto separado do site principal. Ver seção 5 e a skill
  `deploy-storybook-vercel`.

---

## 5. Deploy (Vercel + GitHub Actions)

### Alias manual (`vercel alias set`) trava num deploy específico

`vercel alias set <deployment> <alias>` aponta o link pra **aquele
deployment exato** — não acompanha deploys futuros sozinho. Isso já causou
o site parecer "desatualizado" depois de um push que realmente funcionou.
**Para um link permanente que sempre siga produção, registre como Domain de
verdade** (`vercel domains add <alias>.vercel.app <project>`), o mesmo
mecanismo que já faz os aliases automáticos da Vercel (tipo
`portfolio-eight-rosy-....vercel.app`) sempre atualizarem sozinhos.

### Build que regenera uma pasta apaga o link `.vercel` dentro dela

`npm run build-storybook` recria `storybook-static/` do zero, levando junto
o `.vercel/project.json`. Sem religar (`vercel link --yes --project <nome>`)
antes de cada deploy, a Vercel cria um **projeto novo duplicado** em vez de
atualizar o existente. Ver skill `deploy-storybook-vercel`.

### `vercel projects rm` é interativo — não use `yes |`

O prompt de confirmação re-renderiza a cada tecla recebida; um stream
infinito de `y\n` faz ele entrar em loop e produzir uma saída gigante e
ilegível. Use uma confirmação única: `printf 'y\n' | npx vercel projects rm <nome>`.

### Automação via GitHub Actions

`.github/workflows/deploy-storybook.yml` builda e publica o Storybook
sozinho a cada push relevante em `main`. Precisa do secret `VERCEL_TOKEN`
no repositório (Settings → Secrets and variables → Actions) — token gerado
em vercel.com/account/tokens, **nunca colado no chat**.

### Credenciais nunca passam pela conversa

Token da Vercel, token do Figma: sempre gerados pelo usuário e configurados
por ele mesmo (secret do GitHub, ou `export` no terminal dele) — a IA nunca
vê o valor.

### O app Next.js (`web/`) é o site que está no ar — os 4 cases antigos em HTML não são

Confirmado direto na Vercel (`get_project` no projeto `portfolio`): o
deploy publicado é o app Next.js, não o HTML estático da raiz. Isso quer
dizer que `cure-intelligence.html`, `hp-subscription.html`, `theodoor.html`
e `intuit-for-education.html` **dão 404 em produção hoje** — a Home nova
(`web/src/app/page.tsx`) ainda linka pra eles como `/cure-intelligence.html`,
um caminho que só existia no output estático antigo. Ainda não migrados pra
rotas reais dentro do app Next.js — ver task sugerida no chip da sessão que
criou o case ASTER.

**Implicação prática**: qualquer page novo que precise aparecer no site
publicado de verdade (como o case ASTER) precisa ser uma rota dentro de
`web/src/app/`, não um `.html` solto na raiz.

### Senha de case protegido: variável de ambiente + cookie assinado, não gate no cliente

O case ASTER (`web/src/app/cases/aster/`) introduziu o primeiro fluxo de
autenticação do projeto. Como o app roda num servidor de verdade (Next.js
na Vercel, não é HTML estático), deu pra fazer proteção real: a senha fica
numa env var (`ASTER_CASE_PASSWORD`, nunca no código), a checagem acontece
numa Server Action no servidor, e a sessão é um cookie `HttpOnly` **assinado
com HMAC usando a própria senha como chave** — sem assinatura, alguém
poderia só criar o cookie certo pelo DevTools e entrar sem saber a senha.
Ver `web/README.md` (seção "ASTER case — password setup") pra configurar.

**Padrão pra reaproveitar em um próximo case protegido**: `session.ts` (
assinatura/verificação) + `actions.ts` (Server Actions `unlock`/`lock`) +
`page.tsx` como Server Component que decide entre renderizar o gate ou o
conteúdo — o conteúdo protegido nunca é enviado no HTML pra quem não tem
cookie válido, então não tem nada pra achar "vendo o código-fonte".

---

## 6. Acessibilidade (WCAG AA)

Achados reais desta auditoria, e o porquê de cada um:

- **Sempre tenha um `<main>`** envolvendo o conteúdo principal da página —
  sem isso, leitores de tela não têm landmark de navegação nem "pular pro
  conteúdo".
- **Um card inteiro como um único `<a>` lê tudo como nome do link.** Se o
  card tem título + resumo + descrição + tags dentro de um só link, um
  leitor de tela lê o parágrafo inteiro ao dar Tab nele. Resolva com
  `aria-label` resumido (`"Ver case: [título]"`), mantendo o resto como
  conteúdo visual.
- **Área de toque mínima ~44×44px** pra elementos interativos no mobile
  (nível AAA na WCAG 2.1, mas boa prática recomendada pela Apple/Google
  independente do nível formal).
- **Contraste de texto secundário/muted é o que mais fica raspando o
  mínimo** (4.5:1 pra texto normal) — vale checar com uma conta real, não só
  "parece escuro o suficiente".
- O addon de acessibilidade do Storybook (`@storybook/addon-a11y`) pega boa
  parte disso automaticamente por componente — vale olhar a aba
  "Accessibility" de cada story.

---

## 7. Boas práticas gerais (valem pra qualquer projeto)

- **Prefira consultar a fonte de dados real a aproximar de memória** — vale
  pra design (Figma), pra escopo de API (documentação do endpoint), pra
  configuração de qualquer ferramenta que mudou de versão recentemente.
- **Verifique visualmente depois de cada mudança visual** — captura de tela
  no navegador, não só "o código parece certo". Bugs de renderização (like
  o SVG codificado duas vezes) não geram erro nenhum, só um resultado
  visualmente errado.
- **Ao publicar um link "permanente" via CLI, prefira o mecanismo que
  acompanha deploys futuros automaticamente** ao invés de um alias
  apontado à mão pra um deployment específico — a diferença entre os dois
  não é óbvia até o link parecer "parado no tempo".
- **Cuidado com ferramentas de CLI com prompt interativo dentro de
  automação** — `yes | comando` parece uma forma segura de auto-confirmar,
  mas quebra com prompts que re-renderizam.
- **Ao errar/aprender algo que vai se repetir, registre como uma Skill**
  (ou documento equivalente no seu tooling) em vez de confiar em lembrar da
  próxima vez — principalmente coisas específicas de um projeto (nome de
  projeto na Vercel, fileKey do Figma, convenção de conteúdo) que ninguém
  adivinha de fora.
- **Ao fazer contas de layout responsivo (colunas, min-width), calcule os
  dois extremos** (quantas colunas cabem, quantas não cabem) em vez de só
  testar um breakpoint e assumir que o resto segue igual.

---

## 8. Referência rápida

- Figma file key: `zpaQNzgjhG5ZKafe2cxnkm`
- Vercel: site principal = projeto `portfolio` (time `deiver`, era
  `deiver-team`); Storybook = projeto `portfolio-storybook`.
- Link limpo do site: `portfolio-deiver.vercel.app` (registrado como Domain,
  segue produção automaticamente).
- Link do Storybook: `portfolio-storybook-ten.vercel.app`.
- Breakpoints usados no CSS: Mobile `max-width: 599px`, Tablet
  `max-width: 1024px`, acima disso é Desktop.
- Tokens de espaçamento mudam de valor por breakpoint (ex:
  `--space-700`: 24px Desktop / 27px Tablet / 30px Mobile) — ver
  `web/src/styles/tokens.css`.
