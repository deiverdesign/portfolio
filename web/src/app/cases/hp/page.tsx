import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import Link from "next/link";
import styles from "../cases.module.css";

export default function HpCase() {
  return (
    <>
      <NavBar context="dark" />

      <main className={styles.container}>
        <Link className={styles.backLink} href="/">
          &larr; Back to work
        </Link>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>HP Subscription Onboarding</h1>
          <p className={styles.heroSubtitle}>
            Guided setup for a printer inclusive subscription model.
          </p>

          <dl className={styles.metaGrid}>
            <div>
              <dt className={styles.metaLabel}>Role</dt>
              <dd className={styles.metaValue}>Product Designer · Individual contributor</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Scope</dt>
              <dd className={styles.metaValue}>
                UX/UI execution, subscription setup flows, edge cases, and handoff
                documentation
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Collaboration</dt>
              <dd className={styles.metaValue}>Product, engineering, QA, and client stakeholders</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Platform</dt>
              <dd className={styles.metaValue}>Web platform</dd>
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
            I worked on an evolution of the HP subscription experience where the plan
            included not just ink, toner, or paper — but the printer itself.
          </p>
          <p>
            The model was already past an initial MVP but still in testing and
            implementation. My work focused on subscription setup and the account
            experience: helping users configure a plan, understand what was included, and
            review the service before committing.
          </p>
          <p>
            Because some service rules were still being clarified, the design work also
            helped surface edge cases around delivery, replacement, returns, printer
            status, and support.
          </p>
          <p className={styles.caption}>
            A guided setup flow combining printer selection, monthly page volume, paper
            add-on, and order summary.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>02 · My contribution</p>
          <h2 className={styles.sectionTitle}>My contribution</h2>
          <p>
            I worked as an individual contributor focused on UX/UI execution, design
            system application, and implementation handoff.
          </p>
          <ol className={styles.list}>
            <li>Structure the subscription setup into clear decision steps</li>
            <li>Design the printer selection, page volume, and paper add-on flow</li>
            <li>Translate service rules into visible states and next steps for the user</li>
            <li>Surface edge case questions about delivery, returns, replacement, and printer status</li>
            <li>Keep the experience aligned with HP&apos;s existing design standards</li>
          </ol>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>03 · What made it complex</p>
          <h2 className={styles.sectionTitle}>What made it complex</h2>
          <p>The interface needed to make a physical service model clear before the user committed.</p>
          <ol className={styles.list}>
            <li>The subscription included a physical printer, not just a digital plan or supply delivery.</li>
            <li>
              Some rules were still being clarified during implementation, so UI work
              surfaced questions the team needed to answer.
            </li>
            <li>
              The experience needed to clearly explain service states: what was selected,
              what was included, what would be delivered, what could change, and what
              would happen next.
            </li>
          </ol>
          <p className={styles.caption}>
            Unlike a purely digital subscription, this setup needed to account for
            physical products, delivery, returns, support, and service conditions.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>04 · How I approached it</p>
          <h2 className={styles.sectionTitle}>How I approached it</h2>
          <div className={styles.approachGrid}>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>01</span>
              <h3>Understand the service state</h3>
              <p>
                Before designing screens, I worked to understand what the user needed to
                know at each point: printer selected, page volume, paper add-on, price,
                delivery, trial conditions, and next steps.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>02</span>
              <h3>Make choices sequential</h3>
              <p>
                I structured the setup so users could make one decision at a time, rather
                than facing the full service model all at once.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>03</span>
              <h3>Surface unanswered edge cases</h3>
              <p>
                As the UI took shape, I helped identify open questions about printer
                delivery, returns, replacement, broken device scenarios, and status
                visibility.
              </p>
            </div>
            <div className={styles.approachItem}>
              <span className={styles.approachNumber}>04</span>
              <h3>Document for implementation</h3>
              <p>
                I documented selections, states, edge cases, and handoff details so
                engineering and QA could implement the experience with less ambiguity.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>05 · Key design decisions</p>
          <h2 className={styles.sectionTitle}>Key design decisions</h2>
          <p>Design decisions that made the subscription easier to set up, review, and understand.</p>

          <article className={styles.decision}>
            <h3>01 · Turn a new subscription model into a guided setup</h3>
            <p>
              The new model required users to configure several connected choices:
              printer, monthly page volume, optional paper, and a final subscription
              summary. I structured the experience as a guided setup so users could
              understand each decision in sequence, rather than facing the full service
              model all at once.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>02 · Surface edge cases through UI work</h3>
            <p>
              As we designed the panel, several service questions became visible: delivery
              timelines, printer status, return flows, replacement scenarios, and what
              happens when a printer breaks or needs to be sent back. I helped raise these
              questions with HP and translate the answers into clearer states, flows, and
              interface decisions.
            </p>
          </article>

          <article className={styles.decision}>
            <h3>03 · Make the subscription bundle reviewable</h3>
            <p>
              Because each selection affected the final subscription, users needed a clear
              way to review what they had chosen before continuing. The summary experience
              connected the selected printer, page plan, paper add-on, monthly price, trial
              information, shipping, and service conditions in one place.
            </p>
          </article>
          <p className={styles.caption}>
            The review step connected selected items, included benefits, price, trial
            conditions, and service requirements in one place.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>06 · Outcome</p>
          <h2 className={styles.sectionTitle}>Outcome</h2>
          <ul className={styles.outcomeList}>
            <li>Delivered a clearer setup flow for a printer-inclusive subscription model</li>
            <li>Helped translate service rules into visible states and next steps for the user</li>
            <li>Surfaced edge case questions about delivery, replacement, returns, and printer status</li>
            <li>Kept the experience consistent with HP&apos;s existing design standards and implementation needs</li>
          </ul>
          <p className={styles.caption}>
            Open questions about delivery, returns, replacement, and printer status were
            translated into visible states and handoff notes.
          </p>
        </section>

        <section className={`${styles.section} ${styles.reflection}`}>
          <p className={styles.eyebrow}>07 · Reflection</p>
          <h2 className={styles.sectionTitle}>Reflection</h2>
          <blockquote className={styles.reflectionQuote}>
            <p>This project reminded me that UI work can surface product questions that haven&apos;t been resolved yet.</p>
            <p>
              When a subscription includes physical service operations, the interface
              isn&apos;t just organizing choices. It&apos;s helping the team make the
              service logic explicit.
            </p>
          </blockquote>
        </section>

        <Link className={styles.nextCase} href="/cases/theodoor">
          <span className={styles.eyebrow}>Next case</span>
          <span className={styles.nextCaseTitle}>Theodoor &rarr;</span>
          <span className={styles.caption}>Accessible app for smart door automation.</span>
        </Link>
      </main>

      <Footer />
    </>
  );
}
