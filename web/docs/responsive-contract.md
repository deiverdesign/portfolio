# Contrato responsivo V3

O V3 possui três faixas sem sobreposição nem intervalo vazio:

| Faixa | Largura | CSS |
|---|---:|---|
| Mobile | `0–599px` | `@media (max-width: 599px)` |
| Tablet | `600–1023px` | `@media (min-width: 600px) and (max-width: 1023px)` |
| Desktop | `>=1024px` | `@media (min-width: 1024px)` |

JavaScript deve importar `BREAKPOINTS` ou `MEDIA_QUERIES` de
`src/config/breakpoints.ts`. CSS repete somente os quatro limites canônicos acima, porque custom
properties não são válidas em media queries.

## Regras

- Testar explicitamente `599/600` e `1023/1024`.
- Não criar breakpoint para reproduzir a largura exata de um frame do Figma.
- Mudanças de layout pertencem às três faixas; ajustes fluidos internos usam `clamp()`, `%`, grid e
  limites de largura.
- Calcular grids antes de definir `min-width` ou `minmax()`: `N × item + (N - 1) × gap <= container`.
- Se um único mínimo não garantir a quantidade de colunas em tablet e desktop, usar um override
  apenas em `min-width: 1024px`.
- Validar os dois idiomas nas larguras `320`, `360`, `390/393`, `495`, `599`, `600`, `768/778`,
  `1023`, `1024`, `1280/1288/1327`, `1440`, `1672/1704` e `1920/1993`.

`npm run check-breakpoints` impede novos valores fora do contrato. Seis ocorrências legadas estão
temporariamente isoladas no check: Home atual, `LensBlurGlow`, `CaseCardLarge` e o layout antigo dos
cases. Elas devem desaparecer quando seus equivalentes V3 forem integrados; a allowlist não pode ser
usada para código novo.
