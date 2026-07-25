"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import styles from "./NavBar.module.css";

export type NavBarContext = "light" | "dark";

export interface NavBarProps {
  /** Sobre qual fundo a NavBar está — mesma propriedade "Context" no Figma. */
  context?: NavBarContext;
  lang?: "PT" | "EN";
}

const navItems = [
  { label: "Trabalho", href: "/" },
  { label: "Competências", href: "/competencias" },
  { label: "Sobre", href: "/sobre" },
];

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function NavBar({ context = "light", lang = "PT" }: NavBarProps) {
  const [open, setOpen] = useState(false);

  const links = (
    <div className={styles.navLinks}>
      {navItems.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
      <a href="/curriculo.pdf">Currículo ↗</a>
    </div>
  );

  const langSwitch = (
    <div className={styles.langSwitch}>
      <button type="button" aria-current={lang === "EN"}>
        EN
      </button>
      <button type="button" aria-current={lang === "PT"}>
        PT
      </button>
    </div>
  );

  return (
    <nav className={`${styles.navbar} ${styles[context]}`}>
      <div className={styles.topRow}>
        <div className={styles.identity}>
          <strong>Deiver Brito</strong>
          <span>Product Designer Sênior</span>
        </div>

        {/* Desktop: tudo visível numa linha. Escondido via CSS abaixo de 1024px. */}
        <div className={styles.desktopNav}>
          {links}
          <Button variant="primary" context={context}>
            Contato
          </Button>
          {langSwitch}
        </div>

        {/* Mobile/Tablet: botão hambúrguer que abre um painel — troca de estrutura, não reflow */}
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={styles.mobilePanel} data-open={open}>
        {links}
        <Button variant="primary" context={context}>
          Contato
        </Button>
        {langSwitch}
      </div>
    </nav>
  );
}
