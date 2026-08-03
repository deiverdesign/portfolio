import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import Link from "next/link";
import styles from "../cases.module.css";

export default function TheodoorCase() {
  return (
    <>
      <NavBar context="dark" />

      <main className={styles.container}>
        <Link className={styles.backLink} href="/">
          &larr; Back to work
        </Link>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Theodoor</h1>
          <p className={styles.heroSubtitle}>Accessible app for smart door automation.</p>

          <dl className={styles.metaGrid}>
            <div>
              <dt className={styles.metaLabel}>Role</dt>
              <dd className={styles.metaValue}>Lead Product Designer · Individual contributor</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Scope</dt>
              <dd className={styles.metaValue}>
                Mobile UX, interaction design, system feedback, accessibility
                considerations, motion, prototyping, design system foundations, and
                handoff documentation
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Collaboration</dt>
              <dd className={styles.metaValue}>Product, engineering, and client stakeholders</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Platform</dt>
              <dd className={styles.metaValue}>Mobile app</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Duration</dt>
              <dd className={styles.metaValue}>1 month</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>01 · Project in a minute</p>
          <h2 className={styles.sectionTitle}>Project in a minute</h2>
          <p>Theodoor is a mobile app for controlling an accessible smart door automation system.</p>
          <p>
            My work focused on making door states, system feedback, errors, and controls
            clear enough that users could trust what was happening in the physical world.
          </p>
          <p>
            Because the app controlled a real door, motion, accessibility, and feedback
            weren&apos;t decorative. They were part of the core interaction model.
          </p>
          <p className={styles.caption}>
            Designing a mobile interface for a physical system where feedback, trust, and
            accessibility were central to the experience.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>02 · My contribution</p>
          <h2 className={styles.sectionTitle}>My contribution</h2>
          <p>I worked on mobile UX, UI, design system foundations, motion, prototyping, and accessibility considerations.</p>
          <ol className={styles.list}>
            <li>Map door states and user actions</li>
            <li>Design feedback for opening, closing, waiting, success, and error states</li>
            <li>Create motion explorations to communicate system behavior</li>
            <li>Use AI-assisted and code-based prototypes to test interaction ideas faster</li>
            <li>Build reusable UI foundations for the mobile experience</li>
          </ol>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03 · What made it complex</p>
          <h2 className={styles.sectionTitle}>What made it complex</h2>
          <p>The interface needed to explain what was happening in the physical world.</p>
          <ol className={styles.list}>
            <li>
              The app controlled a physical object, so users needed to know whether a
              command was received, in progress, complete, or failed.
            </li>
            <li>The experience needed to support accessibility contexts where feedback couldn&apos;t rely on visual UI alone.</li>
            <li>Static screens weren&apos;t enough. The important part was how the system behaved over time.</li>
          </ol>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>04 · How I approached it</p>
          <h2 className={styles.sectionTitle}>How I approached it</h2>
          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>01</span>
              <h3>Map door states and user actions</h3>
              <p>
                I mapped what the system needed to communicate: open, closed, opening,
                closing, waiting, success, error, and connection issues.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>02</span>
              <h3>Design feedback loops</h3>
              <p>
                I explored how the app could confirm that a command was sent, the system
                was processing it, and the physical action was complete or failed.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>03</span>
              <h3>Simulate behavior before building</h3>
              <p>
                I used code-based and AI-assisted prototypes to run edge-case scenarios
                and make state timing and transitions visible to the team before
                development.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>04</span>
              <h3>Build reusable foundations</h3>
              <p>
                I organized UI patterns and states into reusable foundations so the app
                stayed consistent as the experience evolved.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>05 · Behavioral prototyping</p>
          <h2 className={styles.sectionTitle}>Behavioral prototyping</h2>
          <p>Static screens weren&apos;t enough to discuss this experience.</p>
          <p>
            I built an AI-assisted prototype simulator to make edge cases, timing, and
            system transitions visible before development. The simulator covered
            scenarios like Happy Path, Empty Home, Door Locked, Partial Open with
            Obstruction, Pinch Protection, Path Blocked, Battery Alert, and Offline/Out of
            Range.
          </p>
          <p>A Figma blueprint translated from the prototype helped bridge the simulation to the final design handoff.</p>
          <p className={styles.caption}>
            The simulator made edge cases visible before development, including offline,
            obstruction, pinch protection, and path-blocked scenarios.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>06 · Key design decisions</p>
          <h2 className={styles.sectionTitle}>Key design decisions</h2>
          <p>Design decisions that made the physical system clearer, safer, and more reliable.</p>

          <article className={styles.decision}>
            <h3>01 · Make invisible door states visible</h3>
            <p>
              The door could be open, closed, opening, closing, waiting, locked, unlocked,
              disconnected, or in an error state. I mapped these states so the interface
              clearly communicated what was happening, rather than leaving users guessing
              after tapping a button.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>02 · Use motion as system feedback</h3>
            <p>
              Motion was used to explain behavior, not just to make the app feel more
              polished. I explored animations for scanning, waiting, pairing, success,
              empty states, and error recovery so users understood what the system was
              doing over time. This was especially important because the app controlled a
              physical door — users needed feedback that a command had been received, was
              in progress, or required attention.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>03 · Design feedback beyond visual UI</h3>
            <p>
              Since this was an accessibility-oriented product, feedback couldn&apos;t
              rely only on what users saw. The interaction model considered visual,
              haptic, and audio feedback so system status could be understood across
              different contexts and by different users.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>04 · Prototype behavior before development</h3>
            <p>
              Static screens weren&apos;t enough to discuss this experience. I used
              prototypes, AI-assisted exploration, and code-based experiments to make
              behavior tangible before implementation, helping the team discuss timing,
              transitions, edge cases, and system feedback.
            </p>
          </article>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>07 · Motion + AI</p>
          <h2 className={styles.sectionTitle}>Motion + AI</h2>
          <p>Motion was used to explain system behavior, not just to make the app feel more polished.</p>
          <p>
            For states like scanning, pairing, empty home, waiting, success, and failure,
            static screens weren&apos;t enough. Animation needed to show that the system
            was searching, processing, or waiting for the user&apos;s next action.
          </p>
          <p>
            I used AI-assisted and code-based workflows to speed up motion production,
            refine animation timing, and prepare Lottie outputs ready for implementation.
          </p>
          <p>
            The goal wasn&apos;t to automate taste. It was to reduce repetitive production
            work so I could focus on clarity, timing, and how motion supported system
            feedback.
          </p>

          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <h3>Scanning and waiting states</h3>
              <p className={styles.caption}>
                Motion made the waiting state feel active and understandable while the
                system searched for nearby door devices.
              </p>
            </div>
            <div className={styles.approachItem}>
              <h3>Empty state motion</h3>
              <p className={styles.caption}>
                The empty state guided users toward the next action without making setup
                feel broken or incomplete.
              </p>
            </div>
          </div>
          <p className={styles.caption}>Motion explorations were refined into implementation-ready Lottie outputs.</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>08 · Design system foundations</p>
          <h2 className={styles.sectionTitle}>Design system foundations</h2>
          <p>
            I organized reusable UI foundations for the app: buttons, cards, status
            labels, door states, feedback patterns, navigation, empty states, setup flows,
            errors, and recovery states.
          </p>
          <p>This helped keep the experience consistent across normal use, setup, settings, motion states, and edge cases.</p>
          <p className={styles.caption}>
            Reusable UI patterns helped the app handle setup, normal use, settings,
            errors, and recovery states consistently.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>09 · Outcome</p>
          <h2 className={styles.sectionTitle}>Outcome</h2>
          <ul className={styles.outcomeList}>
            <li>Made door status and system feedback easier to understand</li>
            <li>Created clearer interaction patterns for success, waiting, error, and recovery states</li>
            <li>Supported accessibility through multimodal feedback rather than visual-only communication</li>
            <li>Helped the team discuss physical-digital edge cases before implementation</li>
            <li>Built reusable UI foundations for the mobile experience</li>
            <li>Prepared motion assets for implementation through Lottie output</li>
          </ul>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <p className={styles.eyebrow}>10 · Reflection</p>
          <h2 className={styles.sectionTitle}>Reflection</h2>
          <blockquote className={styles.reflectionQuote}>
            <p>This project reinforced that accessibility isn&apos;t a checklist at the end of the process.</p>
            <p>
              When a digital interface controls something physical, accessibility,
              feedback, and trust need to be part of the core interaction model.
            </p>
          </blockquote>
        </section>

        <Link className={styles.nextCase} href="/cases/intuit">
          <span className={styles.eyebrow}>Next case</span>
          <span className={styles.nextCaseTitle}>Intuit for Education &rarr;</span>
          <span className={styles.caption}>Financial education experience for students.</span>
        </Link>
      </main>

      <Footer />
    </>
  );
}
