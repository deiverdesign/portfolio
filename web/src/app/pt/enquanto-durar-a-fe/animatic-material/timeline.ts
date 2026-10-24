// LINHA DO TEMPO (Deiver, 13/10): narrativa, não é navegação (nada aqui é clicável).
// Uma linha curta e discreta com um ponto só para cada ano que aparece nas cenas
// (— ○ — ● —), a bolinha branca no ano ativo e, acima dela, o ano inteiro.
// - Mesma cena no mesmo ano (rua → cozinha, as duas em junho de 2017): o ano não muda,
//   só o marcador dá um pulso curto.
// - Mudança de ano (cozinha 2017 → Opala 2015): o ano gira como um contador, dentro de uma
//   máscara. Voltando no tempo, 2017 sobe e some pelo topo e 2016, 2015 entram por baixo;
//   avançando, o contrário. Ao mesmo tempo o marcador desliza até o ano novo na linha.
// Desktop: o marcador anda pela linha. Celular: o marcador fica no meio e a linha anda por
// baixo dele, com o ano sempre acima do marcador central.
// Ex.: setScene(2) na volta da cozinha para a rua do Opala → 2017 ▲ 2016 ▲ 2015 em ~0,75 s.

// Ano de cada cena, pelas datas do livro: cap. 1 e 3 = junho de 2017; cap. 5 = junho de 2015.
// Os pontos da linha saem daqui: um por ano diferente, em ordem (hoje, 2015 e 2017). Uma cena
// nova com outro ano ganha um ponto novo sozinha.
export const SCENE_YEARS = [2017, 2017, 2015];
const POINTS = [...new Set(SCENE_YEARS)].sort((a, b) => a - b);
const ROLL_MS = 750;

export function createTimeline(root: HTMLElement, styles: Record<string, string>) {
  // Posição de um ano na linha, de 0 a 1: os pontos ficam igualmente espaçados, com um pedaço
  // de linha sobrando nas duas pontas. Ex.: 2 pontos → 1/3 e 2/3.
  const at = (year: number) => (POINTS.indexOf(year) + 1) / (POINTS.length + 1);

  root.replaceChildren();
  root.style.setProperty("--points", POINTS.length.toString());
  const track = document.createElement("div");
  track.className = styles.timelineTrack;
  POINTS.forEach((year) => {
    const point = document.createElement("i");
    point.className = styles.timelinePoint;
    point.style.setProperty("--at", at(year).toString());
    track.append(point);
  });
  const marker = document.createElement("div");
  marker.className = styles.timelineMarker;
  const dot = document.createElement("i");
  dot.className = styles.timelineDot;
  // A máscara (overflow: hidden) mostra um ano por vez; a coluna dentro dela é o "contador".
  const mask = document.createElement("span");
  mask.className = styles.timelineYear;
  const column = document.createElement("span");
  column.className = styles.timelineColumn;
  mask.append(column);
  marker.append(mask, dot);
  root.append(track, marker);

  let year = SCENE_YEARS[0];
  let scene = 0;
  const place = (target: number) => root.style.setProperty("--at", at(target).toString());
  const showYear = (value: number) => {
    column.style.transition = "none";
    column.style.transform = "translateY(0)";
    column.replaceChildren(Object.assign(document.createElement("span"), { textContent: String(value) }));
  };
  place(year);
  showYear(year);

  const pulse = () => {
    dot.classList.remove(styles.timelinePulse);
    void dot.offsetWidth; // reinicia a animação do pulso
    dot.classList.add(styles.timelinePulse);
  };

  const roll = (from: number, to: number) => {
    const back = to < from;
    // Coluna com todos os anos do caminho. Voltando: de cima para baixo (2017, 2016, 2015) e a
    // coluna sobe. Avançando: a mesma coluna invertida, que desce.
    const path: number[] = [];
    for (let value = from; back ? value >= to : value <= to; value += back ? -1 : 1) path.push(value);
    const ordered = back ? path : [...path].reverse();
    column.style.transition = "none";
    column.replaceChildren(...ordered.map((value) => Object.assign(document.createElement("span"), { textContent: String(value) })));
    const steps = path.length - 1;
    const start = back ? 0 : -steps;
    const end = back ? -steps : 0;
    column.style.transform = `translateY(${start * 100 / path.length}%)`;
    void column.offsetWidth;
    column.style.transition = `transform ${ROLL_MS}ms cubic-bezier(.6, 0, .25, 1)`;
    column.style.transform = `translateY(${end * 100 / path.length}%)`;
    const done = () => { column.removeEventListener("transitionend", done); if (year === to) showYear(to); };
    column.addEventListener("transitionend", done);
    place(to);
  };

  return {
    // Chamado a cada quadro com a cena atual (0 rua, 1 cozinha, 2 Opala); só age na troca.
    setScene: (next: number) => {
      if (next === scene) return;
      scene = next;
      const target = SCENE_YEARS[next];
      if (target === year) {
        pulse();
        return;
      }
      const from = year;
      year = target;
      roll(from, target);
    },
  };
}
