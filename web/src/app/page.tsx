import { NavBar } from "@/components/NavBar/NavBar";
import { Button } from "@/components/Button/Button";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { Footer } from "@/components/Footer/Footer";
import styles from "./home.module.css";

const cases = [
  {
    number: "01",
    title: "Cure Intelligence / SCRIOO",
    summary: "Plataforma de inteligência de riscos em supply chain com IA.",
    description:
      "Redesign de uma plataforma densa em dados para ajudar usuários a entender sinais de risco, fornecedores, filtros, dashboards e decisões operacionais.",
    tags: ["Sistemas complexos", "UX denso em dados", "IA", "Dashboards"],
    href: "/cases/cure",
    imageSrc: "/images/cure.png",
  },
  {
    number: "02",
    title: "HP Subscription Onboarding",
    summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
    description:
      "Ajudando a transformar um modelo de assinatura incluída em uma experiência mais clara de configuração e conta.",
    tags: ["UX de assinatura", "Produtos conectados", "Serviço com hardware"],
    href: "/cases/hp",
    imageSrc: "/images/hp.png",
  },
  {
    number: "03",
    title: "Theodoor",
    summary: "App acessível para automação de portas inteligentes.",
    description:
      "Design de uma experiência mobile acessível com feedback multimodal, restrições reais e edge cases.",
    tags: ["Acessibilidade", "Mobile", "UX físico-digital"],
    href: "/cases/theodoor",
    imageSrc: "/images/theodoor.png",
  },
  {
    number: "04",
    title: "Intuit for Education",
    summary: "Experiência de educação financeira para estudantes.",
    description:
      "Ajudando estudantes a acompanhar o presente, planejar o futuro e aprender sobre dinheiro em contexto.",
    tags: ["Discovery de produto", "Educação financeira", "Design Systems"],
    href: "/cases/intuit",
    imageSrc: "/images/intuit.png",
  },
  {
    number: "05",
    title: "ASTER",
    summary: "Explorando IA como colaboradora clínica em consultas de alto risco.",
    description:
      "Um estudo de caso protegido por senha sobre confiança, limites de atuação e responsabilidade compartilhada entre médicos e uma IA colaboradora clínica.",
    tags: ["Interação com IA", "Saúde", "Confiança e segurança"],
    href: "/cases/aster",
    imageSrc: "",
    imageAlt: "ASTER — imagem de capa ainda não disponível",
    locked: true,
    // agora é o card que sobra sozinho na última linha (5 cases, 2 por
    // coluna no Desktop) — mesmo tratamento que o Intuit tinha antes.
    maxWidth: 600,
  },
];

export default function Home() {
  return (
    <>
      <NavBar context="dark" />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroVisual}>
              <div className={styles.glowTeal} />
              <div className={styles.glowOrange} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-photo.png"
                alt="Foto de Deiver Brito"
                className={styles.heroPhoto}
              />
            </div>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>PRODUCT DESIGNER SÊNIOR · FLORIPA · BRASIL</span>
              <h1 className={styles.heroTitle}>Design para simplificar produtos complexos.</h1>
              <p className={styles.heroIntro}>
                Ajudo times a transformar ambiguidade, restrições técnicas e jornadas fragmentadas em
                lógica de produto clara, interfaces escaláveis e experiências construíveis.
              </p>
              <div className={styles.heroActions}>
                <Button variant="primary" context="dark">
                  Ver trabalhos selecionados
                </Button>
                <Button variant="secondary" context="dark">
                  Baixar currículo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.workSection}>
          <h2>Trabalho</h2>
          <div className={styles.workGrid}>
            {cases.map((c) => (
              <CaseCardLarge key={c.number} imageAlt={c.title} {...c} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
