import { AssetPlaceholder } from "../assets/AssetPlaceholder";
import { Tag } from "@/components/Tag/Tag";
import { Section } from "./Section";
import { ExternalLink } from "./ExternalLink";
import { ASTER_FIGJAM_URL } from "./links";
import shared from "./shared.module.css";
import type { Locale } from "@/components/NavBar/NavBar";
import styles from "./DesignDecisions.module.css";

const ASSET_IDS = {
  known: "aster-known-patient",
  unknown: "aster-unknown-patient",
  ambiguous: "aster-ambiguous-match",
} as const;

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  decision5a: {
    title: string;
    risk: string;
    patientStates: Array<{ assetId: (typeof ASSET_IDS)[keyof typeof ASSET_IDS]; title: string; tagLabel: string }>;
    keyStatement: string;
    factualCaption: string;
    limitation: string;
  };
  decision5b: {
    title: string;
    risk: string;
    mockLabel: string;
    mockContext: string;
    mockReason: string;
    mockStatus: string;
    mockDirection: string;
    body: string;
    plainCaption: string;
  };
  decision5c: { title: string; risk: string; plainCaption: string };
  decision5d: {
    title: string;
    risk: string;
    steps: string[];
    sketchTag: string;
    body: string;
    caption: string;
  };
  disclosureSummary: string;
  figjamLink: string;
  tableCaption: string;
  thFinding: string;
  thDecision: string;
  discoveryMappings: Array<{ finding: string; decision: string }>;
}> = {
  en: {
    eyebrow: "Four design decisions",
    title: "Show me an actual decision",
    decision5a: {
      title: "Better no patient than the wrong patient",
      risk: "Risk: identifying the wrong patient is worse than not identifying one at all.",
      patientStates: [
        { assetId: ASSET_IDS.known, title: "Known Patient", tagLabel: "Functional prototype scenario" },
        { assetId: ASSET_IDS.unknown, title: "Unknown Patient", tagLabel: "Selectable representation" },
        { assetId: ASSET_IDS.ambiguous, title: "Ambiguous Match", tagLabel: "Selectable representation" },
      ],
      keyStatement:
        "When identity is uncertain, ASTER should withhold patient history rather than risk presenting the wrong record. The physician can continue the consultation without patient context and resolve the identity separately.",
      factualCaption:
        "Known Patient is the only complete scenario in the portfolio prototype. Unknown Patient and Ambiguous Match are selectable representations of the intended states, not fully implemented scenarios.",
      limitation:
        "Remaining limitation: real identification would depend on integration and operational validation this project didn't reach.",
    },
    decision5b: {
      title: "A suggestion should look like a suggestion",
      risk: "Risk: a surfaced possibility can look like a diagnosis if it's not handled carefully.",
      mockLabel: "Insight · fictional example",
      mockContext: "“Patient mentioned a change in their medication routine earlier in the conversation.”",
      mockReason: "Why it appeared: the AI Draft flagged a topic shift involving medication.",
      mockStatus: "Not yet reviewed",
      mockDirection: "Sources & confidence — planned direction",
      body: "Design decision: Insights are reviewable, not authoritative. They don't interrupt the consultation, they explain why they appeared, and they wait for physician review.",
      plainCaption:
        "Restrained Insight behavior, shown above, is implemented in the portfolio prototype. A sources-and-confidence indicator remains a planned direction, not something built yet.",
    },
    decision5c: {
      title: "AI Draft is not My Notes",
      risk: "Risk: merging AI-generated and physician-authored content would blur who's accountable for what.",
      plainCaption: "Implemented in the portfolio prototype.",
    },
    decision5d: {
      title: "An error should be corrected, not erased",
      risk: "Risk: silently rewriting a mistake erases how it happened.",
      steps: [
        "Initial AI interpretation",
        "Physician correction",
        "Affected draft content updated",
        "Dependent insight updated or withdrawn",
        "Visible explanation of why it changed",
      ],
      sketchTag: "Planned, not built",
      body: "Design decision: a correction should update dependent content, not delete the trail — the previous interpretation stays visible, with an explanation of what changed.",
      caption: "I designed this direction, but it was never tested.",
    },
    disclosureSummary: "See the discovery behind these decisions",
    figjamLink: "Explore the discovery board",
    tableCaption: "Mapping between discovery findings and the prototype decisions they informed",
    thFinding: "Discovery finding / risk",
    thDecision: "Prototype response / design decision",
    discoveryMappings: [
      { finding: "Wrong patient risk", decision: "Patient identification and ambiguity flows" },
      { finding: "Too much interruption", decision: "Restrained Insight behavior" },
      { finding: "Need for human control", decision: "Pause and review states" },
      { finding: "Need for authorship", decision: "AI Draft / My Notes" },
      { finding: "Need for traceability", decision: "Sources and confidence direction" },
      { finding: "Need for safe recovery", decision: "Autosave and Undo" },
      { finding: "High attention cost", decision: "Ambient device and post-consultation review" },
    ],
  },
  pt: {
    eyebrow: "Quatro decisões de design",
    title: "Me mostra uma decisão de verdade",
    decision5a: {
      title: "Melhor nenhum paciente do que o paciente errado",
      risk: "Risco: identificar o paciente errado é pior do que não identificar nenhum.",
      patientStates: [
        { assetId: ASSET_IDS.known, title: "Known Patient", tagLabel: "Cenário funcional no protótipo" },
        { assetId: ASSET_IDS.unknown, title: "Unknown Patient", tagLabel: "Representação selecionável" },
        { assetId: ASSET_IDS.ambiguous, title: "Ambiguous Match", tagLabel: "Representação selecionável" },
      ],
      keyStatement:
        "Quando a identidade é incerta, o ASTER deve reter o histórico do paciente em vez de arriscar apresentar o registro errado. O médico pode continuar a consulta sem contexto do paciente e resolver a identidade separadamente.",
      factualCaption:
        "Known Patient é o único cenário completo no protótipo de portfólio. Unknown Patient e Ambiguous Match são representações selecionáveis dos estados pretendidos, não cenários totalmente implementados.",
      limitation:
        "Limitação remanescente: identificação real dependeria de integração e validação operacional que este projeto não alcançou.",
    },
    decision5b: {
      title: "Uma sugestão deve parecer uma sugestão",
      risk: "Risco: uma possibilidade trazida à tona pode parecer um diagnóstico se não for tratada com cuidado.",
      mockLabel: "Insight · exemplo fictício",
      mockContext: "“Paciente mencionou uma mudança na rotina de medicação mais cedo na conversa.”",
      mockReason: "Por que apareceu: o AI Draft sinalizou uma mudança de tópico envolvendo medicação.",
      mockStatus: "Ainda não revisado",
      mockDirection: "Fontes e confiança — direção planejada",
      body: "Decisão de design: Insights são revisáveis, não autoritativos. Eles não interrompem a consulta, explicam por que apareceram e aguardam a revisão do médico.",
      plainCaption:
        "O comportamento comedido de Insight, mostrado acima, está implementado no protótipo de portfólio. Um indicador de fontes e confiança continua sendo uma direção planejada, ainda não construída.",
    },
    decision5c: {
      title: "AI Draft não é My Notes",
      risk: "Risco: fundir conteúdo gerado por IA com conteúdo escrito pelo médico borraria quem é responsável por quê.",
      plainCaption: "Implementado no protótipo de portfólio.",
    },
    decision5d: {
      title: "Um erro deve ser corrigido, não apagado",
      risk: "Risco: reescrever silenciosamente um erro apaga como ele aconteceu.",
      steps: [
        "Interpretação inicial da IA",
        "Correção do médico",
        "Conteúdo de rascunho afetado atualizado",
        "Insight dependente atualizado ou retirado",
        "Explicação visível do motivo da mudança",
      ],
      sketchTag: "Planejado, não construído",
      body: "Decisão de design: uma correção deve atualizar conteúdo dependente, não apagar o rastro — a interpretação anterior permanece visível, com uma explicação do que mudou.",
      caption: "Eu desenhei essa direção, mas ela nunca foi testada.",
    },
    disclosureSummary: "Veja o discovery por trás dessas decisões",
    figjamLink: "Explore o board de discovery",
    tableCaption: "Mapeamento entre achados do discovery e as decisões de protótipo que eles informaram",
    thFinding: "Achado do discovery / risco",
    thDecision: "Resposta no protótipo / decisão de design",
    discoveryMappings: [
      { finding: "Risco de paciente errado", decision: "Fluxos de identificação e ambiguidade de paciente" },
      { finding: "Interrupção em excesso", decision: "Comportamento comedido de Insight" },
      { finding: "Necessidade de controle humano", decision: "Estados de pausa e revisão" },
      { finding: "Necessidade de autoria", decision: "AI Draft / My Notes" },
      { finding: "Necessidade de rastreabilidade", decision: "Direção de fontes e confiança" },
      { finding: "Necessidade de recuperação segura", decision: "Salvamento automático e Desfazer" },
      { finding: "Alto custo de atenção", decision: "Dispositivo ambiente e revisão pós-consulta" },
    ],
  },
};

export function DesignDecisions({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <Section id="design-decisions" eyebrow={t.eyebrow} title={t.title} tone="stone">
      {/* 5a — Patient identity */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>{t.decision5a.title}</h3>
        <p className={shared.caption}>{t.decision5a.risk}</p>

        <div className={shared.grid3}>
          {t.decision5a.patientStates.map((state) => (
            <div key={state.assetId} className={styles.patientCard}>
              <AssetPlaceholder assetId={state.assetId} />
              <div className={styles.patientMeta}>
                <span className={styles.patientName}>{state.title}</span>
                <Tag>{state.tagLabel}</Tag>
              </div>
            </div>
          ))}
        </div>

        <p className={shared.keyStatement}>{t.decision5a.keyStatement}</p>
        <p className={styles.factualCaption}>{t.decision5a.factualCaption}</p>
        <p className={shared.caption}>{t.decision5a.limitation}</p>
      </div>

      {/* 5b — Insight */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>{t.decision5b.title}</h3>
        <p className={shared.caption}>{t.decision5b.risk}</p>

        <div className={styles.mock}>
          <p className={styles.mockLabel}>{t.decision5b.mockLabel}</p>
          <p className={styles.mockContext}>{t.decision5b.mockContext}</p>
          <p className={styles.mockReason}>{t.decision5b.mockReason}</p>
          <div className={styles.mockFooter}>
            <span className={styles.mockStatus}>{t.decision5b.mockStatus}</span>
            <span className={styles.mockDirection}>{t.decision5b.mockDirection}</span>
          </div>
        </div>

        <p>{t.decision5b.body}</p>
        <p className={styles.plainCaption}>{t.decision5b.plainCaption}</p>
      </div>

      {/* 5c — AI Draft vs My Notes */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>{t.decision5c.title}</h3>
        <p className={shared.caption}>{t.decision5c.risk}</p>

        <AssetPlaceholder assetId="aster-working-notes" />

        <p className={styles.plainCaption}>{t.decision5c.plainCaption}</p>
      </div>

      {/* 5d — Correction provenance */}
      <div className={styles.decision}>
        <h3 className={styles.decisionTitle}>{t.decision5d.title}</h3>
        <p className={shared.caption}>{t.decision5d.risk}</p>

        <ol className={shared.list}>
          {t.decision5d.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <div className={styles.sketchWrap}>
          <AssetPlaceholder assetId="aster-correction-needed" />
          <Tag className={styles.sketchTag}>{t.decision5d.sketchTag}</Tag>
        </div>

        <p>{t.decision5d.body}</p>
        <p className={shared.caption}>{t.decision5d.caption}</p>
      </div>

      {/* Conteúdo secundário — não interrompe a narrativa principal */}
      <details className={styles.disclosure}>
        <summary className={styles.disclosureSummary}>{t.disclosureSummary}</summary>
        <div className={styles.disclosureBody}>
          <AssetPlaceholder assetId="aster-figjam-overview" />
          <ExternalLink href={ASTER_FIGJAM_URL}>{t.figjamLink}</ExternalLink>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.tableCaption}>{t.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.thFinding}</th>
                  <th scope="col">{t.thDecision}</th>
                </tr>
              </thead>
              <tbody>
                {t.discoveryMappings.map((row) => (
                  <tr key={row.finding}>
                    <td>{row.finding}</td>
                    <td>
                      <span aria-hidden="true" className={styles.arrow}>
                        →{" "}
                      </span>
                      {row.decision}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </Section>
  );
}
