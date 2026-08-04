/**
 * Manifesto de assets do case ASTER. Cada entrada documenta o arquivo
 * final esperado — proporção, dimensão mínima, formato, onde entra na
 * página, se precisa de fundo transparente e o alt text sugerido — pra
 * dar pra trocar um placeholder por um arquivo real sem reescrever
 * nenhum componente de layout, só passando `imageSrc` no lugar certo.
 *
 * Nenhum arquivo final existe ainda. Enquanto isso, cada id renderiza um
 * <AssetPlaceholder /> (ver assets/AssetPlaceholder.tsx) mostrando essas
 * mesmas informações na própria página — funciona como documentação viva
 * de handoff.
 */

export type AsterAssetFormat = "JPG ou PNG" | "PNG (fundo transparente)" | "MP4 ou GIF" | "SVG";

export interface AsterAssetSpec {
  id: string;
  label: string;
  /** Proporção largura/altura, ex: "16/9" */
  aspectRatio: string;
  minWidth: number;
  minHeight: number;
  format: AsterAssetFormat;
  placement: string;
  transparent: boolean;
  alt: string;
  /** Quando definido, AssetPlaceholder renderiza a imagem real em vez do placeholder. */
  src?: string;
  /** Fonte alternativa pra telas ≤599px (renderiza via <picture>). */
  srcMobile?: string;
}

export const asterAssetManifest: Record<string, AsterAssetSpec> = {
  "aster-physician-device-hero": {
    id: "aster-physician-device-hero",
    label: "Médica usando o dispositivo ambiente ASTER numa consulta",
    aspectRatio: "4/5",
    minWidth: 1122,
    minHeight: 1402,
    format: "JPG ou PNG",
    placement: "Hero",
    transparent: false,
    alt: "Physician wearing the ASTER device while speaking with a patient.",
    src: "/images/aster/aster-physician-device-hero.png",
  },
  "aster-device-control-macro": {
    id: "aster-device-control-macro",
    label: "Detalhe editorial: controle físico do dispositivo ASTER",
    aspectRatio: "1912/823",
    minWidth: 1912,
    minHeight: 823,
    format: "JPG ou PNG",
    placement: "Abertura de How it works — detalhe, sem virar seção própria",
    transparent: false,
    alt: "Physician pressing the control on the wearable ASTER device.",
    src: "/images/aster/aster-device-control-macro.png",
  },
  "aster-working-notes": {
    id: "aster-working-notes",
    label: "Comparação editorial: AI Draft vs My Notes",
    aspectRatio: "8/5",
    minWidth: 2400,
    minHeight: 1500,
    format: "JPG ou PNG",
    placement: "Decisão 5c — AI Draft is not My Notes",
    transparent: false,
    alt: "Comparison between AI Draft and physician-authored My Notes.",
    src: "/images/aster/aster-working-notes-desktop.png",
    srcMobile: "/images/aster/aster-working-notes-mobile.png",
  },
  "aster-closing-workspace": {
    id: "aster-closing-workspace",
    label: "Fechamento: médica revisando o workspace ASTER",
    aspectRatio: "1915/821",
    minWidth: 1915,
    minHeight: 821,
    format: "JPG ou PNG",
    placement: "Closing — não usar no Hero nem como mockup principal de How it works",
    transparent: false,
    alt: "Physician reviewing the ASTER consultation workspace on a laptop.",
    src: "/images/aster/aster-closing-workspace.png",
  },
  "aster-prototype-hero": {
    id: "aster-prototype-hero",
    label: "Composição editorial do protótipo ASTER",
    aspectRatio: "16/9",
    minWidth: 1600,
    minHeight: 900,
    format: "JPG ou PNG",
    placement: "Hero (fragmento de interface) e CTA do protótipo",
    transparent: false,
    alt: "Fragmento da interface do workspace ASTER mostrando contexto do paciente e transcrição ao vivo.",
    src: "/images/aster/aster-prototype-hero.png",
  },
  "aster-known-patient": {
    id: "aster-known-patient",
    label: "Estado: paciente identificado",
    aspectRatio: "16/10",
    minWidth: 1400,
    minHeight: 875,
    format: "JPG ou PNG",
    placement: "Seção 11 — Patient identity and ambiguity",
    transparent: false,
    alt: "Workspace ASTER com o contexto completo de um paciente já identificado, histórico disponível.",
  },
  "aster-unknown-patient": {
    id: "aster-unknown-patient",
    label: "Estado: paciente não identificado",
    aspectRatio: "16/10",
    minWidth: 1400,
    minHeight: 875,
    format: "JPG ou PNG",
    placement: "Seção 11 — Patient identity and ambiguity",
    transparent: false,
    alt: "Workspace ASTER capturando a consulta sem nenhum contexto de paciente anexado.",
  },
  "aster-ambiguous-match": {
    id: "aster-ambiguous-match",
    label: "Estado: correspondência ambígua de paciente",
    aspectRatio: "16/10",
    minWidth: 1400,
    minHeight: 875,
    format: "JPG ou PNG",
    placement: "Seção 11 — Patient identity and ambiguity",
    transparent: false,
    alt: "Tela pedindo confirmação explícita entre dois ou mais pacientes com nomes semelhantes.",
  },
  "aster-recording-paused": {
    id: "aster-recording-paused",
    label: "Estado: gravação pausada",
    aspectRatio: "16/10",
    minWidth: 1400,
    minHeight: 875,
    format: "JPG ou PNG",
    placement: "Seção 14 — Control over recording",
    transparent: false,
    alt: "Transcrição ao vivo pausada, com um marcador visível indicando o intervalo sem captura.",
  },
  "aster-correction-needed": {
    id: "aster-correction-needed",
    label: "Estado: correção com histórico visível",
    aspectRatio: "16/10",
    minWidth: 1400,
    minHeight: 875,
    format: "JPG ou PNG",
    placement: "Seção 15 — Correction and provenance",
    transparent: false,
    alt: "Interpretação original da IA ao lado da correção feita pelo médico, com explicação do que mudou.",
  },
  "aster-insight-detail": {
    id: "aster-insight-detail",
    label: "Detalhe de um Insight na transcrição",
    aspectRatio: "3/2",
    minWidth: 1200,
    minHeight: 800,
    format: "JPG ou PNG",
    placement: "Seção 12 — Restrained Insights",
    transparent: false,
    alt: "Cartão de Insight expandido mostrando contexto, motivo do aparecimento e status de revisão do médico.",
  },
  "aster-ai-draft": {
    id: "aster-ai-draft",
    label: "AI Draft (rascunho gerado pela IA)",
    aspectRatio: "4/3",
    minWidth: 1200,
    minHeight: 900,
    format: "JPG ou PNG",
    placement: "Seção 13 — AI Draft and My Notes",
    transparent: false,
    alt: "Painel de rascunho gerado automaticamente a partir dos eventos da consulta, organizado e revisável.",
  },
  "aster-my-notes": {
    id: "aster-my-notes",
    label: "My Notes (notas do médico)",
    aspectRatio: "4/3",
    minWidth: 1200,
    minHeight: 900,
    format: "JPG ou PNG",
    placement: "Seção 13 — AI Draft and My Notes",
    transparent: false,
    alt: "Painel de notas autoradas pelo médico, com edição inline e indicador de salvamento automático.",
  },
  "aster-macbook-mockup": {
    id: "aster-macbook-mockup",
    label: "Mockup em MacBook do workspace ASTER",
    aspectRatio: "16/10",
    minWidth: 2000,
    minHeight: 1250,
    format: "JPG ou PNG",
    placement: "Seção 10 — Product walkthrough",
    transparent: false,
    alt: "Workspace ASTER completo exibido num MacBook, mostrando as três zonas de trabalho lado a lado.",
    src: "/images/aster/aster-macbook-mockup.png",
  },
  "aster-screen-miscellany": {
    id: "aster-screen-miscellany",
    label: "Miscelânea editorial de telas sobrepostas",
    aspectRatio: "5/4",
    minWidth: 1600,
    minHeight: 1280,
    format: "PNG (fundo transparente)",
    placement: "Seção 13 — AI Draft and My Notes (composição de apoio)",
    transparent: true,
    alt: "Composição sobreposta de vários recortes de tela do ASTER, sem hierarquia única de leitura.",
  },
  "aster-figjam-overview": {
    id: "aster-figjam-overview",
    label: "FigJam — visão geral do discovery",
    aspectRatio: "21/9",
    minWidth: 2000,
    minHeight: 857,
    format: "JPG ou PNG",
    placement: "Seção 6 — Questions before interfaces (abertura)",
    transparent: false,
    alt: "Visão panorâmica do board de discovery do ASTER, mostrando a extensão do processo sem detalhe legível.",
    src: "/images/aster/aster-figjam-overview.png",
  },
  "aster-figjam-critical-questions": {
    id: "aster-figjam-critical-questions",
    label: "FigJam — recorte de perguntas críticas",
    aspectRatio: "4/3",
    minWidth: 1400,
    minHeight: 1050,
    format: "JPG ou PNG",
    placement: "Seção 6 — Questions before interfaces",
    transparent: false,
    alt: "Recorte focado do FigJam com as perguntas que moldaram os limites da interação entre IA e médico.",
  },
  "aster-figjam-simulation": {
    id: "aster-figjam-simulation",
    label: "FigJam — recorte da simulação interna",
    aspectRatio: "4/3",
    minWidth: 1400,
    minHeight: 1050,
    format: "JPG ou PNG",
    placement: "Seção 7 — Proposed internal simulation",
    transparent: false,
    alt: "Recorte do FigJam documentando a estrutura da simulação interna e as variações testadas.",
  },
  "aster-figjam-decisions": {
    id: "aster-figjam-decisions",
    label: "FigJam — recorte conectando descobertas a decisões",
    aspectRatio: "4/3",
    minWidth: 1400,
    minHeight: 1050,
    format: "JPG ou PNG",
    placement: "Seção 16 — From discovery to decisions",
    transparent: false,
    alt: "Recorte do FigJam ligando um achado específico do discovery à decisão de produto que ele gerou.",
  },
  "aster-figjam-hard-no": {
    id: "aster-figjam-hard-no",
    label: "FigJam — recorte das condições de Hard No",
    aspectRatio: "4/3",
    minWidth: 1400,
    minHeight: 1050,
    format: "JPG ou PNG",
    placement: "Seção 17 — Defining what would make us stop",
    transparent: false,
    alt: "Recorte do FigJam listando as condições que fariam a equipe parar de investir no conceito.",
  },
  "aster-walkthrough-video": {
    id: "aster-walkthrough-video",
    label: "Vídeo curto de walkthrough do protótipo",
    aspectRatio: "16/9",
    minWidth: 1920,
    minHeight: 1080,
    format: "MP4 ou GIF",
    placement: "Seção 10 — Product walkthrough (alternativa/complemento ao mockup estático)",
    transparent: false,
    alt: "Gravação de tela curta demonstrando a captura de uma consulta e a geração de um Insight no ASTER.",
  },
};

export type AsterAssetId = keyof typeof asterAssetManifest;
