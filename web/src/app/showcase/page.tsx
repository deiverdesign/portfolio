import { Button } from "@/components/Button/Button";
import { Tag } from "@/components/Tag/Tag";
import { CaseCardLarge } from "@/components/CaseCardLarge/CaseCardLarge";
import { NavBar } from "@/components/NavBar/NavBar";
import styles from "./page.module.css";

const cases = [
  {
    number: "01",
    title: "Cure Intelligence / SCRIOO",
    summary: "Plataforma de inteligência de riscos em supply chain com IA.",
    description:
      "Redesign de uma plataforma densa em dados para ajudar usuários a entender sinais de risco, fornecedores, filtros, dashboards e decisões operacionais.",
    tags: ["Sistemas complexos", "UX denso em dados", "IA", "Dashboards"],
    href: "/cases/cure",
  },
  {
    number: "02",
    title: "HP Subscription Onboarding",
    summary: "Configuração guiada para um modelo de assinatura com impressora incluída.",
    description:
      "Ajudando a transformar um modelo de assinatura incluída em uma experiência mais clara de configuração e conta.",
    tags: ["UX de assinatura", "Produtos conectados", "Serviço com hardware"],
    href: "/cases/hp",
  },
  {
    number: "03",
    title: "Theodoor",
    summary: "App acessível para automação de portas inteligentes.",
    description:
      "Design de uma experiência mobile acessível com feedback multimodal, restrições reais e edge cases.",
    tags: ["Acessibilidade", "Mobile", "UX físico-digital"],
    href: "/cases/theodoor",
  },
  {
    number: "04",
    title: "Intuit for Education",
    summary: "Experiência de educação financeira para estudantes.",
    description:
      "Ajudando estudantes a acompanhar o presente, planejar o futuro e aprender sobre dinheiro em contexto.",
    tags: ["Discovery de produto", "Educação financeira", "Design Systems"],
    href: "/cases/intuit",
  },
];

export default function Home() {
  return (
    <>
      <section>
        <h2 style={{ margin: 16 }}>NavBar (redimensione a janela pra ver o hambúrguer)</h2>
        <NavBar context="dark" />
      </section>

      <main className={styles.page}>
      <section>
        <h2 style={{ marginBottom: 16 }}>Button — contexto claro</h2>
        <div className={styles.row} style={{ background: "#fff", padding: 24 }}>
          <Button variant="primary" context="light">Primary</Button>
          <Button variant="secondary" context="light">Secondary</Button>
          <Button variant="tertiary" context="light">Tertiary</Button>
          <Button variant="primary" context="light" disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 16 }}>Button — contexto escuro</h2>
        <div className={styles.row} style={{ background: "var(--background-inverse)", padding: 24 }}>
          <Button variant="primary" context="dark">Primary</Button>
          <Button variant="secondary" context="dark">Secondary</Button>
          <Button variant="tertiary" context="dark">Tertiary</Button>
          <Button variant="primary" context="dark" disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 16 }}>Tag</h2>
        <div className={styles.row}>
          <div className={styles.row} style={{ background: "#fff", padding: 24 }}>
            <Tag context="light">Sistemas complexos</Tag>
            <Tag context="light">IA</Tag>
          </div>
          <div className={styles.row} style={{ background: "var(--background-inverse)", padding: 24 }}>
            <Tag context="dark">Sistemas complexos</Tag>
            <Tag context="dark">IA</Tag>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 16 }}>CaseCardLarge — grade responsiva</h2>
        <div className={styles.grid}>
          {cases.map((c) => (
            <CaseCardLarge key={c.number} imageSrc="" imageAlt={c.title} {...c} />
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
