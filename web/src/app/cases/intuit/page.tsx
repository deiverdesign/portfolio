import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import Link from "next/link";
import styles from "../cases.module.css";

export default function IntuitCase() {
  return (
    <>
      <NavBar context="dark" />

      <main className={styles.container}>
        <Link className={styles.backLink} href="/">
          &larr; Back to work
        </Link>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Intuit for Education</h1>
          <p className={styles.heroSubtitle}>Financial education experience for students.</p>

          <dl className={styles.metaGrid}>
            <div>
              <dt className={styles.metaLabel}>Role</dt>
              <dd className={styles.metaValue}>Product Designer · Core contributor</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Scope</dt>
              <dd className={styles.metaValue}>
                Initial design system ownership, majority of UI screens, Track / Plan /
                Learn flows, visual direction, themes, font scaling, and product-ready
                documentation
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Collaboration</dt>
              <dd className={styles.metaValue}>Design Lead, PM, product team, and client stakeholders</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Platform</dt>
              <dd className={styles.metaValue}>Mobile / responsive experience</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Duration</dt>
              <dd className={styles.metaValue}>On-demand project</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>01 · Project in a minute</p>
          <h2 className={styles.sectionTitle}>Project in a minute</h2>
          <p>
            Intuit for Education was a financial education product designed to help
            students relate to money through a more accessible and intentional digital
            experience.
          </p>
          <p>
            The product was built around three connected modules: Track for present-day
            and everyday financial awareness; Plan for future goals and financial
            intention; Learn for contextual financial knowledge, delivered at the right
            moment.
          </p>
          <p>
            The challenge was making financial concepts feel learnable rather than
            overwhelming, while building a product system flexible enough to support
            themes, states, dark mode, and a rich illustration language.
          </p>
          <p className={styles.caption}>
            Track, Plan and Learn in light and dark mode: the product system needed to
            support multiple themes, illustration contexts, and interface states with
            consistency.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>02 · My contribution</p>
          <h2 className={styles.sectionTitle}>My contribution</h2>
          <p>I joined the project before the Design Lead and helped shape the product&apos;s initial UI foundation.</p>
          <p>
            I created the initial design system structure, designed the majority of
            screens, and worked daily with the Design Lead and PM to review flows,
            hierarchy, product logic, and client-facing decisions.
          </p>
          <ol className={styles.list}>
            <li>Create the initial design system structure and reusable UI foundations</li>
            <li>Design the majority of product screens across Track, Plan, and Learn</li>
            <li>Translate financial concepts into concrete, learnable interface patterns</li>
            <li>Apply visual direction across themes, states, modules, and product surfaces</li>
            <li>Collaborate with the Design Lead and PM to refine hierarchy, flow logic, and client-facing decisions</li>
          </ol>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03 · What made it complex</p>
          <h2 className={styles.sectionTitle}>What made it complex</h2>
          <p>The product needed to make money feel clear, useful, and learnable for students.</p>
          <ol className={styles.list}>
            <li>
              Students had different levels of financial confidence and experience, so
              the product needed to feel accessible without trivializing money.
            </li>
            <li>
              The product needed to connect three distinct behaviors: tracking money day
              to day, planning future goals, and learning financial concepts.
            </li>
            <li>
              Research needed to combine multiple perspectives: students, course
              coordinators, financial aid stakeholders, and client expectations.
            </li>
            <li>
              The design system was being created while product direction was still
              evolving, so the foundations needed to be flexible without becoming loose.
            </li>
          </ol>
          <p className={styles.caption}>
            Stakeholder and client conversations mapped in FigJam helped clarify goals,
            expectations, and what &ldquo;financial education for students&rdquo; meant in
            product terms.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03B · Research and direction validation</p>
          <h2 className={styles.sectionTitle}>Research and direction validation</h2>
          <p>The project combined discovery interviews, stakeholder conversations, and visual direction validation.</p>
          <p>
            We talked with Gen Z college students, course coordinators, and financial aid
            stakeholders within the university to understand everyday money challenges,
            planning needs, and confidence in financial decisions.
          </p>
          <p>
            We also used Maze to compare UI directions and identify which visual approach
            had the strongest reception with the target audience.
          </p>
          <p className={styles.caption}>
            Research and Maze validation helped the team align on product direction, tone,
            and visual approach before scaling the UI system.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>04 · How I approached it</p>
          <h2 className={styles.sectionTitle}>How I approached it</h2>
          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>01</span>
              <h3>Ground direction in research</h3>
              <p>
                We started with interviews and conversations involving Gen Z college
                students, course coordinators, and financial aid stakeholders within the
                university. This helped the team understand what financial education for
                students meant beyond the interface: everyday financial stress, planning
                needs, institutional support, and confidence in financial decisions.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>02</span>
              <h3>Build the foundation early</h3>
              <p>
                I created the initial design system structure before the Design Lead
                joined — tokens, typographic scales, color foundations, and reusable
                components — so the team had a stable base to build from.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>03</span>
              <h3>Explore and validate visual directions</h3>
              <p>
                We explored multiple UI directions and used Maze to understand which
                visual approach had the strongest reception with the target audience.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>04</span>
              <h3>Design across Track, Plan, and Learn</h3>
              <p>
                Each module had a different user intent and information hierarchy. I
                designed across all three while keeping the system and visual logic
                consistent.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>05</span>
              <h3>Work in daily three-way review</h3>
              <p>
                Every morning, the Design Lead, the PM, and I reviewed flows, discussed
                hierarchy, resolved product logic questions, and aligned on client-facing
                decisions.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>05 · Key design decisions</p>
          <h2 className={styles.sectionTitle}>Key design decisions</h2>
          <p>Design decisions that shaped how the product communicated money, progress, and learning.</p>

          <article className={styles.decision}>
            <h3>01 · Connect Track, Plan, and Learn</h3>
            <p>
              The three modules weren&apos;t separate products — they needed to feel like
              a single experience with shared logic. Track informed Plan. Plan surfaced
              Learn moments. I designed the connective tissue between them so users could
              move fluidly from today&apos;s spending to a future goal to a relevant
              financial concept.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>02 · Turn financial goals into visible progress</h3>
            <p>
              Abstract financial goals are hard to act on. I translated those goals into
              visual progress states — active targets with contribution tracking,
              timelines, and clear next steps — so users felt forward movement rather than
              just seeing a number.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>03 · Design Track as daily financial awareness</h3>
            <p>
              Track was the daily entry point. It needed to show what was happening today
              without requiring effort or prior financial knowledge. I designed the
              experience to surface spending breakdowns, budget states, and check-in
              moments as contextual, ambient information.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>04 · Make learning modular</h3>
            <p>
              Learn content needed to work as standalone moments, not just as a course. I
              designed the module as a navigable, contextual layer so financial concepts
              could appear when relevant to a user&apos;s goal or spending pattern — not
              only when they navigated to a dedicated section.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>05 · Build a flexible visual system with AI-assisted illustration</h3>
            <p>
              The illustration style helped make financial topics feel less abstract and
              more approachable. The challenge was using rich visuals without letting them
              override the product UI. I helped apply the visual language across screens
              and modules so it supported clarity, hierarchy, and engagement.
            </p>
          </article>
          <p className={styles.caption}>
            Track flow: check-in modal and financial confidence survey giving the user a
            moment of reflection within the daily money view. Learn flow: Happy Path and
            General Search with modular, navigable financial content presented in context
            rather than isolated in a course structure.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>06 · AI-assisted illustration language</p>
          <h2 className={styles.sectionTitle}>AI-assisted illustration language</h2>
          <p>
            The product used a rich AI-assisted illustration style developed by the
            design team. These illustrations helped make financial topics more
            accessible, emotional, and memorable for students, while still supporting a
            trustworthy product experience.
          </p>
          <p>
            My work connected that visual language to the product UI, applying it across
            onboarding, Track, Plan, Learn, goals, cards, and learning moments.
          </p>
          <p className={styles.caption}>
            AI-assisted illustrations helped transform abstract financial concepts into
            more approachable product moments. Illustration bundles organized in Figma by
            financial topic, each set paired with contextual photography assets for
            content modules.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>07 · Product system foundations</p>
          <h2 className={styles.sectionTitle}>Product system foundations</h2>
          <p>
            I created the initial design system structure before the Design Lead joined —
            tokens, color functions, typographic scales, component foundations, and
            reusable patterns across Track, Plan, Learn, Onboarding, Goals, and Setup.
          </p>
          <p>
            The system needed to support light and dark themes, font scaling across
            different device sizes, multiple illustration contexts, and a product-ready
            handoff structure that engineering could use with less ambiguity.
          </p>
          <p className={styles.caption}>
            Color tokens and functions in the design system for backgrounds, borders,
            semantic states, and interactive states across both themes. Production UI
            file structure: Master, Default, Dark Mode, and Font Scaling pages organized
            for handoff and team use.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>08 · Outcome</p>
          <h2 className={styles.sectionTitle}>Outcome</h2>
          <ul className={styles.outcomeList}>
            <li>Designed the majority of screens across Track, Plan, and Learn</li>
            <li>Created the initial design system structure, including tokens, typographic scale, colors, and reusable patterns</li>
            <li>Applied the AI-assisted illustration language consistently across product surfaces</li>
            <li>Supported dark mode, font scaling, and multi-theme system flexibility</li>
            <li>Used research interviews and Maze validation to inform product direction and visual approach</li>
            <li>Collaborated daily with the Design Lead and PM to align hierarchy, flow logic, and client-facing decisions</li>
          </ul>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <p className={styles.eyebrow}>09 · Reflection</p>
          <h2 className={styles.sectionTitle}>Reflection</h2>
          <blockquote className={styles.reflectionQuote}>
            <p>
              This project taught me how much early design system work shapes everything
              that comes after. Building stable foundations before product direction was
              fully defined required judgment calls that held up through significant
              changes.
            </p>
            <p>
              Working closely with a Design Lead in a daily three-way review with the PM
              was one of the most effective collaboration structures I&apos;ve
              experienced. Each person owned a distinct part of the problem, and that
              clarity made fast, quality decisions possible even under ambiguity.
            </p>
          </blockquote>
        </section>

        <Link className={styles.nextCase} href="/cases/cure">
          <span className={styles.eyebrow}>Next case</span>
          <span className={styles.nextCaseTitle}>CURE Intelligence / SCRIOO &rarr;</span>
          <span className={styles.caption}>AI-powered supply chain risk intelligence platform.</span>
        </Link>
      </main>

      <Footer />
    </>
  );
}
