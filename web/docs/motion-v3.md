# Motion V3 — contrato canônico

**Estado:** direção e calibragem v1 aprovadas; integração por página em andamento.  
**Atualizado em:** 28/09/2026.  
**Escopo:** Home, About, cases e componentes compartilhados do Portfolio V3.

Este é o contrato operacional de motion do V3. Use-o antes de criar uma animação, story ou trigger de
scroll. O `V3-HANDOFF.md` mantém o plano geral; o `NORTE.md` preserva o racional e a história. Os HTMLs
de visualização de 13/09 são evidência histórica, não dependência de implementação.

## 1. Regra do sistema

O V3 usa quatro primitivas reutilizáveis e, no máximo, um delight dominante por página:

1. `Hero Intro` — somente a Home executa a abertura completa de marca.
2. `Section Entry` — eyebrow/brackets, título e corpo entram como uma unidade.
3. `Media Reveal` — uma abertura principal por viewport; mídias de apoio usam uma entrada curta.
4. `Card Hover/Focus` — feedback local e contido para cards interativos.

Princípios obrigatórios:

- scroll permanece nativo; sem smooth scroll global, pinning longo ou leitura dependente do progresso;
- entradas executam uma vez por montagem e não desaparecem quando saem do viewport;
- nenhuma decoração fica em loop contínuo;
- uma revelação signature por viewport; o restante usa movimento curto ou permanece estático;
- hover existe somente com `(hover: hover) and (pointer: fine)` e deve ter equivalente funcional em
  `focus-visible` quando o elemento for interativo;
- touch não simula hover;
- `prefers-reduced-motion: reduce` entrega diretamente o estado final, sem reproduzir a coreografia em
  `1ms`;
- timers, frames e observers são cancelados no unmount, mudança de rota ou aba oculta.

## 2. Onde cada movimento é validado

| Tipo | Fonte de verdade | Exemplos |
|---|---|---|
| Estado de componente | Storybook | hover, pressed, focus, menu, accordion |
| Combinação reutilizável | specimen no Storybook | Eyebrow + Section Entry; Media Reveal |
| Sequência dependente da página | página integrada | handoff do Hexagon, stagger do hero, triggers de scroll |
| Delight experimental | specimen antes da página | partículas em “Spark” |

Uma story prova a peça. A página prova a coreografia. Não aprovar uma sequência de página apenas pela
story e não duplicar a implementação da primitiva dentro de cada página.

## 3. Tokens existentes

Usar os tokens de `web/src/app/globals.css`; não criar uma segunda escala local:

| Token | Valor atual | Uso principal |
|---|---:|---|
| `--dur-instant` | `120ms` | cor e borda |
| `--dur-fast` | `240ms` | controles pequenos |
| `--dur-base` | `380ms` | brackets, cards e painéis |
| `--dur-hero-reveal` | `600ms` | entrada de grupos do hero |
| `--dur-slow` | `700ms` | entrada em viewport e mídia de apoio |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | entradas e feedback geral |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | abertura rápida de brackets/faixa |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | expansão estrutural do hero/mídia |

Os tokens colapsam para `1ms` como rede de segurança em movimento reduzido. Componentes ainda precisam
renderizar explicitamente o estado final para que a sequência intermediária não seja executada.

## 4. Contratos das primitivas

### 4.1 Hero Intro — Home

- O `HexagonIntro` em direção `reverse` termina no retângulo que inicia o handoff para o hero.
- Após o hexágono resolver no quadrado, o retângulo expande horizontalmente em `300ms` com `--ease-out-expo` e verticalmente em `350ms` com
  `--ease-in-out-quart`, sem hold entre as fases.
- Gradiente, grafismo e lettering de fundo já existem no campo do hero; não recebem entrada própria.
- Depois que o campo se estabelece, NavBar e grupos de conteúdo entram em `600ms`, com `60ms` entre
  grupos, `opacity` e `translateY(14px)`; no mobile o deslocamento é `8px`.
- A abertura completa roda apenas na primeira visita concluída da sessão. Registrar conclusão em
  `sessionStorage`; retornos à Home entregam o hero final.
- Em movimento reduzido, pular identidade e handoff e renderizar imediatamente o hero completo.
- O antigo `introHoldMs` terminal é substituído pelo handoff; nunca somado a ele.

**Ordem de integração:** construir e aprovar primeiro o estado final estático do hero; somente depois
integrar os commits aprovados da branch `codex/hexagon-intro-step14`.

### 4.2 Section Entry

- Brackets começam juntos, com leitura momentânea de hexágono, e se afastam revelando o eyebrow.
- Brackets/eyebrow: `380ms`, `--ease-out-expo`.
- Título começa em `160ms`; corpo começa `60ms` depois do título.
- Título e corpo: `600ms`, `--ease-out-quart`, com `14px` desktop/tablet e `8px` mobile.
- Trigger: `IntersectionObserver`, `threshold: 0.15`, `rootMargin: 0px 0px -10% 0px`.
- Executa uma vez por montagem. Em movimento reduzido, todo o conjunto nasce no estado final.

### 4.3 Media Reveal

**Principal:** quatro quase-brackets formam um hexágono central; a mídia nasce como faixa horizontal,
expande verticalmente e resolve crop/blur enquanto os símbolos chegam aos cantos e desaparecem.

- faixa horizontal: `380ms`, `--ease-out-expo`;
- expansão vertical: `700ms`, `--ease-in-out-quart`;
- resolução visual/brackets: `240ms`, `--ease-out-quart`, sobreposta aos `240ms` finais;
- duração percebida: aproximadamente `1.08s`;
- quando pertence à mesma composição da Section Entry, começa `120ms` depois do título;
- máximo de uma abertura principal por viewport.

**Apoio:** `opacity` e translate curto em `700ms`, sem brackets, faixa ou blur. Grupos podem usar `60ms`
de intervalo, limitados a três passos.

### 4.4 Card Hover/Focus

- mídia pode escalar até `1.02` em `380ms`, `--ease-out-quart`;
- cor e borda respondem em `120ms`;
- acento local — bracket, borda ou seta — pode se intensificar;
- card passivo não ganha deslocamento, cursor ou affordance falsa;
- card clicável deve manter foco visível e comportamento equivalente por teclado;
- em touch, usar somente o estado pressionado/selecionado necessário.

`CapabilitiesV3` aplica a versão passiva deste contrato: a superfície muda de creme para branco e a
ilustração escala `1.02`, com saturação/contraste mínimos, em `380ms`. O card não recebe cursor,
sombra, elevação, deslocamento nem foco, porque não possui ação.

### 4.5 Button Hover/Focus

- `ButtonV3` Primary usa um wipe vertical tom-sobre-tom inspirado na mecânica `button--pan`: a camada
  do estado de repouso sobe e revela o tom de hover já presente sob ela;
- a cor da label e dos ícones permanece constante; não usar `mix-blend-mode` no conteúdo;
- duração `380ms`, `--ease-out-quart`; hover somente com pointer fino e equivalente em
  `focus-visible`;
- contexto Default revela `surface/neutral/inverse/subtle`; contexto Inverted revela
  `surface/neutral/subtle`; pressed continua usando o token `strong` correspondente;
- Secondary e Tertiary mantêm o feedback curto de overlay: o wipe pertence somente ao botão
  preenchido;
- em movimento reduzido, a mudança de estado é imediata.

`CaseCardLargeV3` já possui a transição básica de hover no Storybook. Sua validação responsiva e por
tipo de entrada ocorre antes da integração definitiva na Home.

## 5. Motion por página

### Home

- uma abertura completa no hero;
- Selected Work usa Section Entry e Card Hover/Focus;
- Brands entra como um único grupo;
- Capabilities concentra o delight dominante, sem loop;
- About/CTA fecha com cadência curta;
- Footer permanece estático, salvo o futuro easter egg localizado em “Spark”.

### About

- página mais quieta que a Home;
- hero usa Section Entry + Media Reveal;
- facts entram como grupo;
- Biography usa stagger curto entre texto e mídia;
- Capabilities reutiliza o comportamento da Home;
- eventual parallax local de `What I believe` fica desligado em touch/coarse pointer.

### Cases

- Hero orienta com mídia-chave, sem repetir a abertura completa da Home;
- Context e Key Decisions usam mídia de apoio;
- Validation usa Eyebrow/Section Entry e cards calmos;
- Outcome concentra o delight editorial;
- Reflection e CTA concluem sem nova assinatura.

O accordion de Key Design Decisions é manual, mantém um item aberto e usa painel `380ms` e crossfade de
mídia `700ms`. O header é `button` com `aria-expanded`, `aria-controls` e foco visível.

## 6. Footer — partículas em “Spark”

`Spark` continua texto HTML real. Um canvas decorativo pode cobrir somente o bounding box da palavra.
O efeito não bloqueia o primeiro release e só será integrado depois de um specimen isolado aprovado.

- touch/coarse pointer ou movimento reduzido: texto estático, sem inicializar partículas;
- mouse/trackpad preciso: hover curto e sutil, com dispersão inicial de `0.25–0.35em`;
- amostragem inicial em passos de `2–3px`, com teto definido em hardware real;
- `requestAnimationFrame` roda apenas durante hover e recomposição;
- observar a palavra com `ResizeObserver`, limitar DPR após medição e limpar todos os recursos no unmount;
- nunca adicionar `tabindex` ou papel de botão a uma palavra que não possui ação.

## 7. Estado de implementação em 27/09/2026

| Área | Estado |
|---|---|
| Tokens globais de motion | existentes |
| `ButtonV3` Primary hover/focus | wipe vertical tom-sobre-tom implementado e validado nos contextos Default/Inverted |
| `CapabilitiesV3` hover passivo | superfície + escala interna implementadas; sem affordance de clique |
| `CaseCardLargeV3` hover | implementado no Storybook; validação integrada pendente |
| `FooterV3` | estático e pronto; `Spark` pendente e não bloqueador |
| `HexagonMorph` | specimen WebGL em loop; não substitui o `HexagonIntro` e não deve ser integrado como abertura da Home |
| `HexagonIntro` | portado da branch isolada para o worktree V3 e usado somente pelo specimen `HomeIntroV3` |
| `HexagonBracket` | portado para o worktree V3 e usado pelo `EyebrowV3`; o traço compacto usa 1,5px sem alterar o specimen grande |
| `EyebrowV3` | implementado e validado no Storybook; aplicado ao About da Home com trigger único por montagem |
| Section Entry | `SectionEntryV3` implementado e integrado a Selected Work, Brands, Capabilities e About; Media Reveal permanece pendente |
| Hero final estático da Home | specimen `HomeHeroV3` implementado no Storybook; integração na página pendente |
| Handoff intro → hero | specimen `HomeIntroV3` aprovado por Deiver em 27/09; pronto para integração na Home |
| Orquestração por scroll/página | entrada básica integrada à Home; delight de Capabilities e Media Reveal permanecem pendentes |

Áreas modificadas por outra frente no worktree devem ser preservadas. Não portar componentes de motion
por cópia cega nem editar simultaneamente os mesmos arquivos.

O `HomeContent.tsx` presente no worktree ainda representa a Home anterior e usa componentes legados,
copy local e apenas dois cases destacados. Ele é referência de migração, não o destino da Home V3.
O novo `HomeHeroV3` está isolado, usa `NavBarV3`, catálogo tipado e `HOME_ASSETS`, sem alterar a página
atual nem produção.

O `HomeIntroV3` porta o `HexagonIntro` aprovado para o worktree V3 e implementa somente a camada de
orquestração faltante: execução `reverse` sem o hold terminal antigo, expansão horizontal e vertical do
quadrado, entrada escalonada dos três grupos do hero, memória em `sessionStorage` e salto direto ao
estado final em `prefers-reduced-motion`. O specimen usa `sessionKey={null}` para permitir replay;
produção usa a chave padrão e executa uma vez por sessão concluída.

**Aprovação visual:** Deiver aprovou a sequência completa sem ajustes em 27/09/2026. Não reabrir
timings, direção, expansão ou stagger sem nova evidência observada na Home integrada. O próximo gate é
confirmar que a composição real preserva a mesma sensação e o mesmo estado final do specimen.

**Referências recebidas em 27/09:** `2262:61722` (desktop wide, 1993×790) e `2262:61863`
(desktop narrow, 1327×790). Elas definem apenas o estado final desktop. Tablet e mobile continuam
pendentes de frames próprios; o fallback do specimen não deve ser tratado como contrato visual final.

## 8. Critérios de aceite

Antes de promover uma primitiva ou página:

- estado final correto com JavaScript indisponível quando aplicável;
- movimento reduzido entrega o estado final sem coreografia;
- touch não recebe hover simulado;
- teclado mantém foco visível e não depende da animação;
- sem timers, frames ou observers ativos depois de unmount/aba oculta;
- sem layout shift causado pela animação;
- conteúdo EN/PT testado nos limites `599/600` e `1023/1024`;
- Storybook valida a peça e Preview valida a sequência real;
- nenhum movimento bloqueia leitura, navegação ou scroll nativo.

## 9. Referências históricas

- `NORTE.md`, seção “Motion v3 — direção macro aprovada em 14/set”.
- `V3-HANDOFF.md`, seção de Motion e plano de implementação.
- Visualizações históricas: `motion-direction-v3.html`, `motion-map-v3.html` e
  `motion-orchestration-v3.html` em
  `/Users/deiverbrito/.codex/visualizations/2026/09/13/01a09b6d-b278-7763-87fe-3b200ad148c5/`.

Os arquivos externos não são necessários para retomar a implementação; servem apenas para conferir o
racional visual original.
