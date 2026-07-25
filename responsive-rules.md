# Regras de responsividade — grids de card (Portfolio 2026)

> Referência extraída do frame "fonte da verdade" da Home
> (`1.0-Home-PT-AutoLayotAndResponsivity-Good`, node `273:11194`, página
> "Kitchen" do arquivo Figma) e testada empiricamente em 3 larguras
> (Desktop 1685, Tablet 768, Mobile 390). Nenhuma dessas larguras é um
> breakpoint "oficial" travado no arquivo — são só os pontos de teste.

---

## 1. A regra, com exemplo concreto

**Antes de nomear o conceito, o que acontece na prática:** a fileira de
`CaseCardLarge` na Home tem 4 cards. Em 1685px de largura, ela mostra 3 por
linha (o 4º sozinho na linha de baixo). Redimensionando o mesmo frame pra
768px, ela virou 2 por linha. Redimensionando pra 390px, virou 1 por linha.

**Ninguém escreveu "em tablet, use 2 colunas".** O número de colunas nunca
está escrito em lugar nenhum — ele é uma *consequência* de 3 propriedades
configuradas uma vez:

1. A fileira (`Container:margin` que envolve os cards) é `layoutMode:
   HORIZONTAL` + `layoutWrap: WRAP` + `layoutSizingHorizontal: FILL` — ela
   ocupa a largura disponível e deixa os filhos quebrarem linha quando não
   cabem mais.
2. Cada card tem `layoutSizingHorizontal: FILL` — ele cresce pra dividir o
   espaço da linha igualmente com os vizinhos.
3. Cada card tem um **`minWidth`** — é esse número que decide quantos cabem
   por linha. Quando `larguraDaFileira ÷ (minWidth + gap)` cai abaixo de 2,
   o próximo card não cabe mais e quebra pra linha de baixo sozinho.

Esse é o mecanismo inteiro. Não existe breakpoint algum sendo lido — é
aritmética de auto-layout rodando a cada largura de tela.

---

## 2. Dois bugs reais encontrados testando (e já corrigidos)

Testar o frame da Home em 768px e 390px (em vez de só olhar pro Desktop)
achou 2 problemas que só apareciam nesses tamanhos:

### Bug 1 — `CaseCardLarge` transbordava no Mobile
O `minWidth` do card estava em **370px**, mas a largura útil da tela em
390px de frame (descontando margem) é de ~342px. O card ficava 28px mais
largo que o próprio container — transbordava.

**Primeira tentativa (errada):** baixei o `minWidth` pra 280 igual aos
outros cards. Resolveu o mobile, mas quebrou o desktop — a 1280px de
largura, 280 permite **4 cards lado a lado**, que é feio (foi o Deiver
quem notou e corrigiu na mão). Subir pra 410 pra forçar 3 no desktop
também não funciona: 410 é grande demais e quebra o tablet (força 1
coluna em vez de 2) e piora o mobile ainda mais.

**Fix real:** existe uma faixa de valores que resolve os 3 tamanhos *ao
mesmo tempo*, sem precisar de um valor diferente por breakpoint —
`minWidth: 310` testado e confirmado, usando a largura real de conteúdo
de cada frame (não uma estimativa):

| Largura de conteúdo | Colunas resultantes |
|---|---|
| 1280 (Desktop) | 3 |
| 652 (Tablet) | 2 |
| 342 (Mobile) | 1 (sem transbordar) |

**Duas rodadas até chegar no valor certo:** a primeira tentativa (330) foi
calculada em cima de uma largura de Tablet *estimada* (720px). Quando o
Deiver construiu o frame de Tablet de verdade à mão, a largura real de
conteúdo era 652px — mais estreita. Com 330, 2 cards não cabiam mais
nesses 652px (`2×330+20=680 > 652`), então continuava dando 1 coluna só.
Refazendo a conta com a largura real, a faixa que funciona nos 3 tamanhos
ficou mais estreita (305–316) — `310` resolve os 3 breakpoints de uma vez.

Aplicado no componente-mãe do `CaseCardLarge` e em todas as instâncias
(Home de referência original + as 3 cópias Desktop/Tablet/Mobile
construídas à mão em "Kitchen New"). `CapabilityCard` e
`CapabilityLensCard` continuam em 280 (intervalo de colunas diferente,
não teve o mesmo conflito).

**Lição:** antes de mudar um `minWidth` pra consertar um breakpoint,
testar nos outros dois usando a largura **real** de cada frame — uma
estimativa de largura pode dar um número que parece certo na conta mas
não bate com o frame de verdade.

### Bug 2 — card sozinho na última linha ficava com um vão vazio do lado
Em 768px, quando um card sobra sozinho numa linha (ex: o 5º
`CapabilityCard`, "Motion e Interação"), ele tinha um `maxWidth: 397`
travando o crescimento — sobrava ~275px de vão vazio do lado dele em vez
de ocupar o espaço livre.

**Fix:** removido o `maxWidth` (virou `null`) nos cards que sempre têm
companhia na linha. Sem teto, um card sozinho estica até preencher a
linha toda — sem vão.

**Exceção intencional (`CaseCardLarge`):** o Deiver decidiu que o 4º card
(o que sobra sozinho na Home) não deveria esticar até a largura total
(1280px) — ficaria grande demais. Em vez disso, só **essa instância**
recebeu um `maxWidth: 600` — um meio-termo entre o tamanho normal (413px)
e a largura cheia. Isso é uma decisão manual por instância, não algo do
componente-mãe: qual card fica sozinho depende de quantos cards existem
em cada página, então não dá pra saber de antemão qual vai precisar do
teto. Cada página decide isso na hora, olhando o resultado.

---

## 3. Valores padronizados (depois do fix)

| Componente | `minWidth` | `maxWidth` | `itemSpacing`/`counterAxisSpacing` da fileira |
|---|---|---|---|
| `CaseCardLarge` | 310 | nenhum (exceto card sozinho: 600, por instância) | 20 (`space-600`) |
| `CapabilityCard` | 280 | nenhum | 20 (`space-600`) |
| `CapabilityLensCard` | 280 | nenhum | 20 (`space-600`) |

Resultado observado nas 3 larguras testadas:

| Largura testada | Colunas (`CaseCardLarge`) | Colunas (`CapabilityCard`/`LensCard`) |
|---|---|---|
| 1685 (Desktop) | 3 | 3 |
| 768 (Tablet) | 2 | 2 |
| 390 (Mobile) | 1 | 1 |

---

## 4. Nem toda responsividade é reflow — 2 outros padrões reais

As seções acima cobrem só o padrão "a grade se reorganiza sozinha"
(Fill + Wrap + minWidth). Comparando o Desktop/Tablet/Mobile que o Deiver
construiu à mão em "Kitchen New" (node `336:5931`), apareceram 2 padrões
completamente diferentes — que eu tinha deixado passar batido nos meus
testes rápidos, porque só redimensionava o frame sem checar esses dois:

### Troca de variante (NavBar)
A NavBar não "flui" pra caber em telas menores — ela troca pra uma
variante **estruturalmente diferente** do componente. No arquivo, isso é
a propriedade `Breakpoint` do componente: `Desktop` no frame de 1483px,
`Tablet-Mobile` nos frames de 700px e 390px. Não é a mesma NavBar
encolhendo — é um layout diferente por dentro (provavelmente um menu
hambúrguer nos breakpoints menores, embora isso ainda não esteja
construído).

### Visibilidade de conteúdo (foto do Hero)
A foto do Deiver na seção Hero da Home existe no frame Desktop e **não
existe** nos frames Tablet/Mobile — foi removida de propósito, não
redimensionada nem escondida com opacidade. Alguns elementos simplesmente
não fazem sentido (ou não cabem bem) em telas menores e o conteúdo é
cortado, não encolhido.

**Por que isso importa pro código:** esses 2 padrões não viram CSS puro
com `flex-wrap` — viram lógica condicional (`display:none` em certos
breakpoints, ou um componente de menu diferente inteiro pra mobile). É
bom já entrar na Etapa 2 sabendo que nem tudo é "só CSS responsivo".

---

## 5. O que isso significa pro código (Etapa 2)

Em CSS, essa regra vira literalmente um `display: flex; flex-wrap: wrap`
na fileira + `flex: 1 1 280px` (ou `min-width` num grid) em cada card —
sem precisar de nenhuma media query pra controlar quantas colunas
aparecem. As media queries, se existirem, servem só pra outras coisas
(tipografia, espaçamento de seção) — não pra essa grade de cards.

---

## 6. O que ainda não foi feito

As 13 páginas reais do site (`1.0-Home-PT`, etc.) ainda usam frames
`CaseCardLarge` **duplicados à mão**, não instâncias reais do componente —
então esse fix (aplicado no componente-mãe) ainda não chega até elas
automaticamente. Migrar essas 8 (4 na Home + 4 no Work) pra instâncias
reais do componente já corrigido é o próximo passo natural antes da
Etapa 2 (reconstrução em código).
