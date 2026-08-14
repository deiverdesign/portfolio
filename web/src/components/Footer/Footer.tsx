import { Button } from "@/components/Button/Button";
import styles from "./Footer.module.css";
import { HOME_HREF, RESUME_DOWNLOAD_NAME, RESUME_HREF, type Locale } from "@/components/NavBar/constants";

export interface FooterProps {
  locale: Locale;
}

const CONTENT: Record<Locale, {
  role: string;
  navLinks: Array<{ label: string; href: string }>;
  actions: Array<{ label: string; href: string; download?: string }>;
  copyright: string;
}> = {
  pt: {
    role: "Product Designer Sênior · Floripa · Brasil",
    navLinks: [
      { label: "Projetos", href: "/pt" },
      { label: "Competências", href: "/pt/competencias" },
      { label: "Sobre", href: "/pt/sobre" },
    ],
    actions: [
      { label: "LinkedIn", href: "https://linkedin.com/in/deiverbrito" },
      { label: "Currículo", href: RESUME_HREF.pt, download: RESUME_DOWNLOAD_NAME.pt },
    ],
    copyright: "© 2026 Deiver Brito · Projetando clareza para produtos digitais complexos.",
  },
  en: {
    role: "Senior Product Designer · Floripa · Brazil",
    navLinks: [
      { label: "Work", href: "/" },
      { label: "Capabilities", href: "/capabilities" },
      { label: "About", href: "/about" },
    ],
    actions: [
      { label: "LinkedIn", href: "https://linkedin.com/in/deiverbrito" },
      { label: "Resume", href: RESUME_HREF.en, download: RESUME_DOWNLOAD_NAME.en },
    ],
    copyright: "© 2026 Deiver Brito · Designing clarity for complex digital products.",
  },
};

export function Footer({ locale }: FooterProps) {
  const t = CONTENT[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <a href={HOME_HREF[locale]} className={styles.identity}>
            <strong>Deiver Brito</strong>
            <span>{t.role}</span>
          </a>
          <nav className={styles.links}>
            <div className={styles.navLinks}>
              {t.navLinks.map((link) => (
                <a key={link.label} href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className={styles.actionButtons}>
              {t.actions.map((action) => (
                <Button key={action.label} variant="secondary" context="light" href={action.href} download={action.download}>
                  {action.label}
                </Button>
              ))}
            </div>
          </nav>
        </div>
        <p className={styles.copyright}>{t.copyright}</p>
      </div>
    </footer>
  );
}
