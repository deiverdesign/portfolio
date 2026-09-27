# Inventário de assets da Home V3

Fonte preservada: `/Users/deiverbrito/Desktop/portfolio assets v3/Home`.

Importado em 26/09/2026 para `public/images/v3/home/`: 41 arquivos, 15.906.675 bytes.
Os arquivos externos não foram alterados. `.DS_Store` e `Arquivo.zip` foram ignorados; o ZIP contém
outra cópia dos mesmos exports e metadados `__MACOSX`.

## Resultado da auditoria

- 12 PNGs RGBA, três SVGs de identidade e 26 variantes de logos.
- Nenhum arquivo é duplicado byte a byte.
- SVGs possuem `viewBox`, não dependem de fontes externas e não embutem imagens raster.
- Os PNGs destinados a composição preservam alpha. `capability-01` e `capability-02` têm fundo
  branco totalmente opaco; isso deve ser comparado ao card no Figma antes da integração final.
- O maior arquivo é `aster-background.png` (4.011.105 bytes). O hero DEIVER tem 3.599.215 bytes e
  SCRIOO devices 2.014.742 bytes. Servir os rasters pelo `next/image`, com `sizes` correto, antes do
  release.
- O arquivo ZIP não entra no site.

## Mapeamento

Os caminhos e dimensões canônicos vivem em `src/content/home-assets.ts`. Nomes externos foram
normalizados para lowercase/kebab-case apenas dentro do worktree.

| Grupo | Arquivos integrados |
|---|---|
| Identidade | logo Deiver, job title e árvore de Floripa |
| Hero | grafismo DEIVER 3510×2154 |
| Capabilities | três ilustrações numeradas, aguardando associação semântica final |
| SCRIOO | container e composição laptop/telefone |
| HP | composição desktop/mobile |
| Theodoor | device do card |
| Intuit | figura recortada desktop/tablet e variante mobile |
| Aster | background e foreground separados |
| Brands | 13 logos em versões original e branca |

## Atualização em 26/09/2026 — seção de fechamento ("Let's work together")

Quatro arquivos novos chegaram na pasta fonte depois da auditoria inicial de 41 arquivos e foram
integrados a `public/images/v3/home/`:

| Arquivo original | Caminho no worktree | Uso |
|---|---|---|
| `AvailableLabel.svg` | `contact/available-label.svg` | Selo circular "Available to work", ao lado do statement "My best work happens where…", na seção About/CTA |
| `Deiver-Let's work together.png` (484×587) | `contact/portrait.png` | Retrato em hexágono laranja, peça principal da seção de fechamento |
| `Deiver-graphism-WorkTogether.svg` | `contact/graphism-background.svg` | Grafismo decorativo (formas booleanas em contorno) atrás do heading "Let's build better digital products.", ~40% de opacidade |
| `Hexagon-pattern-decorative.svg` | `decorative/hexagon-pattern.svg` | O padrão de hexágonos da Home antes registrado como "adiado" na auditoria de tokens de 25/09; confirmado por Deiver como o export final |

Dois arquivos que pareciam novos são apenas renomeações na origem, sem conteúdo alterado:
`Back-Aster 1 - case-home.png` (idêntico byte a byte a `aster-background.png`, 4.011.105 bytes) e
`front-Aster 1 - case-home.png` (`aster-foreground.png`). Não foram reimportados.

**Cores cravadas nos 4 novos arquivos — mesma classe de dívida já registrada para o `HexagonIntro` no
`NORTE.md` (6.6):**

- `hexagon-pattern.svg` usa `fill="#E5E9E7"` em todos os paths — bate exatamente com o token
  `surface/decorative/default` (Default) criado em 25/09. Ao aplicar no CSS, referenciar
  `var(--color-surface-decorative-default)` em vez do hex cravado.
- `available-label-en.svg` e `available-label-pt.svg` usam `fill="#E24900"`. No Figma essa camada
  está vinculada a `foreground/accent/subtle` (visto no painel de propriedades); o export achatou
  para hex, como sempre acontece. Recolorir via token só quando a coleção `Color semantic v3`
  migrar para o CSS — não trocar o hex isoladamente agora.
- **Resolvido em 26/09:** Deiver desenhou e entregou a versão em português do selo (era a lacuna
  registrada abaixo). `available-label` agora é um objeto `{ en, pt }` em `home-assets.ts`, não mais
  um caminho único.
- `graphism-background.svg` usa um gradiente (`paint0_linear`) com stops cravados; ainda não mapeado
  a nenhum token. Registrar como pendência, não inventar um token para ele agora.

Nenhum desses três arquivos deve ter cor trocada na SVG diretamente — a lição da 6.6 é que troca de
hex por hex só substitui um valor cravado por outro.

## Decisões e pendências

- O card Intuit usa `intuit-device.png` em desktop/tablet e `intuit-device-mobile.png` em mobile.
  Fundo, logo, texto e noise permanecem camadas de código. As composições canônicas estão nos nós
  Figma `1126:5111` e `1104:4476`.
- O logo antes nomeado incorretamente como Sarico foi corrigido na origem e reimportado como
  `brands/{original,white}/scrioo.svg`.
- O card SCRIOO usa `scrioo-devices.png` e `scrioo-container.png`; a composição canônica está no nó
  Figma `2167:6206`.
- Alt text não veio no handoff. Nas cards linkadas, a imagem provavelmente será decorativa porque o
  título já nomeia o destino; confirmar durante a implementação acessível.
