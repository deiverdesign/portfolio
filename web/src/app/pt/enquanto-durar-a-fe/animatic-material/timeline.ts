// LINHA DO TEMPO (Deiver, 13/10): narrativa, não é navegação (nada aqui é clicável).
// Uma linha fina com um marcador por ano do livro e, acima do marcador ativo, o ano.
// - Mesma cena no mesmo ano (rua → cozinha, as duas em junho de 2017): o ano não muda,
//   só o marcador dá um pulso curto.
// - Mudança de ano (cozinha 2017 → Opala 2015): o ano gira como um contador, dentro de uma
//   máscara. Voltando no tempo, 2017 sobe e some pelo topo e 2016, 2015 entram por baixo;
//   avançando, o contrário. Ao mesmo tempo o marcador desliza até o ano novo na linha.
// Desktop: o marcador anda pela linha. Celular: o marcador fica no meio e a linha anda por
// baixo dele (só ~5 marcadores cabem), com o ano sempre acima do marcador central.
// Ex.: setScene(2) na volta da cozinha para a rua do Opala → 2017 ▲ 2016 ▲ 2015 em ~0,75 s.

// Ano de cada cena, pelas datas do livro: cap. 1 e 3 = junho de 2017; cap. 5 = junho de 2015.
export const SCENE_YEARS = [2017, 2017, 2015];
// A linha cobre os anos em que o livro se passa (cap. 6 = 2010, cap. 1 = 2017).
const FIRST_YEAR = 2010;
const LAST_YEAR = 2017;
const ROLL_MS = 750;

export function createTimeline(root: HTMLElement, styles: Record<string, string>) {
  const years = LAST_YEAR - FIRST_YEAR;
  // Posição de um ano na linha, de 0 (2010) a 1 (2017).
  const at = (year: number) => (year - FIRST_YEAR) / years;

  root.replaceChildren();
  const track = document.createElement("div");
  track.className = styles.timelineTrack;
  for (let year = FIRST_YEAR; year <= LAST_YEAR; year++) {
    const tick = document.createElement("i");
    tick.className = styles.timelineTick;
    tick.style.setProperty("--at", at(year).toString());
    track.append(tick);
  }
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
