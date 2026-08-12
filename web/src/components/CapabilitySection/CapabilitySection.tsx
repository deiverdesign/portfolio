import { Tag } from "@/components/Tag/Tag";
import { ProjectTile } from "@/components/ProjectTile/ProjectTile";
import styles from "./CapabilitySection.module.css";

export interface CaseStudyTile {
  name: string;
  logoSrc: string;
  href: string;
  ariaLabel: string;
}

export interface OtherWorkTile {
  name: string;
  logoSrc: string;
}

export interface CapabilitySectionProps {
  number: string;
  title: string;
  tags: string[];
  description: string;
  caseStudiesLabel: string;
  otherWorkLabel: string;
  caseStudies: CaseStudyTile[];
  otherWork: OtherWorkTile[];
}

export function CapabilitySection({
  number,
  title,
  tags,
  description,
  caseStudiesLabel,
  otherWorkLabel,
  caseStudies,
  otherWork,
}: CapabilitySectionProps) {
  const hasCaseStudies = caseStudies.length > 0;
  const hasOtherWork = otherWork.length > 0;

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <span className={styles.number}>{number}</span>
        <div className={styles.tagRow}>
          {tags.map((tag) => (
            <Tag key={tag} context="light" className={styles.tagOverride}>
              {tag}
            </Tag>
          ))}
        </div>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.right}>
        <p className={styles.description}>{description}</p>
        <div className={styles.divider} />

        <div className={styles.groups}>
          {hasCaseStudies && (
            <div className={styles.group}>
              <span className={styles.groupLabel}>{caseStudiesLabel}</span>
              <div className={styles.tileGrid}>
                {caseStudies.map((item) => (
                  <ProjectTile
                    key={item.name}
                    name={item.name}
                    logoSrc={item.logoSrc}
                    href={item.href}
                    ariaLabel={item.ariaLabel}
                  />
                ))}
              </div>
            </div>
          )}

          {hasOtherWork && (
            <div className={styles.group}>
              <span className={styles.groupLabel}>{otherWorkLabel}</span>
              <div className={styles.tileGrid}>
                {otherWork.map((item) => (
                  <ProjectTile key={item.name} name={item.name} logoSrc={item.logoSrc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
