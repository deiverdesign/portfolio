import styles from "./Footer.module.css";
import { RESUME_HREF, type Locale } from "@/components/NavBar/NavBar";

export interface FooterProps {
  locale: Locale;
}

const CONTENT: Record<Locale, {
  role: string;
  links: Array<{ label: string; href: string }>;
  copyright: string;
}> = {
  pt: {
    role: "Product Designer Sênior · Floripa · Brasil",
    links: [
      { label: "Trabalho", href: "/" },
      { label: "Competências", href: "/competencias" },
      { label: "Sobre", href: "/sobre" },
      { label: "LinkedIn", href: "https://linkedin.com/in/deiverbrito" },
      { label: "Currículo", href: RESUME_HREF.pt },
    ],
    copyright: "© 2026 Deiver Brito · Projetando clareza para produtos digitais complexos.",
  },
  en: {
    role: "Senior Product Designer · Floripa · Brazil",
    links: [
      { label: "Work", href: "/en" },
      { label: "Capabilities", href: "/en/capabilities" },
      { label: "About", href: "/en/about" },
      { label: "LinkedIn", href: "https://linkedin.com/in/deiverbrito" },
      { label: "Resume", href: RESUME_HREF.en },
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
          <div className={styles.identity}>
            <strong>Deiver Brito</strong>
            <span>{t.role}</span>
          </div>
          <nav className={styles.links}>
            {t.links.map((link) => (
              <a key={link.label} href={link.href}>
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
