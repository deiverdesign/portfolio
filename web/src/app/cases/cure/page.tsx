import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import Link from "next/link";
import styles from "../cases.module.css";

export default function CureCase() {
  return (
    <>
      <NavBar context="dark" />

      <main className={styles.container}>
        <Link className={styles.backLink} href="/">
          &larr; Back to work
        </Link>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>CURE Intelligence / SCRIOO</h1>
          <p className={styles.heroSubtitle}>
            AI-powered supply chain risk intelligence platform.
          </p>

          <dl className={styles.metaGrid}>
            <div>
              <dt className={styles.metaLabel}>Role</dt>
              <dd className={styles.metaValue}>Product Designer · Individual contributor</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Scope</dt>
              <dd className={styles.metaValue}>
                UX flows, information architecture, risk map simplification, supplier
                comparison, usability testing, and handoff documentation
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Collaboration</dt>
              <dd className={styles.metaValue}>Product, engineering, and client stakeholders</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Platform</dt>
              <dd className={styles.metaValue}>Web platform</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Duration</dt>
              <dd className={styles.metaValue}>6 months</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>01 · Project in a minute</p>
          <h2 className={styles.sectionTitle}>Project in a minute</h2>
          <p>
            SCRIOO is an AI-powered supply chain risk intelligence platform that helps
            companies monitor suppliers, understand risk signals, and support operational
            decisions.
          </p>
          <p>
            The product combines risk map exploration, supplier information, historical
            incident data, filters, documents, and compliance-related flows.
          </p>
          <p>My work focused on making that complex information easier to scan, compare, and act on.</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>02 · My contribution</p>
          <h2 className={styles.sectionTitle}>My contribution</h2>
          <p>
            I worked as an individual contributor on UX flows, information architecture,
            interface patterns, usability testing, and handoff documentation.
          </p>
          <ol className={styles.list}>
            <li>Simplify how risk appeared on the map</li>
            <li>Design clearer ways to compare supplier incidents over time</li>
            <li>Use progressive disclosure to reduce cognitive load</li>
            <li>Structure usability tests focused on the team&apos;s riskiest hypotheses</li>
            <li>Document flows, states, and decisions for implementation</li>
          </ol>
          <p className={styles.caption}>
            Risk information was structured in layers: first severity and location, then
            supplier details when needed.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03 · What made it complex</p>
          <h2 className={styles.sectionTitle}>What made it complex</h2>
          <p>
            The challenge was helping users understand dense risk information without
            hiding the complexity behind it.
          </p>
          <ol className={styles.list}>
            <li>
              Users needed to move from a risk overview to per-supplier details without
              losing context.
            </li>
            <li>
              The interface combined dense information: maps, risk categories, filters,
              historical incidents, supplier data, and documents.
            </li>
            <li>
              The product needed to show enough detail for informed decisions without
              overwhelming the first layer of the experience.
            </li>
            <li>
              The same risk model needed to work across map, analytics, and insights views
              — including mobile.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>04 · How I approached it</p>
          <h2 className={styles.sectionTitle}>How I approached it</h2>
          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>01</span>
              <h3>Understand the decision</h3>
              <p>
                Before designing screens, I worked to understand what users needed to
                decide: where risk was happening, how severe it was, and whether a
                supplier required action.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>02</span>
              <h3>Reduce the first layer</h3>
              <p>
                I focused on what users needed to see first, especially on the risk map,
                where too much information made scanning harder.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>03</span>
              <h3>Test uncertain flows</h3>
              <p>
                When the team had open questions, I structured focused usability tests
                using simplified prototypes and external participants.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>04</span>
              <h3>Document the system</h3>
              <p>
                I documented flows, states, interaction rules, and handoff details so
                engineering could implement the experience with less ambiguity.
              </p>
            </div>
          </div>
          <p className={styles.caption}>
            Screens explored across map, analytics, filters, documents, mobile, and
            light/dark themes.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>05 · Key design decisions</p>
          <h2 className={styles.sectionTitle}>Key design decisions</h2>
          <p>Design decisions that made the product easier to scan, compare, and act on.</p>

          <article className={styles.decision}>
            <h3>01 · Simplify risk markers on the map</h3>
            <p>
              The risk map displayed many markers at once, each representing a potential
              risk. In an earlier direction, each marker tried to communicate multiple
              pieces of information at the same time.
            </p>
            <p>
              I proposed simplifying the marker system so the first layer communicated the
              most important risk signal first. Additional detail remained available
              progressively.
            </p>
            <p>
              The main argument was that showing less information upfront could support
              faster decisions, because the primary function of the map was to direct
              attention.
            </p>
            <p>
              Risk severity was communicated by color for quick recognition, but not by
              color alone. We also included a secondary cue to support accessibility.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>02 · Support supplier comparison over time</h3>
            <p>
              I worked on Incident Through Time, a feature that allowed comparing incidents
              from two or more suppliers over a selected period.
            </p>
            <p>
              The goal was to help decision-makers understand how supplier risk evolved
              over time, rather than evaluating incidents as isolated events.
            </p>
            <p>This supported decisions like maintaining, replacing, or monitoring a supplier more closely.</p>
          </article>

          <article className={styles.decision}>
            <h3>03 · Use progressive disclosure for dense risk information</h3>
            <p>
              A recurring principle in the project was that not all information needed to
              appear at the same level. The interface needed to support a sequence:
              identify what deserves attention, understand why it matters, then access
              supporting detail.
            </p>
            <p>
              Progressive disclosure helped reduce cognitive load without hiding the
              complexity of supply chain risk.
            </p>
          </article>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>06 · Targeted usability validation</p>
          <h2 className={styles.sectionTitle}>Targeted usability validation</h2>
          <h3 className={styles.subheading}>
            Validating clarity without direct access to end users
          </h3>
          <p>We didn&apos;t have direct access to end users, so I structured focused usability tests with external participants.</p>
          <p>
            The goal wasn&apos;t to validate domain expertise. It was to test whether people
            seeing the interface for the first time could understand the structure, follow
            main flows, identify important risk signals, and complete specific tasks.
          </p>
          <p>
            We only tested the areas where the team had the most uncertainty, such as map
            scanning, Incident Through Time, and the transition from overview to detail.
          </p>
          <p>
            This helped the team move from internal debate to more evidence-informed design
            decisions, while staying honest about the limits of the research.
          </p>

          <div className={styles.testGrid}>
            <div className={styles.testCard}>
              <p className={styles.testTitle}>01 · Map scanning</p>
              <p>
                <strong>Question</strong>
                <br />
                Could people identify the most important risks on a dense map?
              </p>
              <p>
                <strong>Test</strong>
                <br />
                Multiple risk markers in a simplified scenario.
              </p>
              <p>
                <strong>Informed</strong>
                <br />
                Simpler marker hierarchy and clearer severity cues.
              </p>
            </div>
            <div className={styles.testCard}>
              <p className={styles.testTitle}>02 · Supplier comparison</p>
              <p>
                <strong>Question</strong>
                <br />
                Could people compare supplier incidents over time?
              </p>
              <p>
                <strong>Test</strong>
                <br />
                Incident Through Time with two or more suppliers.
              </p>
              <p>
                <strong>Informed</strong>
                <br />
                Chart hierarchy, labels, and comparison flow.
              </p>
            </div>
            <div className={styles.testCard}>
              <p className={styles.testTitle}>03 · Progressive detail</p>
              <p>
                <strong>Question</strong>
                <br />
                Could people move from overview to detail without overload?
              </p>
              <p>
                <strong>Test</strong>
                <br />
                Task moving from map overview to supporting detail.
              </p>
              <p>
                <strong>Informed</strong>
                <br />
                Lighter first layer with progressive access to detail.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>08 · Outcome</p>
          <h2 className={styles.sectionTitle}>Outcome</h2>
          <ul className={styles.outcomeList}>
            <li>Made dense risk information easier to scan and compare</li>
            <li>Simplified the first layer of the map while preserving access to deeper detail</li>
            <li>Helped users compare supplier risk trends over time</li>
            <li>Improved design handoff through documented flows, states, and interaction rules</li>
          </ul>
          <p className={styles.caption}>
            Design system foundations, theme tokens, and documented states supported
            implementation across light and dark modes.
          </p>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <p className={styles.eyebrow}>09 · Reflection</p>
          <h2 className={styles.sectionTitle}>Reflection</h2>
          <blockquote className={styles.reflectionQuote}>
            <p>
              This project reinforced a lesson I still use often: in complex products, the
              first design challenge isn&apos;t the screen — it&apos;s understanding what
              decision the interface needs to support.
            </p>
            <p>Once that was clear, UI decisions became easier to explain, test, and document.</p>
          </blockquote>
        </section>

        <Link className={styles.nextCase} href="/cases/hp">
          <span className={styles.eyebrow}>Next case</span>
          <span className={styles.nextCaseTitle}>HP Subscription Onboarding &rarr;</span>
          <span className={styles.caption}>Guided setup for a printer-inclusive subscription model.</span>
        </Link>
      </main>

      <Footer />
    </>
  );
}
