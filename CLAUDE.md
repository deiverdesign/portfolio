# Sobre o Deiver (leia antes de responder)

## Quem sou

Sou o Deiver, Senior Product Designer. Este é meu portfólio pessoal, sendo
reconstruído do zero (HTML/CSS/JS puro) em paralelo com um design system
no Figma. **Não sou desenvolvedor — estou aprendendo a programar através
deste projeto.** Trate cada tarefa também como uma aula, não só como uma
execução.

## Como meu cérebro funciona (importante pra como você me explica as coisas)

- Sou autista (nível 1) e tenho TDAH.
- Penso de baixo pra cima (bottom-up): eu entendo o conceito geral DEPOIS
  de ver o exemplo concreto, não o contrário. Não me explique a teoria e
  espere que eu generalize sozinho — mostre o código/exemplo primeiro (ou
  junto), depois nomeie o conceito.
- Prefiro respostas diretas e gentis. Direto não é frio: pode (e deve) me
  dizer quando algo está errado ou quando eu pedi algo ambíguo, só evite
  rodeios desnecessários.
- Evite jargão técnico sem explicar. Se precisar usar um termo (ex:
  "hoisting", "closure", "specificity"), explique em 1 frase simples na
  primeira vez que usar, com um exemplo mínimo.
- Evite explicações longas antes de mostrar algo prático. Prefiro ver o
  resultado (o código, o diff, a tela) e entender a partir dele.
- Não presuma que eu já sei o "óbvio" do mundo dev (git, terminal, npm,
  etc.). Pergunte ou explique rapidamente antes de assumir.

## Objetivo primário e secundário deste projeto

- **Primário**: reconstruir meu portfólio (site real, em produção) com
  qualidade de Senior Product Designer — visual, conteúdo, acessibilidade
  (WCAG AA) e performance.
- **Secundário**: usar esse processo pra aprender fundamentos de
  desenvolvimento front-end (HTML semântico, CSS, JS básico, git/GitHub) e
  de workflow profissional com IA (Figma MCP, design tokens, Code
  Connect/Storybook) — porque isso é cada vez mais esperado de designers
  hoje: saber orquestrar uma IA em vez de fazer tudo à mão.

## Contexto técnico em paralelo (Figma)

Estou reconstruindo o design system deste mesmo portfólio dentro do Figma
(arquivo real, fileKey `zpaQNzgjhG5ZKafe2cxnkm`) em outra sessão (Cowork),
com tokens primitivos/semânticos de cor, tipografia e espaçamento, além de
componentes reais (Button, Tag, Card, etc.). A ideia é eventualmente
conectar isso ao código aqui via Code Connect. Se for relevante pra uma
tarefa aqui no repo, pode perguntar se quero trazer algo de lá.

## Mapa do repositório (leia antes de explorar)

- `web/` — o site de verdade (Next.js), o que está publicado em produção.
- `.github/` — workflows de CI.
- Qualquer outro arquivo ou pasta na raiz fora dessa lista **não é do
  site**. Pode ser configuração de ferramenta (`.claude/`), lixo local
  (`.DS_Store`), ou algo que caiu aqui por engano — não precisa investigar
  de novo pra descobrir isso, já é sabido.

## Como trabalhar comigo neste repo

- Antes de mudanças grandes ou arriscadas, me explique o plano em
  linguagem simples primeiro, com exemplo, e espere eu confirmar.
- Quando terminar algo, um resumo curto do que mudou e por quê — sem
  listar cada passo técnico, a menos que eu peça.
- Se eu pedir algo ambíguo, pergunte com um exemplo do que você entendeu,
  em vez de assumir.

## Como responder quando eu peço uma investigação

Quando eu pedir pra investigar/entender alguma coisa (um bug, um
comportamento, uma decisão técnica), a resposta começa com um resumo,
nessa ordem:

1. **O problema em 30–45 segundos** — o que está acontecendo, direto,
   sem rodeio.
2. **Um modelo visual**, quando fizer sentido — diagrama, antes/depois,
   tabela — mostrando o mecanismo, não só descrevendo em texto.
3. **As decisões que eu preciso tomar** — só o que exige minha escolha,
   listado com clareza.

Só depois disso, se for necessário, vem a versão completa/detalhada.
Esse resumo no topo não é um adendo — é o que eu uso pra navegar o
resto da resposta.

## Autorizações permanentes (não precisa perguntar antes)

- Pode sempre rodar `git add` / `git commit` / `git push` para `main`
  neste repositório depois de qualquer mudança de código, sem pedir
  confirmação antes. É um projeto solo, sem outros devs revisando —
  reverter um commit é fácil se algo sair errado.
- Pode sempre rodar o rebuild + deploy do Storybook na Vercel
  (`npm run build-storybook` + `vercel deploy --prod`) depois de mexer
  em componentes, sem perguntar antes.

## O que continua precisando de confirmação, mesmo com isso acima

- Apagar qualquer projeto ou recurso na Vercel (ou em qualquer serviço
  na nuvem) — é destrutivo, fica de fora da autorização.
- Abrir Pull Request de verdade (push numa branch nova + `gh pr
  create`) — combinamos que isso fica manual de propósito, mesmo pra
  scripts automatizados como o `sync-tokens.mjs`. Só faço se eu pedir
  isso na hora, especificamente.
- Qualquer coisa envolvendo senha, token ou credencial minha.
