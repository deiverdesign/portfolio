import type { CopyKey } from "@/content/site-copy";
import type { Locale } from "@/content/i18n";
import {
  siClaude,
  siClaudecode,
  siFigma,
  siGithub,
  siGoogle,
  siLottiefiles,
  siMaze,
  siNotion,
  siV0,
  type SimpleIcon,
} from "simple-icons";
import { getCopy } from "@/content/site-copy";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import { SectionEntryV3 } from "@/components/SectionEntryV3/SectionEntryV3";
import { TagV3 } from "@/components/TagV3/TagV3";
import styles from "./AboutPageToolsV3.module.css";

export interface AboutPageToolsV3Props {
  locale: Locale;
}

type ToolGroup = {
  titleKey: CopyKey;
  bodyKey: CopyKey;
  toolKeys: readonly CopyKey[];
};

type ToolKey = ToolGroup["toolKeys"][number];

const TOOL_ICONS: Partial<Record<ToolKey, SimpleIcon>> = {
  "about.tools.figma": siFigma,
  // FigJam faz parte do ecossistema Figma e usa a mesma marca no contexto da tag.
  "about.tools.figjam": siFigma,
  "about.tools.lottie": siLottiefiles,
  "about.tools.github": siGithub,
  "about.tools.claude-code": siClaudecode,
  "about.tools.v0": siV0,
  "about.tools.notion": siNotion,
  "about.tools.maze": siMaze,
  "about.tools.claude": siClaude,
  // Nano Banana é uma experiência do Google; a marca Google mantém a referência reconhecível.
  "about.tools.nano-banana": siGoogle,
};

const TOOL_MONOGRAMS: Partial<Record<ToolKey, string>> = {
  "about.tools.fable": "F",
  "about.tools.higgsfield": "H",
};

const TOOL_COLORS: Partial<Record<ToolKey, string>> = {
  "about.tools.figma": "#0D99FF",
  "about.tools.figjam": "#9747FF",
};

function ToolLogo({ toolKey }: { toolKey: ToolKey }) {
  const icon = TOOL_ICONS[toolKey];

  if (icon) {
    return (
      <svg viewBox="0 0 24 24" focusable="false" style={{ color: TOOL_COLORS[toolKey] ?? `#${icon.hex}` }}>
        <path d={icon.path} />
      </svg>
    );
  }

  return <span className={styles.monogram}>{TOOL_MONOGRAMS[toolKey]}</span>;
}

const TOOL_GROUPS: readonly ToolGroup[] = [
  {
    titleKey: "about.tools.design.title",
    bodyKey: "about.tools.design.body",
    toolKeys: ["about.tools.figma", "about.tools.figjam", "about.tools.lottie"],
  },
  {
    titleKey: "about.tools.delivery.title",
    bodyKey: "about.tools.delivery.body",
    toolKeys: ["about.tools.github", "about.tools.claude-code", "about.tools.v0"],
  },
  {
    titleKey: "about.tools.research.title",
    bodyKey: "about.tools.research.body",
    toolKeys: ["about.tools.notion", "about.tools.maze", "about.tools.fable"],
  },
  {
    titleKey: "about.tools.ai.title",
    bodyKey: "about.tools.ai.body",
    toolKeys: ["about.tools.claude", "about.tools.nano-banana", "about.tools.higgsfield"],
  },
];

/** A seção apresenta as ferramentas como parte do processo, não como uma
 * lista de logos. Cada grupo responde a uma capacidade que o portfólio
 * já demonstra: desenhar sistemas, colaborar na entrega, aprender com
 * evidências e explorar com IA de maneira criteriosa. */
export function AboutPageToolsV3({ locale }: AboutPageToolsV3Props) {
  return (
    <section className={styles.section} aria-labelledby="tools-title">
      <div className={styles.container}>
        <SectionEntryV3 className={styles.header} hasEyebrow>
          <div className={styles.heading}>
            <EyebrowV3 data-motion-part="eyebrow">{getCopy(locale, "about.tools.eyebrow")}</EyebrowV3>
            <h2 id="tools-title" className={styles.title} data-motion-part="title">
              {getCopy(locale, "about.tools.title")}
            </h2>
          </div>
          <p className={styles.intro} data-motion-part="body">
            {getCopy(locale, "about.tools.intro")}
          </p>
        </SectionEntryV3>

        <ul className={styles.groups}>
          {TOOL_GROUPS.map((group, index) => (
            <MotionReveal as="li" className={styles.group} key={group.titleKey} delayMs={index * 90} offsetPx={28}>
              <h3>{getCopy(locale, group.titleKey)}</h3>
              <p>{getCopy(locale, group.bodyKey)}</p>
              <div className={styles.tags} aria-label={getCopy(locale, group.titleKey)}>
                {group.toolKeys.map((toolKey) => (
                  <TagV3 key={toolKey} label={getCopy(locale, toolKey)} icon={<ToolLogo toolKey={toolKey} />} />
                ))}
              </div>
            </MotionReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
