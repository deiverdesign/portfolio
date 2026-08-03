import { Section } from "./Section";

export function WhatIDrove() {
  return (
    <Section id="what-i-drove" number="03" eyebrow="My contribution" title="What I drove">
      <p>
        As the product designer, I focused on defining the interaction model between AI and
        physician: when the system should surface information, when it should remain quiet, and
        how physician judgment and authorship should remain visible.
      </p>

      <p>
        I translated high-risk questions into experience principles, interaction boundaries and
        product behaviors — including patient-identity confirmation, restrained Insights, and
        the separation between AI Draft and My Notes.
      </p>

      <p>
        I also proposed a design-led internal simulation, using scripted physician–patient
        role-play and deliberate edge cases, as a fast and inexpensive way to expose missing
        safeguards before any clinical validation. The project identified this need but did not
        progress to formal execution or validated test results.
      </p>

      <p>
        For this portfolio reconstruction, I independently rebuilt and iterated a functional
        prototype to make the interaction decisions tangible and testable. The reconstruction
        uses fictional data and does not reproduce the original client system.
      </p>
    </Section>
  );
}
