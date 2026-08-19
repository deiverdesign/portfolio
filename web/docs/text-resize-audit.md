# Auditoria de redimensionamento de texto

**Data:** 18 de agosto de 2026  
**Critério:** WCAG 1.4.4 — Resize Text  
**Escopo:** 17 rotas públicas, 10 larguras entre 320px e 1920px, texto em 100% e 200%. O conteúdo protegido do Aster fica fora.

## Linha de base — tokens em px

- Em 100%: nenhuma perda de conteúdo detectada.
- Em 200% da fonte raiz: os tokens em `px` não acompanhavam a preferência.
- Apenas dois títulos sem token na página interna `/pt/showcase` cresciam e ultrapassavam suas caixas.

Isso não prova, sozinho, uma falha de conformidade: o zoom completo do navegador também pode
atender ao critério. A migração para `rem` foi tratada como melhoria para respeitar a preferência
de tamanho do texto, não como garantia automática de acessibilidade.

## Migração

- Os 27 valores da escala (`9 degraus × 3 modos`) foram convertidos por `px ÷ 16`.
- Os aliases `Role → Scale` existentes permaneceram inalterados.
- Papéis ópticos adicionais ficam em `typography.css`, fora do arquivo gerado.
- `generate-tokens.mjs` e `sync-tokens.mjs` agora emitem `rem` somente para a coleção `Font size`.
- `html` continua sem `font-size` fixo.

## Problemas revelados em 200%

A primeira execução depois da conversão encontrou 137 ocorrências, concentradas em dois padrões:

1. palavras longas dentro de colunas fixas chegavam ao corte horizontal da página;
2. Tags usavam `white-space: nowrap` e forçavam cards e heros a ultrapassar o viewport.

A inspeção visual também encontrou a identidade da NavBar ultrapassando a tela porque ela não
podia quebrar. O detector foi ampliado para observar texto fora do viewport, não apenas
`scrollWidth > clientWidth` dentro da própria caixa.

## Correções

- `body { overflow-wrap: anywhere; }` permite quebra como último recurso.
- Tags podem crescer em altura quando o conteúdo não cabe em uma linha.
- A identidade da NavBar pode quebrar em mais de uma linha; o nome continua unido.

Essas regras não alteram a composição quando o conteúdo cabe em 100%.

## Resultado final

- Comparação de produção em `px` contra local em `rem`: **36 de 36 valores renderizados idênticos** nos limites 599, 600, 1023 e 1024px.
- Auditoria automatizada final: **zero perda detectada em 100% e zero em 200%**.
- Inspeção visual representativa: Home, Capabilities, About, Work e Cure em 360px/200%, sem corte ou sobreposição persistente.
- Em 200%, títulos Renamor podem quebrar no meio de uma palavra quando a palavra inteira não cabe. Isso preserva o conteúdo como último recurso; em 100% a composição original permanece.
- A auditoria foi repetida depois da consolidação de família, peso, entrelinha e tracking:
  zero overflow e zero perda de conteúdo continuaram válidos.

## Como executar

Com o servidor local ativo:

```bash
npm run check-text-resize
```

Para testar outra origem:

```bash
BASE_URL=https://example.com npm run check-text-resize
```

O teste automatizado encontra corte geométrico e conteúdo fora do viewport. Ele não substitui
inspeção humana de hierarquia, legibilidade ou qualidade das quebras de linha.
