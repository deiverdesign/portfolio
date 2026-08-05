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

import type { Locale } from "@/components/NavBar/constants";

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
  /** Alt text por idioma — a página renderizada usa a versão do locale atual. */
  alt: Record<Locale, string>;
  /** Quando definido, AssetPlaceholder renderiza a imagem real em vez do placeholder. */
  src?: string;
  /** Fonte alternativa pra telas ≤599px (renderiza via <picture>). */
  srcMobile?: string;
}

export const asterAssetManifest: Record<string, AsterAssetSpec> = {
  "aster-hero-banner": {
    id: "aster-hero-banner",
    label: "Banner logo após o Hero: médica com paciente",
    aspectRatio: "2040/650",
    minWidth: 2040,
    minHeight: 650,
    format: "JPG ou PNG",
    placement: "Entre o Hero e o Disclaimer",
    transparent: false,
    alt: {
      en: "A physician wearing the ASTER device speaks with an elderly patient in a consultation room.",
      pt: "Uma médica usando o dispositivo ASTER conversa com uma paciente idosa numa sala de consulta.",
    },
    src: "/images/aster/aster-hero-banner.png",
  },
  "aster-how-it-works": {
    id: "aster-how-it-works",
    label: "Composição: controle físico do dispositivo + mockup do MacBook",
    aspectRatio: "1260/530",
    minWidth: 1260,
    minHeight: 530,
    format: "JPG ou PNG",
    placement: "How it works — imagem única, centralizada",
    transparent: false,
    alt: {
      en: "Physician pressing the control on the wearable ASTER device, next to the full workspace displayed on a MacBook.",
      pt: "Médica pressionando o controle do dispositivo vestível ASTER, ao lado do workspace completo exibido num MacBook.",
    },
    src: "/images/aster/aster-how-it-works.png",
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
    alt: {
      en: "Comparison between AI Draft and physician-authored My Notes.",
      pt: "Comparação entre AI Draft e My Notes escritas pela médica.",
    },
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
    alt: {
      en: "Physician reviewing the ASTER consultation workspace on a laptop.",
      pt: "Médica revisando o workspace de consulta do ASTER num laptop.",
    },
    src: "/images/aster/aster-closing-workspace.png",
  },
  "aster-prototype-hero": {
    id: "aster-prototype-hero",
    label: "Composição editorial do protótipo ASTER",
    aspectRatio: "1440/618",
    minWidth: 1440,
    minHeight: 618,
    format: "JPG ou PNG",
    placement: "Hero (fragmento de interface) e CTA do protótipo",
    transparent: false,
    alt: {
      en: "Fragment of the ASTER workspace interface showing patient context and live transcript.",
      pt: "Fragmento da interface do workspace ASTER mostrando contexto do paciente e transcrição ao vivo.",
    },
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
    alt: {
      en: "ASTER workspace with the full context of an already-identified patient, history available.",
      pt: "Workspace ASTER com o contexto completo de um paciente já identificado, histórico disponível.",
    },
    src: "/images/aster/aster-known-patient.png",
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
    alt: {
      en: "ASTER workspace capturing the consultation with no patient context attached yet.",
      pt: "Workspace ASTER capturando a consulta sem nenhum contexto de paciente anexado.",
    },
    src: "/images/aster/aster-unknown-patient.png",
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
    alt: {
      en: "Screen asking for explicit confirmation between two or more patients with similar names.",
      pt: "Tela pedindo confirmação explícita entre dois ou mais pacientes com nomes semelhantes.",
    },
    src: "/images/aster/aster-ambiguous-match.png",
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
    alt: {
      en: "Live transcript paused, with a visible marker indicating the gap without capture.",
      pt: "Transcrição ao vivo pausada, com um marcador visível indicando o intervalo sem captura.",
    },
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
    alt: {
      en: "Expanded Insight card showing context, the reason it appeared, and the physician's review status.",
      pt: "Cartão de Insight expandido mostrando contexto, motivo do aparecimento e status de revisão do médico.",
    },
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
    alt: {
      en: "Panel with a draft automatically generated from the consultation events, organized and reviewable.",
      pt: "Painel de rascunho gerado automaticamente a partir dos eventos da consulta, organizado e revisável.",
    },
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
    alt: {
      en: "Panel with notes authored by the physician, with inline editing and an autosave indicator.",
      pt: "Painel de notas autoradas pelo médico, com edição inline e indicador de salvamento automático.",
    },
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
    alt: {
      en: "Overlapping composition of several ASTER screen crops, with no single reading hierarchy.",
      pt: "Composição sobreposta de vários recortes de tela do ASTER, sem hierarquia única de leitura.",
    },
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
    alt: {
      en: "Panoramic view of the ASTER discovery board, showing the extent of the process without legible detail.",
      pt: "Visão panorâmica do board de discovery do ASTER, mostrando a extensão do processo sem detalhe legível.",
    },
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
    alt: {
      en: "Focused crop of the FigJam board with the questions that shaped the boundaries of AI-physician interaction.",
      pt: "Recorte focado do FigJam com as perguntas que moldaram os limites da interação entre IA e médico.",
    },
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
    alt: {
      en: "FigJam crop documenting the structure of the internal simulation and the variations tested.",
      pt: "Recorte do FigJam documentando a estrutura da simulação interna e as variações testadas.",
    },
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
    alt: {
      en: "FigJam crop connecting a specific discovery finding to the product decision it informed.",
      pt: "Recorte do FigJam ligando um achado específico do discovery à decisão de produto que ele gerou.",
    },
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
    alt: {
      en: "FigJam crop listing the conditions that would make the team stop investing in the concept.",
      pt: "Recorte do FigJam listando as condições que fariam a equipe parar de investir no conceito.",
    },
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
    alt: {
      en: "Short screen recording demonstrating a consultation being captured and an Insight appearing in ASTER.",
      pt: "Gravação de tela curta demonstrando a captura de uma consulta e a geração de um Insight no ASTER.",
    },
    src: "/images/aster/aster-walkthrough-video.mp4",
  },
  "aster-cannot-claim-photo": {
    id: "aster-cannot-claim-photo",
    label: "Foto editorial: dispositivo + workspace, seção 'What wasn't proven here'",
    aspectRatio: "314/466",
    minWidth: 628,
    minHeight: 932,
    format: "JPG ou PNG",
    placement: "Seção 'What wasn't proven here' — coluna de imagem ao lado do texto",
    transparent: false,
    alt: {
      en: "Physician adjusting the ASTER wearable device, with the consultation workspace open on a laptop below.",
      pt: "Médica ajustando o dispositivo vestível ASTER, com o workspace de consulta aberto num laptop abaixo.",
    },
    src: "/images/aster/aster-cannot-claim-photo.png",
  },
};

export type AsterAssetId = keyof typeof asterAssetManifest;
