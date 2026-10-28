// Movimento reduzido (Deiver, 24/10): o iPhone de uma leitora pedia menos movimento e ela só via
// o quadro parado. Agora a página pergunta uma vez e lembra a resposta só neste navegador.
// Ex.: "on" = a pessoa pediu para ver a rua andando mesmo com Reduzir Movimento ligado.
// O ajuste do aparelho continua o mesmo; a exceção vale só para este site.
export const MOTION_CHOICE_KEY = "edf:movimento";
export const MOTION_CHOICE_EVENT = "edf:motion-choice";
export type MotionChoice = "on" | "off";
let choiceThisVisit: MotionChoice | null = null;

export function readMotionChoice(): MotionChoice | null {
  try {
    const value = window.localStorage.getItem(MOTION_CHOICE_KEY);
    return value === "on" || value === "off" ? value : choiceThisVisit;
  } catch {
    return choiceThisVisit;
  }
}

export function saveMotionChoice(choice: MotionChoice) {
  choiceThisVisit = choice;
  try {
    window.localStorage.setItem(MOTION_CHOICE_KEY, choice);
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só até fechar a aba.
  }
  window.dispatchEvent(new CustomEvent<MotionChoice>(MOTION_CHOICE_EVENT, { detail: choice }));
}
