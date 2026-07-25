# Playbook: Design Systems no Figma + IA (Claude / Cowork / Claude Code)

> Guia de referência escrito a partir do trabalho real feito no design system
> do portfólio do Deiver (arquivo Figma `zpaQNzgjhG5ZKafe2cxnkm`). Cada seção
> parte de um exemplo concreto que já aconteceu no projeto e só depois nomeia
> o conceito — porque é assim que fica mais fácil de fixar.

---

## 1. Tokens: primitivo → semântico → uso

**Exemplo real do projeto:** a cor `#7C7140` (um dourado apagado) nunca é
escrita direto num elemento. Ela vive em três camadas:

1. **Primitivo** — `secondary/secondary-500` = `#7C7140`. Só um valor de cor
   numa rampa (100 a 900, do mais claro ao mais escuro). Não diz nada sobre
   *onde* usar.
2. **Semântico** — `content/accent` = alias pra `secondary/secondary-500`.
   Agora tem um nome de *papel*: "texto de destaque".
3. **Uso** — o texto "PRÓXIMO CASE" é ligado a `content/accent`, nunca ao hex
   nem à rampa primitiva direto.

Por que essa camada extra existe: se `content/accent` precisar mudar de tom
um dia, você muda **um lugar** e todo o site atualiza. Se tivesse usado o hex
direto em 179 lugares, seria 179 edições manuais.

**Regra de ouro que aprendemos na prática:** todo token semântico de cor
precisa ser um *alias* pra um primitivo — nunca um hex cru. Descobrimos 4
tokens (`content/muted`, `content/on-dark-secondary`, `content/on-dark-primary`,
`border/tag`) que tinham hex direto, e tivemos que criar rampas novas
(`tertiary`, `muted`) só pra dar um "lar" primitivo pra essas cores.

Referência oficial: [Figma — Guide to variables](https://help.figma.com/hc/en-us/articles/14506821864087-Guide-to-variables-in-Figma)

---

## 2. Modes: como light/dark e breakpoints são a mesma ferramenta

**Exemplo real:** nosso token `Spacing` tem 3 *modes* — Desktop, Tablet,
Mobile — cada um com seu próprio valor pra `space-100`, `space-200` etc. O
componente não muda de estrutura entre telas, só o *modo ativo* muda o
valor que os tokens resolvem.

O mesmo mecanismo serve pra tema: uma collection `Theme` com modes `Light` /
`Dark` (ou `Brand A` / `Brand B`) troca só os valores, não o desenho. É por
isso que **modes** (não duplicar componentes) é a ferramenta certa tanto
pra responsividade quanto pra dark mode — e no nosso caso ainda não fizemos
dark mode, mas a estrutura de tokens já está pronta pra receber um mode novo
sem redesenhar nada.

Referência oficial: [Figma — Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)

---

## 3. Auto Layout: fazer o componente esticar sem quebrar

**Bug real que caímos:** ao criar o `CapabilityLensCard` com
`figma.createAutoLayout()`, os containers internos (`Content`,
`RelatedList`) vieram com fundo branco por padrão do Figma. Como o texto
também era branco (`content/on-dark-primary`), o texto sumiu — parecia bug
de cor, mas era um container escondendo o outro. Corrigido com
`fills = []` explícito em cada container aninhado.

Lição prática de auto-layout pra componentes responsivos:

- **Resizing**: cada camada precisa decidir entre `Fixed` (tamanho travado),
  `Hug contents` (encolhe/cresce com o conteúdo) ou `Fill container`
  (ocupa o espaço do pai). Um botão, por exemplo, geralmente é `Hug` na
  largura (some com o texto) e `Fixed` ou `Hug` na altura.
- **Padding em tokens, não em número solto**: todo padding interno de um
  componente deveria vir de `space-*`, não de "16px" escrito à mão — senão
  o componente não acompanha o resto do sistema quando o espaçamento mudar.
- **Auto-layout aninhado**: containers dentro de containers herdam
  comportamento do Figma (como o fundo branco default) se você não
  configurar cada nível. Sempre confira o nível mais interno, não só o
  container principal.

Referência oficial: [Figma — Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout)

---

## 4. Contraste AA (WCAG) — não basta "parecer" legível

**Bug real e mais caro do projeto:** o card "Próximo Case" tinha o texto
"PRÓXIMO CASE" em dourado (`content/accent`, #7C7140) sobre um fundo verde
escuro (#1C5550). Contraste real: **1,74:1**. O mínimo pra texto normal é
**4,5:1**. Isso não é "podia ser melhor" — é ilegível pra boa parte dos
usuários, inclusive quem não tem nenhuma deficiência visual, só um monitor
mais escuro ou sol na tela.

A fórmula (resumida): calcula a luminância relativa das duas cores e divide
a mais clara pela mais escura (+ uma constante). Não precisa fazer de
cabeça — existe ferramenta pra isso.

**A armadilha que quase caímos:** meu primeiro instinto seria "clarear o
dourado". Mas esse mesmo token (`content/accent`) já era usado em 171
outros lugares do site, todos em fundo *claro*, onde passava em 4,57:1 —
já quase no limite. Clarear o token pra salvar o card escuro teria
quebrado essas 171 ocorrências. A solução certa foi criar um **token novo**
(`content/accent-on-dark`, um degrau mais claro da mesma rampa,
`secondary-200`) só pra contexto escuro, sem tocar no original.

Regra prática: **um token de cor só é seguro se você souber, com dado real,
em quais fundos ele aparece.** Antes de "consertar", audite todos os usos.

Limites AA:
- Texto normal: **4,5:1**
- Texto grande (≥24px, ou ≥18,66px em negrito): **3:1**

Referências oficiais:
- [WCAG 2.2 — Contrast (Minimum), critério 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) (cola o hex dos dois lados e ele já diz se passa)

---

## 5. Área clicável — o tamanho do "alvo", não só do ícone visível

Ainda não mexemos nisso diretamente neste projeto, mas é o próximo tipo de
bug que provavelmente vamos encontrar (ícones de seta ao lado de link, por
exemplo, tendem a ter a área clicável do tamanho do glifo, bem menor que o
recomendado).

Regra: o **alvo clicável** (não o ícone visual) precisa ter no mínimo
**24×24px CSS** pelo WCAG 2.2 (nível AA, critério 2.5.8). Guias de
plataforma são mais rígidos: Material recomenda 48×48dp, Apple recomenda
44×44pt. Na prática, isso quer dizer: um ícone de 16px pode (e deve) ter
um "padding invisível" clicável ao redor dele — não redesenhar o ícone
maior, só aumentar a área que reage ao clique/toque.

No Figma, isso normalmente é resolvido com auto-layout: o frame clicável
(não o vetor do ícone) tem padding suficiente pra bater o mínimo, mesmo que
visualmente o ícone continue pequeno.

Referências oficiais:
- [WCAG 2.2 — Target Size (Minimum), critério 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Material Design — Touch targets](https://m2.material.io/develop/web/supporting/touch-target) (48×48dp)
- [Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout) (44×44pt)

---

## 6. Nomenclatura semântica de componentes e variants

**Exemplo real:** `Link/Tertiary` tem uma variant property `context` com
valores `light` / `dark`. Isso não é um nome técnico arbitrário — é
legível por qualquer designer que abrir o arquivo: "esse é o link
terciário, e ele tem uma versão pra fundo claro e uma pra fundo escuro".

**Erro que corrigimos:** originalmente, links terciários como "Ver case",
"Ver todos", "Abrir índice completo de trabalhos" e "Leia mais sobre mim"
tinham 3 cores diferentes (`text-primary`, `text-secondary`, `heading`),
mesmo sendo semanticamente o *mesmo componente* (mesmo peso visual, mesma
função). A causa raiz: eles nunca tinham sido nomeados/agrupados como um
componente único — cada instância foi feita "à mão" copiando um frame
parecido, e a cor foi divergindo aos poucos.

Convenção de nomenclatura que usamos (hierarquia por barra):

```
Categoria/Subcategoria/Nome
ex: action/tertiary/content
ex: Link/Tertiary        (nome do componente, variant "context" dentro dele)
```

Isso cria pastas automáticas no painel do Figma e deixa claro, só pelo
nome, qual é a família e o papel de cada peça — sem precisar abrir o
componente pra descobrir.

Referência oficial: [Figma — Name and organize components](https://help.figma.com/hc/en-us/articles/360038663994-Name-and-organize-components)

---

## 7. Propriedade booleana vs. Variant — quando usar cada uma

**Exemplo real:** `FilterChip` tem uma variant property `selected` com
valores `true`/`false` — tecnicamente isso *é* uma boolean property, só
modelada como variant porque queríamos trocar toda a aparência (fundo,
borda, cor do texto) de uma vez, não só ligar/desligar um elemento
isolado.

Regra prática pra decidir:

- **Variant property**: quando ligar/desligar a opção muda **várias
  propriedades ao mesmo tempo** (cor de fundo + cor de texto + borda, por
  exemplo). Cada combinação é desenhada por você, então o resultado é
  sempre previsível.
- **Boolean property**: quando a opção só **mostra/esconde uma camada**
  específica dentro do componente (ex: "tem ícone?", "tem badge de
  notificação?"). Mais barato de manter porque não precisa desenhar uma
  variante nova pra cada combinação.

Um componente complexo geralmente combina os dois: `CaseCardLarge`, por
exemplo, poderia ter uma variant `size` (Large/Small) e, dentro dela, uma
boolean `hasImage` pra ligar/desligar a camada de imagem sem precisar de
uma variant separada só pra isso.

Referência oficial: [Figma — Create and manage component properties](https://help.figma.com/hc/en-us/articles/8883756012823-Create-and-manage-component-properties)

---

## 8. Pensando em Code Connect desde o Figma

**Por que isso importa desde já:** cada componente que construímos no
projeto (`Tag`, `Button`, `Link/Tertiary`, `CaseCardLarge`...) foi montado
como se já fosse virar um componente React — variant properties viram
props (`context="dark"` → `<LinkTertiary context="dark">`), boolean
properties viram props booleanas, e a hierarquia de nomes já reflete como
os componentes vão se importar uns dentro dos outros no código (`Tag` e
`Link/Tertiary` como instâncias dentro de `CaseCardLarge`, do mesmo jeito
que um componente React importa outro).

Isso significa: nomeie no Figma pensando em como o dev (ou você mesmo, no
futuro) vai ler isso como prop de código. Evite nomes como "Variant 1" /
"Variant 2" — prefira nomes que já são quase o nome da prop.

Referência oficial: [Figma — Code Connect docs](https://developers.figma.com/docs/code-connect) ·
[Figma Dev Mode MCP Server](https://developers.figma.com/docs/figma-mcp-server/) (é o que permite o Claude Code puxar contexto de design direto do Figma pro código)

---

## 9. Como pedir bem pro Claude / Cowork / Claude Code analisarem uma interface e montarem um design system

Esse foi o maior aprendizado prático do projeto inteiro — não é sobre
Figma, é sobre **como orquestrar a IA** pra fazer esse trabalho direito.

### 9.1 Peça dado real antes de token

Erro que cometemos mais de uma vez: assumir um valor (achei que o botão
usava `primary-700`) sem checar o arquivo real, que na verdade usava
`gray-900`. A forma certa de pedir: **"antes de propor os tokens, escaneie
os valores reais usados no arquivo e me mostre a lista — não invente com
base no que é comum em outros projetos."** Isso vale pra site existente, um
link do v0, ou um arquivo do Figma Make: sempre peça escaneamento primeiro,
proposta depois.

### 9.2 Peça análise semântica antes de agrupar por cor

O pedido que mais mudou a qualidade do resultado foi: **"antes de criar os
tokens, me diga qual é o *papel* de cada elemento (é um botão? é uma pill?
é um link terciário?), não só a cor que ele usa hoje."** Foi assim que
descobrimos que 4 links terciários tinham cores diferentes por acidente —
se tivéssemos ido só por cor, a IA teria criado 3 tokens onde deveria ter
criado 1.

### 9.3 Peça o plano antes da execução em massa

Sempre que uma mudança ia afetar muitos elementos de uma vez (aplicar
tokens em 6 páginas, por exemplo), o pedido certo foi: **"me mostra o plano
e a ordem antes de aplicar em tudo — quero aprovar antes."** Isso evitou
pelo menos 3 bugs que só apareceram por causa de "fallback genérico": a IA
aplicando uma regra ampla demais (tipo "toda borda não identificada vira
`border/default`") que acertou a maioria mas quebrou casos específicos
(ícones de seta que deveriam seguir a cor do texto vizinho, não virar
cinza).

### 9.4 Trabalhe em lotes pequenos e verificáveis, não tudo de uma vez

A sequência que funcionou: **1 frame pequeno primeiro → verificar →
corrigir o que der errado → só então replicar o padrão pros outros 7.**
Se tivéssemos aplicado em todas as páginas de uma vez, o mesmo bug (ícone
tratado como borda) teria se espalhado 8x antes de alguém notar.

### 9.5 Peça auditoria cruzada antes de "consertar"

Pro bug de contraste do "Próximo Case", o pedido certo não foi "deixa esse
dourado mais claro" — foi **"antes de mudar, verifique todos os lugares
onde esse token aparece, separando por contexto claro/escuro, pra eu saber
se a correção aqui vai quebrar algo em outro lugar."** Esse tipo de pedido
transforma um conserto pontual (que quase sempre cria um bug em outro
canto) numa correção sistêmica.

### 9.6 Autorize criação de token novo quando fizer sentido, mas peça justificativa

Deixe explícito: **"se um token não servir pros dois contextos, pode criar
um novo — mas me explique por que o existente não bastava."** Isso evita
dois extremos ruins: a IA forçar um token só (quebrando um dos dois usos)
ou criar tokens novos toda hora sem necessidade real (inflando o sistema).

### 9.7 Human-in-the-loop: onde pedir confirmação, sempre

Pontos que **sempre** merecem uma pausa pra você decidir, não a IA sozinha:

- Decisão que afeta muitos lugares de uma vez (rollout em massa).
- Ambiguidade de papel semântico ("isso é botão ou link?" quando o
  arquivo original não deixa claro).
- Nome de token novo (nomes carregam decisão de arquitetura, vale seu
  aval).
- Qualquer correção de bug que **pode** ter efeito colateral em outro
  lugar (como o caso do dourado).
- Decisão de apagar/consolidar algo que já existe (como o frame duplicado
  `1.0-Home-PT` que encontramos — a IA sinalizou e esperou confirmação em
  vez de apagar sozinha).

Referências gerais sobre as ferramentas:
- [Claude Code — documentação oficial](https://docs.claude.com/en/docs/claude-code/overview)
- [Claude Cowork — primeiros passos](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- [Model Context Protocol (MCP) — o que é](https://www.anthropic.com/news/model-context-protocol)

---

## 10. Checklist rápido pra revisar qualquer componente novo

Antes de considerar um componente "pronto" no design system:

1. Toda cor usada é alias de primitivo? (nenhum hex cru)
2. Todo espaçamento vem de `space-*`, não de número solto?
3. O nome segue a hierarquia semântica (`Categoria/Nome`, variants com
   nome de papel, não "Variant 1")?
4. Testei o auto-layout com texto curto **e** longo (o componente
   estica/encolhe direito nos dois)?
5. Checei contraste de todo texto contra o fundo **real** onde ele
   aparece (não só isolado)?
6. Se é clicável, a área de clique bate 24×24px no mínimo?
7. As variants/booleans têm nome que já faz sentido como prop de código?
8. Se esse token/cor for reusado em outro contexto (claro↔escuro), ele
   ainda passa contraste lá, ou precisa de uma variante dedicada?

---

## Referências (todas)

- [Figma — Guide to variables](https://help.figma.com/hc/en-us/articles/14506821864087-Guide-to-variables-in-Figma)
- [Figma — Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)
- [Figma — Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout)
- [Figma — Create and manage component properties](https://help.figma.com/hc/en-us/articles/8883756012823-Create-and-manage-component-properties)
- [Figma — Name and organize components](https://help.figma.com/hc/en-us/articles/360038663994-Name-and-organize-components)
- [Figma — Code Connect docs](https://developers.figma.com/docs/code-connect)
- [Figma — Dev Mode MCP Server](https://developers.figma.com/docs/figma-mcp-server/)
- [WCAG 2.2 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Material Design — Touch targets](https://m2.material.io/develop/web/supporting/touch-target)
- [Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Claude Code — documentação oficial](https://docs.claude.com/en/docs/claude-code/overview)
- [Claude Cowork — primeiros passos](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- [Model Context Protocol — anúncio oficial](https://www.anthropic.com/news/model-context-protocol)
