import { Section } from "./Section";
import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import shared from "./shared.module.css";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./CannotClaim.module.css";

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  para1: string;
  para2: string;
  para3: string;
  keyStatement: string;
  para4: string;
  hardNoExamples: string[];
  captionOnDark: string;
  closing: string;
}> = {
  en: {
    eyebrow: "What this case cannot claim",
    title: "What wasn't proven here",
    para1:
      "During my involvement, this work did not reach testing with physicians or other end users. I did not participate in, and did not receive evidence of, any clinical validation.",
    para2:
      "Before the physical device arrived, I proposed scripted internal simulations to expose interaction failures early. They were not executed during my involvement.",
    para3: "Pause and correction-provenance behavior remained design directions, not built features.",
    keyStatement:
      "The business needed two useful outcomes: evidence that the concept could work, or an early and inexpensive reason to stop.",
    para4:
      "Getting there responsibly would have required clear Hard No criteria — conditions that, if met, meant stopping regardless of momentum or sunk cost. During my involvement, those criteria were never formally defined or tested. A few illustrative examples:",
    hardNoExamples: [
      "A wrong-patient context influencing an output without confirmation",
      "A clinically consequential suggestion no one can trace back to its source",
      "Correcting the AI taking more effort than it saves",
    ],
    captionOnDark: "These are illustrations of the kind of criteria that were missing, not validated thresholds.",
    closing: "These aren't hidden footnotes. They're the limits of what this exploration can responsibly claim.",
  },
  pt: {
    eyebrow: "O que este case não pode afirmar",
    title: "O que não foi provado aqui",
    para1:
      "Durante minha participação, esse trabalho não chegou a testes com médicos ou outros usuários finais. Eu não participei, nem recebi evidência, de nenhuma validação clínica.",
    para2:
      "Antes do dispositivo físico chegar, propus simulações internas roteirizadas para expor falhas de interação cedo. Elas não foram executadas durante minha participação.",
    para3: "O comportamento de pausa e de correção rastreável permaneceu como direção de design, não como funcionalidade construída.",
    keyStatement:
      "O negócio precisava de dois resultados úteis: evidência de que o conceito podia funcionar, ou um motivo antecipado e barato para parar.",
    para4:
      "Chegar lá de forma responsável exigiria critérios claros de Hard No — condições que, se cumpridas, significavam parar independentemente de momentum ou custo afundado. Durante minha participação, esses critérios nunca foram formalmente definidos ou testados. Alguns exemplos ilustrativos:",
    hardNoExamples: [
      "Um contexto de paciente errado influenciando uma saída sem confirmação",
      "Uma sugestão clinicamente relevante que ninguém consegue rastrear até sua origem",
      "Corrigir a IA exigir mais esforço do que ela economiza",
    ],
    captionOnDark: "Essas são ilustrações do tipo de critério que estava faltando, não limites validados.",
    closing: "Essas não são notas de rodapé escondidas. São os limites do que essa exploração pode afirmar com responsabilidade.",
  },
};

export function CannotClaim({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <Section id="cannot-claim" eyebrow={t.eyebrow} title={t.title} tone="forestDeep">
      <div className={styles.layout}>
        <div className={styles.imageCol}>
          <AssetPlaceholder assetId="aster-cannot-claim-photo" />
        </div>

        <div className={styles.textCol}>
          <p>{t.para1}</p>
          <p>{t.para2}</p>
          <p>{t.para3}</p>

          <p className={shared.keyStatementOnDark}>{t.keyStatement}</p>

          <p>{t.para4}</p>

          <ul className={shared.list}>
            {t.hardNoExamples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>

          <p className={shared.captionOnDark}>{t.captionOnDark}</p>

          <p>{t.closing}</p>
        </div>
      </div>
    </Section>
  );
}
