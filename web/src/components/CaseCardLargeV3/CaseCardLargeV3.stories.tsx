import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CaseCardLargeV3 } from "./CaseCardLargeV3";
import { HOME_ASSETS, getHomeBrandLogo } from "@/content/home-assets";
import { getCopy } from "@/content/site-copy";

const meta = {
  title: "V3/CaseCardLargeV3",
  component: CaseCardLargeV3,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "fit-content" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CaseCardLargeV3>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Única composição com default E hover conferidos via `get_design_context`
 * contra o Figma real (node 2262:60981, 27/09/2026) — não aproximação. As
 * outras 4 cases ainda têm só o default aproximado; hover pendente.
 *
 * Passe o mouse no card pra ver o hover (título, citação, tags, botão).
 */
export const Scrioo: Story = {
  args: {
    size: "large",
    // Texto default vem de shared.cases.*.summary, não de
    // home.work.*.description (achado de 27/09 — as duas chaves existem,
    // mas só a primeira bate com o que o Figma realmente mostra).
    titleLines: ["AI-powered", "supply chain", "risk intelligence", "platform."],
    href: "/cases/scrioo",
    // Reintroduzido em 27/09: o Deiver confirmou que o logo precisa
    // aparecer mesmo com o container decorativo já tendo a marca desenhada
    // nele — não é redundante, os dois convivem no Figma real.
    logoSrc: getHomeBrandLogo("scrioo", "original"),
    logoAlt: "SCRIOO",
    devices: HOME_ASSETS.cases.scrioo.devices,
    // right:0, top:62px, width:498px no Figma (card 742×480) — sem padding.
    devicesStyle: { right: 0, top: 62, width: 498 },
    decorative: HOME_ASSETS.cases.scrioo.container,
    // 0.6, não 1 — o PNG em si é opaco (medido via getImageData), o nome
    // do arquivo original ("-60perCent-Alpha") era instrução de opacidade
    // CSS, não descrição de alfa já embutido no arquivo.
    decorativeOpacity: 0.6,
    gradientFrom: "var(--color-case-scrioo-card-gradient-from)",
    gradientTo: "var(--color-case-scrioo-card-gradient-to)",
    noiseColor: "var(--color-case-scrioo-card-gradient-from)",
    hoverTitle: getCopy("en", "home.work.scrioo.card-title"),
    hoverQuote: getCopy("en", "home.work.scrioo.contribution"),
    hoverTags: ["Design Systems", "AI", "Data-heavy UX"],
  },
};

export const Hp: Story = {
  args: {
    size: "small",
    titleLines: [
      "Printer subscription",
      "management, from usage",
      "to delivery",
    ],
    href: "/cases/hp",
    logoSrc: getHomeBrandLogo("hp", "white"),
    logoAlt: "HP",
    // HP é logo tipo "mark" (selo, aspect ~1:1) — precisa renderizar mais
    // alto que um wordmark pra pesar igual visualmente (27/09, medido a
    // partir do PDF de referência do Deiver).
    logoType: "mark",
    devices: HOME_ASSETS.cases.hp.devices,
    // left:42px, top:71px, width:391px no Figma real (card 472×480,
    // node 1117:19339, "image 25") — não é o mesmo enquadramento da
    // SCRIOO, cada case tem a posição bespoke conferida no Figma.
    devicesStyle: { left: 42, top: 71, width: 391 },
    // HP é cor sólida no Figma, não gradiente — confirmado via
    // get_design_context (bg-[var(--case/hp/surface,#004ce0)]).
    background: "var(--color-case-hp-surface)",
    noiseColor: "var(--color-case-hp-surface)",
    titleColor: "var(--color-foreground-neutral-inverse-strong)",
    hoverTitle: getCopy("en", "home.work.hp.card-title"),
    hoverQuote: getCopy("en", "home.work.hp.contribution"),
    hoverTags: ["Subscription UX", "Service UX"],
  },
};

export const Theodoor: Story = {
  args: {
    size: "small",
    // Título default só existe em inglês curto no Figma ("Accessible app
    // for smart door automation.") — usei esse texto direto, já que o
    // catálogo ainda não tem uma chave própria pra ele (só tem as de
    // hover). Sinalizar pro Deiver revisar/mover pro catálogo depois.
    titleLines: ["Accessible app", "for smart door", "automation."],
    href: "/cases/theodoor",
    logoSrc: getHomeBrandLogo("theodoor", "white"),
    logoAlt: "Theodoor",
    devices: HOME_ASSETS.cases.theodoor.device,
    // left:50px, top:91px, width:367px — mockup de iPhone centralizado
    // (diferente do encostado-na-direita da SCRIOO/HP), node 1117:19449.
    devicesStyle: { left: 50, top: 91, width: 367 },
    // Era cor sólida (--color-case-theodoor-surface); o Deiver atualizou
    // pra um gradiente diagonal no Figma em 27/09 — reconferido via
    // get_design_context, não é o valor antigo.
    background: "var(--gradient-case-theodoor-card)",
    noiseColor: "var(--color-case-theodoor-surface)",
    titleColor: "var(--color-foreground-neutral-inverse-strong)",
    hoverTitle: getCopy("en", "home.work.theodoor.card-title"),
    hoverQuote: getCopy("en", "home.work.theodoor.contribution"),
    hoverTags: ["A11y", "Physical-digital UX"],
  },
};

export const Intuit: Story = {
  args: {
    size: "small",
    titleLines: ["Financial education", "for everyday", "student life."],
    href: "/cases/intuit",
    logoSrc: getHomeBrandLogo("intuit", "white"),
    logoAlt: "Intuit",
    devices: HOME_ASSETS.cases.intuit.device,
    // left:173px, top:69px, width:299px, ALTURA FIXA 411px (não auto) —
    // node 2246:19406. Corrigido em 27/09: eu tinha deixado height:auto,
    // que respeita a proporção real do arquivo (942×1224) e sobrava uns
    // 23px de vão embaixo, sem bater na borda do card. No Figma real o
    // container tem altura própria (299×411, uma proporção ligeiramente
    // diferente da imagem) e a foto cobre esse espaço via object-fit:
    // cover — por isso aqui a altura é um valor cravado, não calculado.
    devicesStyle: { left: 173, top: 69, width: 299, height: 411, objectFit: "cover" },
    // Intuit é o único gradiente diagonal assimétrico dos 5 — não cabe
    // num par from/to simples (ver NORTE.md 6.6).
    background: "var(--gradient-case-intuit-card)",
    noiseColor: "var(--color-case-intuit-surface)",
    titleColor: "var(--color-foreground-neutral-inverse-strong)",
    hoverTitle: getCopy("en", "home.work.intuit.card-title"),
    hoverQuote: getCopy("en", "home.work.intuit.contribution"),
    hoverTags: ["Design Systems", "Research"],
  },
};

export const Aster: Story = {
  args: {
    size: "small",
    // Corrigido em 27/09: eu tinha usado o texto do HOVER ("When ambient
    // AI should act...") no título default por engano. O default vem de
    // shared.cases.aster.summary — mesma armadilha já documentada
    // (achado de 27/09 com a HP), só que dessa vez passou batido na
    // primeira rodada.
    titleLines: ["Ambient AI for", "clinical", "consultations."],
    href: "/cases/aster",
    logoSrc: getHomeBrandLogo("aster", "white"),
    logoAlt: "Aster",
    // Único dos 5 cases cujo "fundo" não é cor/gradiente CSS — é a própria
    // foto (aster-background.png), conferida pixel a pixel contra o PDF
    // de referência do Deiver: os cantos não batem com um gradiente
    // linear simples de 2 cores. `secondDevice` aqui cobre o card inteiro
    // (não é um device flutuando por cima, é o fundo de verdade); a cor
    // sólida abaixo é só um fallback enquanto a imagem carrega.
    secondDevice: HOME_ASSETS.cases.aster.background,
    secondDeviceStyle: { inset: 0, width: "100%", height: "100%", objectFit: "cover" },
    devices: HOME_ASSETS.cases.aster.foreground,
    // Corrigido em 27/09: a primeira tentativa (left/right em % negativo,
    // rotação implícita por overflow) deixou a foto cortada numa diagonal
    // agressiva, sem o estetoscópio nem o tracker aparecerem — o Deiver
    // mandou print mostrando que devia ser a cena inteira, contida, sem
    // sangrar pra fora. `width` fixo (não left+right) evita a mesma
    // distorção de proporção do bug do NavBar (elemento com aspect ratio
    // não deve ter as duas bordas opostas fixadas ao mesmo tempo).
    devicesStyle: { left: 36, top: 40, width: 401 },
    background: "var(--color-case-aster-card-gradient-from)",
    noiseColor: "var(--color-case-aster-card-gradient-from)",
    titleColor: "var(--color-foreground-neutral-inverse-strong)",
    hoverTitle: getCopy("en", "home.work.aster.card-title"),
    hoverQuote: getCopy("en", "home.work.aster.contribution"),
    hoverTags: ["AI Interaction", "Healthcare"],
    // Case protegido/confidencial — confirmado no Figma (node 2264:72142),
    // mostra selo de cadeado no lugar de deixar o case totalmente aberto.
    locked: true,
  },
};
