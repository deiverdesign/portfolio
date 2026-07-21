const projetos = [
  {
    titulo: "CURE Intelligence / SCRIOO",
    descricao: "AI powered supply chain risk intelligence platform."
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
  return `
    <section>
      <h2>${projeto.titulo}</h2>
      <p>${projeto.descricao}</p>
    </section>
  `;
}

const container = document.getElementById("lista-projetos");
projetos.forEach(projeto => {
  container.innerHTML += criarProjetoHTML(projeto);
});
document.getElementById("cabecalho").innerHTML = criarCabecalhoHTML(perfil);