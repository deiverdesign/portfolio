# Sistema tipográfico

Esta especificação separa duas coisas diferentes:

- **Font size variables** guardam apenas os tamanhos responsivos.
- **Text Styles** combinam família, peso, tamanho, line-height, letter-spacing e transformação.

A migração dos estilos que já existem é estritamente 1:1: nenhum estilo atual é dividido,
fundido ou reaplicado a outro elemento.

## Fundação de tamanho

| Scale | Desktop | Tablet | Mobile |
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

Os degraus são uma infraestrutura numérica. Eles não dizem que Boldonse, DM Sans e DM Mono
têm o mesmo tamanho óptico quando recebem o mesmo número. Essa decisão pertence ao Text Style,
que registra a família e deve ser calibrado visualmente.

## Migração 1:1

| Variável atual | Nova variável | Text Style atual | Novo Text Style | Família e peso | Scale | Usos no código |
| --- | --- | --- | --- | --- | --- | ---: |
| `huge-title` | `Role/Display/Large` | `Title/HugeTitle` | `Display/Large` | Boldonse Regular | 900 | 1 |
| `hero-title` | `Role/Display/Medium` | `Title/Hero Title` | `Display/Medium` | Boldonse Regular | 800 | 2 |
| `h1-page-title` | `Role/Heading/Large` | `Title/Page Title (H1)` | `Heading/Large` | Boldonse Regular | 700 | 8 |
| `body-large-intro` | `Role/Body/Large` | `Body/Body Large - Intro` | `Body/Large` | DM Sans 9pt Regular | 600 | 19 |
| `subtitle` | `Role/Body/Medium` | `Title/Subtitle/Subtitle` | `Body/Medium` | DM Sans 9pt Regular | 500 | 17 |
| `ui-medium` | `Role/Label/Large` | `Title/Subtitle/UI Medium` | `Label/Large` | DM Sans Medium | 500 | 5 |
| `h2-section-title` | `Role/Heading/Small` | `Title/Section Title (H2)` | `Heading/Small` | Boldonse Regular | 400 | 6 |
| `body` | `Role/Data/Medium` | `Body/Body` | `Data/Medium` | DM Mono Regular | 300 | 5 |
| `body-emphasis` | `Role/Data/Medium Emphasis` | `Body/Body Emphasis` | `Data/Medium Emphasis` | DM Mono Medium | 300 | 0 |
| `caption` | `Role/Caption/Medium` | `Caption/Caption` | `Caption/Medium` | DM Mono Regular | 300 | 35 |
| `eyebrow` | `Role/Editorial/Eyebrow` | `Title/Eyebrow` | `Editorial/Eyebrow` | Boldonse Regular | 200 | 14 |
| `step-number` | `Role/Editorial/Step Number` | `Title/Step Number` | `Editorial/Step Number` | Boldonse Regular | 100 | 1 |

Os usos atuais podem não representar perfeitamente o novo nome semântico. Eles permanecem
como estão para evitar uma refatoração visual ampla. Páginas novas devem escolher o estilo
pelo papel correto; páginas antigas podem ser refinadas quando já estiverem em edição.

## Expansão disponível para páginas novas

Esses estilos entram no sistema sem serem aplicados a nenhuma página existente.

| Nova variável | Novo Text Style | Família e peso | Scale | Uso previsto |
| --- | --- | --- | --- | --- |
| `Role/Heading/Medium` | `Heading/Medium` | Boldonse Regular | 600 | títulos intermediários entre página e seção compacta |
| `Role/Body/Small` | `Body/Small` | DM Sans 9pt Regular | 300 | texto de apoio e conteúdo editorial compacto |
| `Role/Body/Medium Emphasis` | `Body/Medium Emphasis` | DM Sans Medium | 500 | ênfase no corpo sem alterar o tamanho |
| `Role/Label/Medium` | `Label/Medium` | DM Sans Medium | 300 | labels e controles compactos |
| `Role/Label/Small` | `Label/Small` | DM Sans Medium | 200 | labels auxiliares de baixa hierarquia |

Todos começam com line-height de 150% e letter-spacing de 0%, seguindo o padrão atual.
`Heading/Medium` usa caixa alta; os demais preservam a caixa do conteúdo.

## Nomes no código

| Nome antigo | Nome novo |
| --- | --- |
| `--font-huge-title` | `--font-size-display-large` |
| `--font-hero-title` | `--font-size-display-medium` |
| `--font-h1-page-title` | `--font-size-heading-large` |
| `--font-body-large-intro` | `--font-size-body-large` |
| `--font-subtitle` | `--font-size-body-medium` |
| `--font-ui-medium` | `--font-size-label-large` |
| `--font-h2-section-title` | `--font-size-heading-small` |
| `--font-body` | `--font-size-data-medium` |
| `--font-body-emphasis` | `--font-size-data-medium-emphasis` |
| `--font-caption` | `--font-size-caption-medium` |
| `--font-eyebrow` | `--font-size-editorial-eyebrow` |
| `--font-step-number` | `--font-size-editorial-step-number` |

## Invariantes da migração

- Os 12 estilos existentes continuam sendo 12 e preservam seus IDs.
- Os valores Desktop, Tablet e Mobile permanecem idênticos.
- A quantidade de usos de cada token no código permanece idêntica após a troca de nome.
- Nenhum Text Style novo é aplicado automaticamente.
- Nenhuma família, peso, line-height, letter-spacing ou transformação existente é alterada.
- Famílias diferentes nunca são consideradas equivalentes apenas por compartilharem um número.
