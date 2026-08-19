# Sistema tipográfico

Esta especificação separa duas coisas diferentes:

- **Font size variables** guardam apenas os tamanhos responsivos.
- **Text Styles** combinam família, peso, tamanho, line-height, letter-spacing e transformação.

Os primitivos numéricos são preservados. Nos papéis que continuam como fonte display, a troca
de família usa uma conversão óptica comum; exceções existem somente quando a composição real
ou um valor já validado no Figma exige outro resultado.

## Fundação de tamanho

| Scale | Desktop (px) | Tablet (px) | Mobile (px) |
| --- | ---: | ---: | ---: |
| `Scale/100` | 8 | 9 | 10 |
| `Scale/200` | 11 | 12.5 | 14 |
| `Scale/300` | 12 | 13.5 | 15 |
| `Scale/400` | 13 | 14.5 | 16 |
| `Scale/500` | 14 | 16 | 17.5 |
| `Scale/600` | 16 | 18 | 20 |
| `Scale/700` | 26 | 26 | 22.1 |
| `Scale/800` | 32 | 32 | 27.2 |
| `Scale/900` | 48 | 40 | 30 |

Os degraus são uma infraestrutura numérica. Eles não dizem que Renamor, DM Sans e DM Mono
têm o mesmo tamanho óptico quando recebem o mesmo número. Essa decisão pertence ao Text Style,
que registra a família e deve ser calibrado visualmente.

Os aliases existentes `Role → Scale` são idênticos nos três modos do Figma: o papel continua
apontando para o mesmo degrau em Desktop, Tablet e Mobile; quem muda de valor entre os modos é
o próprio `Scale`. O código preserva essa relação. Exceções ópticas novas (`Display/Hero`,
`Display/Hero Long`, `Display/CTA`, `Display/Page`, `Display/Case Hero`, `Display/Capability` e os headings compactos) vivem numa camada tipográfica
separada até serem formalizadas como variáveis no Figma.

## Conversão óptica Boldonse → Renamor

A Renamor ocupa menos largura e tem uma caixa visual mais curta que a Boldonse no mesmo
`font-size`. A relação validada no hero da home é `32px → 72px`, portanto todos os antigos
papéis Boldonse que continuam como Renamor partem do fator `2.25×` (`+125%`):

| Degrau antigo | Desktop | Tablet | Mobile |
| --- | ---: | ---: | ---: |
| `Scale/900 × 2.25` | 108px | 90px | 67.5px |
| `Scale/800 × 2.25` | 72px | 72px | 61.2px |
| `Scale/700 × 2.25` | 58.5px | 58.5px | 49.725px |

Esses valores vivem em `typography.css` como degraus convertidos. Os papéis semânticos
apontam para eles, em vez de receber calibrações independentes:

- `Display/Hero` e `Display/Case Hero` vêm do antigo `Scale/800`;
- `Display/Page` vem do antigo `Scale/700`;
- `Display/Capability` vem do antigo `Scale/900`;
- a entrelinha display de 80% no Figma vira `line-height: 0.8` no CSS;
- títulos compactos usam DM Sans 700, caixa alta, em vez da fonte display;
- títulos Renamor usam uma única inicial cursiva: `DisplayText` converte visualmente a
  primeira letra para uppercase e todo o restante para lowercase, inclusive `I`, nomes
  próprios e siglas. O texto original permanece intacto no HTML e na leitura assistiva.
- marcas compostas que precisam preservar uma caixa tipográfica convencional continuam
  como exceção explícita em DM Sans 500 pela variante `brand`.

O hero da home usa o degrau convertido de `Scale/800`: 72px em desktop e tablet, 61.2px no
mobile, com line-height de 72% e largura máxima de 480px.

O título da home usa `Display/Hero Long`: acompanha o degrau calculado em tablet e desktop,
mas usa 48px no mobile para não transformar a frase inglesa em cinco linhas. A localização
portuguesa usa `Display/Hero Localized Long` em 42px, preservando a presença óptica sem
voltar à composição de quatro linhas com palavras isoladas.

O CTA final da home usa 72px (`4.5rem`) no desktop, valor validado no Figma; em tablet e
mobile volta ao degrau convertido de `Scale/700` (58.5px e 49.725px). Na página
Capabilities, `Scale/900 × 2.25` resulta em 108px no desktop, mas o valor validado no Figma
é 92px. Por isso esse papel tem teto de 92px; o tablet preserva o cálculo em 90px. No mobile,
o contexto inteiro usa 54px: é o maior valor comum que mantém todos os nove títulos em EN e
PT em no máximo duas linhas. O degrau convertido de 67.5px continua registrado como base.

Os títulos de página e seção usam `Display/Page`, derivado de `Scale/700`: 58.5px em desktop
e tablet, 49.725px no mobile. O hero longo do ASTER usa `Display/Case Hero`, derivado de
`Scale/800`: 72px em desktop e tablet. Como o texto do ASTER é muito mais longo que os demais
case heroes, ele usa `Display/Case Hero Long` em 48px no mobile; o degrau-base de 61.2px
continua disponível. A camada não altera `Scale/*` nem os aliases gerados do Figma.

## Títulos compactos em DM Sans

A Boldonse fazia títulos pequenos parecerem maiores do que o número declarado por causa da
largura, do peso aparente e da altura das capitais. Manter seus antigos `11–13px` após trocar
para DM Sans inverteu a hierarquia: alguns títulos ficaram menores que o próprio body.

| Text Style | Desktop / tablet | Mobile | Line-height | Tracking | Uso |
| --- | ---: | ---: | ---: | ---: | --- |
| `Heading/Compact Large` | 18px | 18px | 120% | 2% | títulos de seção, About e next case |
| `Heading/Case Card` | 18px | 18px | 19.5px | −1px em 18px | título principal de cada case card |
| `Heading/Compact Medium` | 16px | 18px | 19.5px em desktop | 0 | capability cards e decisões internas |

Os três usam DM Sans Bold e caixa alta. `Case Card` compartilha o tamanho de `Compact Large`,
mas mantém métricas próprias porque seus títulos são mais longos e precisam continuar em uma
linha quando houver espaço. Eyebrows e metadata permanecem em DM Mono e não devem ser usados
como token de tamanho para headings.

### Unidade no Figma e no código

O Figma preserva os números de referência em pixels. Na saída CSS, apenas os nove primitivos
de tamanho são convertidos para `rem`, usando a base padrão do navegador (`1rem = 16px`).
Assim, `Scale/600 = 16` vira `1rem` e `Scale/900 = 48` vira `3rem`.

Em 100% os valores renderizados permanecem idênticos ao Figma. Se a pessoa aumenta a fonte
raiz do navegador, a escala inteira acompanha a preferência. Os papéis semânticos continuam
aliases e nenhum dos 113 consumidores precisa conhecer a unidade usada pelo primitivo.

Não definir um `font-size` fixo em `html`: isso anularia o motivo de usar `rem`.

## Text Styles completos — estado implementado

Os tamanhos abaixo seguem a ordem Desktop / Tablet / Mobile. `Scale/*` continua vindo de
`tokens.css`; família, peso, line-height e tracking ficam em `typography.css`.

### Display

| Text Style | Família / peso | Tamanho | Line-height | Tracking | Caixa |
| --- | --- | --- | ---: | ---: | --- |
| `Display/Hero` | Renamor 400 | 72 / 72 / 61.2px | 72% | 0 | sentence case |
| `Display/Hero Long` | Renamor 400 | 72 / 72 / 48px | 72% | 0 | sentence case |
| `Display/Hero Localized Long` | Renamor 400 | 72 / 72 / 42px | 72% | 0 | sentence case |
| `Display/CTA` | Renamor 400 | 72 / 58.5 / 49.725px | 80% | 0 | sentence case |
| `Display/Capability` | Renamor 400 | 92 / 90 / 54px | 80% | 0 | sentence case |
| `Display/Case Hero` | Renamor 400 | 72 / 72 / 61.2px | 80% | 0 | sentence case |
| `Display/Case Hero Long` | Renamor 400 | 72 / 72 / 48px | 80% | 0 | sentence case |
| `Display/Page` | Renamor 400 | 58.5 / 58.5 / 49.725px | 90% | 0 | sentence case |
| `Display/Large` | Renamor 400 | 48 / 40 / 30px | 80% | 0 | sentence case |
| `Display/Medium` | Renamor 400 | 32 / 32 / 27.2px | 90% | 0 | sentence case |

### Headings funcionais

| Text Style | Família / peso | Tamanho | Line-height | Tracking | Caixa |
| --- | --- | --- | ---: | ---: | --- |
| `Heading/Compact Large` | DM Sans 700 | 18 / 18 / 18px | 120% | 2% | uppercase |
| `Heading/Case Card` | DM Sans 700 | 18 / 18 / 18px | 108.333% | −5.556% | uppercase |
| `Heading/Compact Medium` | DM Sans 700 | 16 / 16 / 18px | 121.875% | 0 | uppercase |
| `Heading/Medium` | DM Sans 700 | Scale/600 | 150% | 0 | caixa do conteúdo |

### Corpo e interface

| Text Style | Família / peso | Tamanho | Line-height | Tracking | Caixa |
| --- | --- | --- | ---: | ---: | --- |
| `Body/Large` | DM Sans 400 | Scale/600 | 160% | 0 | caixa do conteúdo |
| `Body/Medium` | DM Sans 400 | Scale/500 | 150% | 0 | caixa do conteúdo |
| `Body/Medium Emphasis` | DM Sans 500 | Scale/500 | 150% | 0 | caixa do conteúdo |
| `Body/Small` | DM Sans 400 | Scale/300 | 150% | 0 | caixa do conteúdo |
| `Label/Large` | DM Sans 500 | Scale/500 | 125% | 0 | caixa do conteúdo |
| `Label/Medium` | DM Sans 500 | Scale/300 | 125% | 0 | caixa do conteúdo |
| `Label/Small` | DM Sans 500 | Scale/200 | 125% | 0 | caixa do conteúdo |

### Dados e editorial

| Text Style | Família / peso | Tamanho | Line-height | Tracking | Caixa |
| --- | --- | --- | ---: | ---: | --- |
| `Data/Medium` | DM Mono 400 | Scale/300 | 150% | 0 | caixa do conteúdo |
| `Data/Medium Emphasis` | DM Mono 500 | Scale/300 | 150% | 0 | caixa do conteúdo |
| `Caption/Medium` | DM Mono 400 | Scale/300 | 150% | 0 | caixa do conteúdo |
| `Editorial/Eyebrow` | DM Mono 400 | Scale/200 | 140% | 8% | uppercase |
| `Editorial/Step Number` | DM Mono 500 | Scale/100 | 140% | 0 | numérico |

`DisplayText` preserva a capitalização semântica escrita no HTML, mas normaliza somente a
apresentação da Renamor: a primeira letra aparece em uppercase/cursiva e todas as seguintes
em lowercase/sans. Assim, pronomes como `I`, nomes próprios e siglas no meio da frase não
criam novas iniciais cursivas. A variante `remainder` mantém essa regra quando o componente
pai anima cada palavra separadamente, como no hero da Home. Títulos formados por uma marca composta em caixa alta, como
`CURE INTELLIGENCE / SCRIOO`, usam a variante `brand`: o texto original permanece intacto
no DOM, mas é apresentado como lowercase da Renamor — que visualmente corresponde à caixa
sans — para não ativar nenhuma inicial cursiva.

## Camadas no código

- `tokens.css`: arquivo gerado; preserva `Scale/*` e os aliases `Role → Scale` do Figma.
- `typography.css`: famílias, pesos, entrelinhas, tracking e compensações ópticas.
- CSS Modules: aplicam o papel semântico; não redefinem métricas numéricas do estilo.
- `check-tokens.mjs`: valida tokens declarados nas duas camadas sem confundir extensão autoral
  com a coleção gerada.

## Nomes no código

| Nome antigo | Nome novo |
| --- | --- |
| `--font-huge-title` | `--font-size-display-large` |
| `--font-hero-title` | `--font-size-display-hero` |
| `--font-h1-page-title` | `--font-size-display-page` |
| `--font-body-large-intro` | `--font-size-body-large` |
| `--font-subtitle` | `--font-size-body-medium` |
| `--font-ui-medium` | `--font-size-label-large` |
| `--font-h2-section-title` | `--font-size-heading-compact-large` |
| `--font-body` | `--font-size-data-medium` |
| `--font-body-emphasis` | `--font-size-data-medium-emphasis` |
| `--font-caption` | `--font-size-caption-medium` |
| `--font-eyebrow` | `--font-size-editorial-eyebrow` |
| `--font-step-number` | `--font-size-editorial-step-number` |

`Role/Heading/Small → Scale/400` permanece intacto na coleção gerada do Figma. Os títulos
compactos recalibrados para DM Sans usam papéis adicionais porque 13 / 14.5 / 16px não mantêm
a mesma hierarquia óptica que a Boldonse nesse contexto.

## Invariantes da migração

- A saída CSS usa `rem`, preservando o redimensionamento configurado pela pessoa no navegador.
- O Figma experimental informa a calibração óptica; conteúdo, breakpoints e componentes vêm do site atual.
- Um heading nunca reutiliza o tamanho de eyebrow ou metadata apenas porque ambos são compactos.
- Família, peso e line-height são definidos pelo papel: Renamor nos displays e DM Sans Bold nos títulos compactos.
- Famílias diferentes nunca são consideradas equivalentes apenas por compartilharem um número.

## QA automatizado

Com o servidor local ativo, `npm run check-typography` percorre 19 rotas em 375, 600, 788,
1024 e 1440px. O teste reprova quando a Renamor não carrega, um display fica abaixo de 1.5×
o maior body da página, surge mais de uma inicial cursiva, há overflow ou aparecem pelo menos
duas linhas consecutivas compostas por uma única palavra num título de três ou mais linhas.
