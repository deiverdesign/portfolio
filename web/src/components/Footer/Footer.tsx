import styles from "./Footer.module.css";
import { HOME_HREF, RESUME_DOWNLOAD_NAME, RESUME_HREF, type Locale } from "@/components/NavBar/constants";

export interface FooterProps {
  locale: Locale;
}

const CONTENT: Record<Locale, {
  role: string;
  links: Array<{ label: string; href: string; download?: string }>;
  copyright: string;
}> = {
  pt: {
    role: "Product Designer Sênior · Floripa · Brasil",
    links: [
      { label: "Trabalho", href: "/pt" },
      { label: "Competências", href: "/pt/competencias" },
      { label: "Sobre", href: "/pt/sobre" },
      { label: "LinkedIn", href: "https://linkedin.com/in/deiverbrito" },
      { label: "Currículo", href: RESUME_HREF.pt, download: RESUME_DOWNLOAD_NAME.pt },
    ],
    copyright: "© 2026 Deiver Brito · Projetando clareza para produtos digitais complexos.",
  },
  en: {
    role: "Senior Product Designer · Floripa · Brazil",
    links: [
      { label: "Work", href: "/" },
      { label: "Capabilities", href: "/capabilities" },
      { label: "About", href: "/about" },
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
            {t.links.map((link) => (
              <a key={link.label} href={link.href} download={link.download}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.copyright}>{t.copyright}</p>
      </div>
    </footer>
  );
}
