const projetos = [
  {
    titulo: "CURE Intelligence / SCRIOO",
    descricao: "AI powered supply chain risk intelligence platform.",
    pagina: "cure-intelligence.html"
  },
  {
    titulo: "HP Subscription Onboarding",
    descricao: "Guided setup for a printer inclusive subscription model."
  },
  {
    titulo: "Theodoor",
    descricao: "Accessible app for smart door automation."
  },
  {
    titulo: "Intuit for Education",
    descricao: "Financial education experience for students."
  }
];

const perfil = { nome: "Deiver Brito", cargo: "Senior Product Designer · Florianópolis · Brazil" };

function criarCabecalhoHTML(perfil) {
  return `
    <h1>${perfil.nome}</h1>
    <p>${perfil.cargo}</p>
  `;
}

function criarProjetoHTML(projeto) {
  // Se o projeto tiver uma página própria (campo "pagina"), o título
  // vira um link pra ela. Se não tiver, fica como texto simples —
  // é assim que os outros 3 cases continuam "não clicáveis" por enquanto.
  const titulo = projeto.pagina
    ? `<a href="${projeto.pagina}">${projeto.titulo}</a>`
    : projeto.titulo;

  return `
    <section>
      <h2>${titulo}</h2>
      <p>${projeto.descricao}</p>
    </section>
  `;
}

const container = document.getElementById("lista-projetos");
// Guarda de segurança: nas páginas de case (ex: cure-intelligence.html)
// não existe #lista-projetos, então "container" viria null aqui.
// Sem esse "if", o forEach quebraria e a linha do cabeçalho (embaixo)
// nunca seria executada — o nome/cargo simplesmente não apareceriam.
if (container) {
  projetos.forEach(projeto => {
    container.innerHTML += criarProjetoHTML(projeto);
  });
}

document.getElementById("cabecalho").innerHTML = criarCabecalhoHTML(perfil);