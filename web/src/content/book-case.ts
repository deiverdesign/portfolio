import type { Localized } from "./i18n";

export interface BookCaseCopy {
  title: string;
  summary: string;
  tourLabel: string;
  tourCaption: string;
  context: [string, string, string];
  role: string;
  project: string;
  art: [string, string, string];
  hillSceneLabel: string;
  geography: [string, string];
  character: [string, string, string, string];
  parallax: [string, string, string, string];
  atmosphere: [string, string];
  kitchen: [string, string, string];
  kitchenStudyLabels: [string, string, string, string];
  opala: [string, string, string];
  benchmark: string;
  benchmarkLabels: [string, string, string];
  motion: [string, string, string, string];
  steps: [string, string, string];
  technical: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  result: [string, string, string, string];
  reflection: [string, string, string, string];
  technicalCaptions: [string, string, string, string];
  play: string;
  pause: string;
}
export const BOOK_CASE_COPY: Localized<BookCaseCopy> = {
  pt: {
    title: "Enquanto\ndurar a fé",
    summary:
      "Uma experiência imersiva para apresentar meu romance e despertar a vontade de ler. Direção de arte, narrativa e interação conduzidas pelo scroll.",
    tourLabel: "ENQUANTO DURAR A FÉ · EXPERIÊNCIA INTERATIVA",
    tourCaption:
      "O vídeo apresenta um percurso. No site, cada pessoa pode encontrar o próprio ritmo.",
    context: [
      "Um convite à leitura antes da primeira página",
      "Enquanto durar a fé é um romance que escrevi por hobby. Criei o hotsite para dar ao leitor um primeiro contato com sua atmosfera, seus personagens e seus conflitos — e despertar a vontade de abrir o livro.",
      "Selecionei três momentos-chave, sem revelar grandes spoilers. Cenários, enquadramentos e transições foram pensados como um convite à história, não como uma versão resumida dela.",
    ],
    role: "Autoria · direção de arte · interação\nDesenvolvimento e publicação com apoio de IA",
    project: "Autoral · Web · Português e inglês",
    art: [
      "Encontrar a forma de um lugar que existia em palavras",
      "O estilo veio antes do primeiro prompt",
      "Reuni referências para a linguagem visual das três cenas e dos personagens antes de começar a gerar imagens. A IA entrou na execução dessa direção, não na escolha dela.",
    ],
    hillSceneLabel: "Cena 1 — encontrar o lugar",
    geography: [
      "A geografia veio antes do cenário",
      "Pesquisei uma ladeira real. Quando a descrição não resolvia a relação entre rua, casas e altura, desenhei volumes e cortes laterais para orientar a construção.",
    ],
    character: [
      "Jota precisava continuar sendo Jota",
      "A folha de personagem definiu proporções, roupa e aparência antes do 3D, mantendo Jota consistente entre as etapas.",
      "Dar presença sem revelar tudo",
      "Na experiência, evitei revelar completamente os rostos. Quis dar presença aos personagens sem fechar a imagem que cada leitor pode construir a partir do livro.",
    ],
    parallax: [
      "ESPAÇO E PARALLAX",
      "A profundidade também podia vir de imagens",
      "PLANOS 2D · VISTA DE CONSTRUÇÃO",
      "A rua é 3D. A cidade distante e parte da vegetação são planos 2D. Essas camadas criam profundidade quando a câmera se move, com cuidado no peso de cada asset para manter o site leve.",
    ],
    atmosphere: ["CENAS E ATMOSFERA", "A luz muda o lugar e a leitura da cena"],
    kitchenStudyLabels: [
      "VOLUME E LUZ EXTERNA",
      "COZINHA EM CINZA",
      "COR E ILUMINAÇÃO",
      "RUA INTEGRADA À JANELA",
    ],
    kitchen: [
      "Cozinha · estudos de espaço e luz",
      "Nos estudos abaixo, trabalhei volume, luz, janela e máscara. As versões em cinza ajudaram a resolver o espaço; a cor e a luz vermelha definiram sua atmosfera.",
      "CENA PUBLICADA · COZINHA",
    ],
    opala: [
      "Opala · referências e composição",
      "Nas referências abaixo, investiguei cor, chuva e enquadramento. O ponto de vista baixo, os reflexos e a distância entre os personagens ajudaram a construir a tensão da cena.",
      "A transição também foi desenhada",
    ],
    benchmark: "Benchmark · cor, perspectiva e chuva",
    benchmarkLabels: ["DE COR", "DE PERSPECTIVA", "DE CHUVA"],
    motion: [
      "MOTION E INTERAÇÃO",
      "Recuar na tela para atravessar o tempo",
      "A câmera que recua é uma alegoria à narrativa do livro, que avança e volta no tempo. Cada cena apresenta um momento-chave sem entregar suas grandes revelações.",
      "Na passagem da cozinha para o Opala, a parede cobre o quadro antes de revelar a próxima rua. A mudança de 2017 para 2015 transforma uma transição visual em uma pista sobre a estrutura da história.",
    ],
    steps: [
      "RECUAR PELA LADEIRA",
      "ATRAVESSAR A JANELA",
      "CHEGAR AO OPALA",
    ],
    technical: [
      "DO DESIGN AO CÓDIGO",
      "Manter o visual. Reduzir o peso.",
      "Conduzi o projeto do design à publicação, com apoio de IA. O desafio técnico era manter a qualidade visual de uma experiência em 3D sem tornar o site pesado.",
      "Geometria onde importa",
      "Simplifiquei a geometria dos personagens, preservando detalhes nas regiões prioritárias. No Jota, a versão usada no site tem 91,8% menos triângulos que o modelo original.",
      "Da rua 3D para uma imagem",
      "Ao entrar na cozinha, a rua vista pela janela passa do 3D para uma imagem estática alinhada ao mesmo enquadramento. A troca reduz o custo de renderização sem interromper a continuidade visual.",
      "Imagens no tamanho de cada tela",
      "Usei imagens responsivas com srcset para que telas menores carreguem versões mais leves, em vez dos arquivos maiores destinados ao desktop.",
      "Otimizar o que a câmera não revela, preservar o que o leitor percebe.",
    ],
    result: [
      "RESULTADO",
      "Da atmosfera ao convite para ler",
      "Publicado em português e inglês, com três cenas conectadas, enquadramentos ajustados para desktop e celular e acesso ao livro na Amazon.",
      "A experiência termina com o livro em destaque e um caminho direto para a Amazon, conectando a curiosidade construída nas cenas à possibilidade de começar a leitura.",
    ],
    reflection: [
      "A história começa antes da primeira página",
      "Para mim, a primeira barreira é fazer o leitor querer começar. Abrir um livro exige tempo e confiança numa história que ainda não conhecemos — e muitos títulos nem chegam a ser considerados.",
      "Dar vontade de abrir o livro — sem contar a história por ele.",
      "O hotsite nasceu para criar esse primeiro vínculo: oferecer atmosfera, encontros e perguntas antes da leitura. Não substitui a imaginação do leitor; abre uma porta para ela.",
    ],
    technicalCaptions: [
      "De 649.014 para 53.362 triângulos · 91,8% menos geometria.",
      "A cozinha e a imagem da rua vistas fora do enquadramento final.",
      "Planta da cozinha e percurso da câmera até a rua do Opala.",
      "Estudo da direção de luz e sombra na cena.",
    ],
    play: "Reproduzir",
    pause: "Pausar",
  },
  en: {
    title: "Give us This Day\nOur Daily Lie",
    summary:
      "An immersive experience to introduce my novel and make people want to read it. Art direction, storytelling and interaction driven by scrolling.",
    tourLabel: "GIVE US THIS DAY OUR DAILY LIE · INTERACTIVE EXPERIENCE",
    tourCaption:
      "The video follows one path. On the website, each person can find their own pace.",
    context: [
      "An invitation to read, before the first page",
      "Give us This Day Our Daily Lie is a novel I wrote as a hobby. I created the website to give readers a first encounter with its atmosphere, characters and conflicts — and make them want to open the book.",
      "I selected three key moments without revealing major spoilers. Settings, framing and transitions were designed as an invitation into the story, not a condensed retelling.",
    ],
    role: "Writing · art direction · interaction\nDevelopment and publishing with AI assistance",
    project: "Personal project · Web · Portuguese and English",
    art: [
      "Finding the shape of a place that existed in words",
      "The style came before the first prompt",
      "I gathered references for the visual language of all three scenes and their characters before generating images. AI helped execute that direction; it did not choose it.",
    ],
    hillSceneLabel: "Scene 1 — finding the place",
    geography: [
      "Geography came before the setting",
      "I researched a real hillside street. When words could not resolve the relationship between the street, houses and elevation, I drew volumes and side sections to guide the construction.",
    ],
    character: [
      "Jota needed to remain Jota",
      "A character sheet established proportions, clothing and appearance before 3D, keeping Jota consistent throughout the process.",
      "Presence without revealing everything",
      "I avoided fully revealing the characters’ faces. I wanted to give them presence without closing off the image each reader can build from the book.",
    ],
    parallax: [
      "SPACE AND PARALLAX",
      "Depth could also come from images",
      "2D PLANES · CONSTRUCTION VIEW",
      "The street is 3D. The distant city and some vegetation are 2D planes. These layers create depth as the camera moves, with attention to each asset’s weight to keep the website light.",
    ],
    atmosphere: [
      "SCENES AND ATMOSPHERE",
      "Light changes the place — and how we read it",
    ],
    kitchenStudyLabels: [
      "VOLUME AND EXTERNAL LIGHT",
      "KITCHEN IN GRAY",
      "COLOR AND LIGHTING",
      "STREET THROUGH THE WINDOW",
    ],
    kitchen: [
      "Kitchen · studies in space and light",
      "In the studies below, I worked on volume, light, the window and masking. Grayscale versions helped resolve the space; color and red light defined its atmosphere.",
      "PUBLISHED SCENE · KITCHEN",
    ],
    opala: [
      "Opala · references and composition",
      "The references below explore color, rain and framing. A low viewpoint, reflections and the distance between characters helped build tension in the scene.",
      "The transition was designed too",
    ],
    benchmark: "Benchmark · color, perspective and rain",
    benchmarkLabels: ["COLOR", "PERSPECTIVE", "RAIN"],
    motion: [
      "MOTION AND INTERACTION",
      "Moving back on screen to move through time",
      "The retreating camera echoes the novel’s narrative, which moves forward and backward in time. Each scene presents a key moment without giving away its major revelations.",
      "Between the kitchen and the Opala, a wall fills the frame before revealing the next street. The change from 2017 to 2015 turns a visual transition into a clue about the structure of the story.",
    ],
    steps: [
      "RETREAT DOWN THE HILL",
      "PASS THROUGH THE WINDOW",
      "ARRIVE AT THE OPALA",
    ],
    technical: [
      "FROM DESIGN TO CODE",
      "Keep the visual. Reduce the weight.",
      "I led the project from design to publication, with AI assistance. The technical challenge was preserving the visual quality of a 3D experience without making the website heavy.",
      "Geometry where it matters",
      "I simplified character geometry while preserving detail in priority areas. The Jota model used on the website has 91.8% fewer triangles than the original.",
      "From a 3D street to an image",
      "Upon entering the kitchen, the street seen through the window switches from 3D to a static image matched to the same framing. This reduces rendering cost without breaking visual continuity.",
      "Images sized for each screen",
      "I used responsive images with srcset so smaller screens load lighter versions instead of the larger files intended for desktop.",
      "Optimize what the camera does not reveal. Preserve what the reader perceives.",
    ],
    result: [
      "OUTCOME",
      "From atmosphere to an invitation to read",
      "Published in Portuguese and English, with three connected scenes, framing adapted for desktop and mobile, and access to the book on Amazon.",
      "The experience ends with the book in focus and a direct path to Amazon, connecting the curiosity built across the scenes to the possibility of starting to read.",
    ],
    reflection: [
      "The story begins before the first page",
      "For me, the first barrier is making a reader want to begin. Opening a book takes time and trust in a story we do not yet know — and many titles are never even considered.",
      "Make people want to open the book — without telling the story for them.",
      "The website was created to build that first connection: offering atmosphere, encounters and questions before reading. It does not replace the reader’s imagination; it opens a door to it.",
    ],
    technicalCaptions: [
      "From 649,014 to 53,362 triangles · 91.8% less geometry.",
      "The kitchen and the street image, seen outside the final framing.",
      "Kitchen floor plan and camera path toward the Opala street.",
      "Study of light and shadow direction in the scene.",
    ],
    play: "Play",
    pause: "Pause",
  },
};
