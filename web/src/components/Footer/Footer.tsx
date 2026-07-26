import styles from "./Footer.module.css";

const links = [
  { label: "Trabalho", href: "/" },
  { label: "Competências", href: "/competencias" },
  { label: "Sobre", href: "/sobre" },
  { label: "LinkedIn", href: "https://linkedin.com/in/deiverbrito" },
  { label: "Currículo", href: "/curriculo.pdf" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <strong>Deiver Brito</strong>
            <span>Product Designer Sênior · Floripa · Brasil</span>
          </div>
          <nav className={styles.links}>
            {links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.copyright}>
          © 2026 Deiver Brito · Projetando clareza para produtos digitais complexos.
        </p>
      </div>
    </footer>
  );
}
