export type StoryExcerpt = {
  text: string;
  footer?: string;
};

export type StoryContent = {
  locale: "pt-BR" | "en";
  languageLabel: string;
  title: string;
  shortTitle: string;
  amazonUrl: string;
  headerCta: string;
  canvasLabel: string;
  intro: string[];
  scrollHint: string[];
  scrollPrompt: string;
  reducedMotionNote: string;
  outroKicker: string;
  outroCta: string;
  amazonAvailability: string;
  credit: string;
  endingQuote: string;
  endingQuestion: string;
  endingCta: string;
  kitchenExcerpts: StoryExcerpt[];
  opalaExcerpts: StoryExcerpt[];
  bookExcerpts: (StoryExcerpt & { z: number; phoneShift: number })[];
};

export const PORTUGUESE_STORY: StoryContent = {
  locale: "pt-BR",
  languageLabel: "Português",
  title: "Enquanto durar a fé",
  shortTitle: "Enquanto durar a fé",
  amazonUrl: "https://www.amazon.com.br/Enquanto-durar-f%C3%A9-Deiver-Brito-ebook/dp/B0H6Y8K6ND",
  headerCta: "Ler na Amazon",
  canvasLabel: "Jota, de camisa clara e bolsa transversal, em frente ao portão da última casa de uma ladeira de paralelepípedos, no fim da tarde, enquanto a câmera desce a rua de costas",
  intro: ["Há quem tenha fé.", "Há quem se aproveite dela.", "E há Jota."],
  scrollHint: ["Jota vende Bíblias de porta em porta.", "O resto é mais difícil de explicar."],
  scrollPrompt: "Role para entrar",
  reducedMotionNote: "Quadro estático por preferência de movimento reduzido.",
  outroKicker: "Há mais do que o que se ouve.",
  outroCta: "Conheça o livro",
  amazonAvailability: "Disponível na Amazon",
  credit: "Experiência digital criada por",
  endingQuote: "“E sobre o que você queria falar mesmo?”",
  endingQuestion: "Até onde podemos ir por quem amamos?",
  endingCta: "Ler na Amazon · R$ 17,99 ou no Kindle Unlimited ↗",
  kitchenExcerpts: [
    { text: "No corredor, uma fotografia antiga descansava sobre um aparador.\nA moldura estava virada para a parede.\nComo acontecia havia meses.", footer: "CAPÍTULO 3 — A LATA AZUL" },
    { text: "Lá dentro não havia biscoitos.\nNotas dobradas. Comprovantes. Alguns envelopes.\nContou o dinheiro. Depois contou novamente." },
    { text: "Abriu a geladeira.\nHavia pouca coisa dentro.\nUm pedaço de queijo. Leite. Alguns ovos." },
  ],
  opalaExcerpts: [
    { text: "— Mas as pessoas gostam muito de falar.\n— É verdade.\n— Principalmente quando não conhecem a história inteira.", footer: "CAPÍTULO 5 — A COSTUREIRA" },
  ],
  bookExcerpts: [
    { z: 5, phoneShift: -.42, text: "Ele percebe que teria adorado ser criança naquele lugar.", footer: "CAPÍTULO 1 — A SUBIDA" },
    { z: 14, phoneShift: .1, text: "“Maria, posso pedir só um favor?\nPode me dar um copo d’água?\nFique à vontade para recusar.\nÉ mais comum do que você imagina.”", footer: "— JOTA" },
    { z: 24, phoneShift: -.6, text: "“Jota não é o seu nome, né?”", footer: "— MARIA" },
  ],
};

// A edição inglesa do EPUB fornecido pelo autor serve de referência de idioma. Os bilhetes
// continuam sendo uma adaptação para a experiência: cortes, ordem e o uso recorrente de
// “Jota” seguem a direção editorial do hotsite, não uma transcrição literal do livro.
export const ENGLISH_STORY: StoryContent = {
  locale: "en",
  languageLabel: "English",
  title: "Give Us This Day Our Daily Lie",
  shortTitle: "Give Us This Day\nOur Daily Lie",
  amazonUrl: "https://www.amazon.com.br/Give-this-day-our-daily-ebook/dp/B0H9ZHMRTK",
  headerCta: "Read on Amazon",
  canvasLabel: "Jota, wearing a light shirt and a crossbody bag, stands in front of the gate at the last house on a cobblestone hill as the camera moves backwards down the street at dusk",
  intro: ["Some have faith.", "Some take advantage of it.", "And then there is Jota."],
  scrollHint: ["Jota sells Bibles door to door.", "The rest is harder to explain."],
  scrollPrompt: "Scroll to enter",
  reducedMotionNote: "Static frame shown because reduced motion is enabled.",
  outroKicker: "There is more than what we hear.",
  outroCta: "Discover the book",
  amazonAvailability: "Available on Amazon",
  credit: "Digital experience crafted by",
  endingQuote: "“What did you want to talk about again?”",
  endingQuestion: "How far can we go for those we love?",
  endingCta: "Read on Amazon ↗",
  kitchenExcerpts: [
    { text: "In the hallway, an old photograph rested on a console table.\nThe frame faced the wall.\nAs it had for months.", footer: "CHAPTER 3 — THE BLUE TIN" },
    { text: "There were no cookies inside.\nFolded bills. Receipts. A few envelopes.\nCounted the money.\nThen counted it again." },
    { text: "Opened the refrigerator.\nThere was not much inside.\nA piece of cheese. Milk. A few eggs." },
  ],
  opalaExcerpts: [
    { text: "— But people do love to talk.\n— That’s true.\n— Especially when they don’t know the whole story.", footer: "CHAPTER 5 — THE SEAMSTRESS" },
  ],
  bookExcerpts: [
    { z: 5, phoneShift: -.42, text: "He realizes he would have loved to grow up there.", footer: "CHAPTER 1 — THE CLIMB" },
    { z: 14, phoneShift: .1, text: "“Maria, could I ask just one favor?\nCould you give me a glass of water?\nPlease feel free to say no.\nPeople do more often than you’d imagine.”", footer: "— JOTA" },
    { z: 24, phoneShift: -.6, text: "“Jota isn’t your real name, is it?”", footer: "— MARIA" },
  ],
};
