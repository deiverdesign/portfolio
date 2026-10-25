import type { ReactNode } from "react";
import { BOOK_CASE_COPY } from "@/content/book-case";
import bookAssetMetadata from "@/content/book-case-assets.generated.json";
import type { Locale } from "@/content/i18n";
import { getCopy } from "@/content/site-copy";
import { NavBarV3, type NavBarV3Link } from "@/components/NavBarV3/NavBarV3";
import { RESUME_HREF } from "@/components/NavBar/constants";
import { FooterV3 } from "@/components/FooterV3/FooterV3";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { CaseMetaRowV3 } from "@/components/CaseMetaRowV3/CaseMetaRowV3";
import { CaseReflectionV3 } from "@/components/CaseReflectionV3/CaseReflectionV3";
import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { ButtonV3 } from "@/components/ButtonV3/ButtonV3";
import { IconV3 } from "@/components/IconV3/IconV3";
import { TagV3 } from "@/components/TagV3/TagV3";
import { MotionReveal } from "@/components/MotionReveal/MotionReveal";
import { BookCarousel, BookVideo } from "./BookCaseMedia";
import styles from "./BookCaseV3.module.css";

const ASSET = "/images/v3/cases/enquanto-durar-a-fe";
const VIDEO = "/videos/cases/enquanto-durar-a-fe";
function Art({
  name,
  alt = "",
  className = "",
  eager = false,
}: {
  name: string;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  const asset = bookAssetMetadata[name as keyof typeof bookAssetMetadata];
  const sizes = eager
    ? "(max-width: 1672px) calc(100vw - 32px), 1640px"
    : "(max-width: 599px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 96px), (max-width: 1444px) calc((100vw - 160px) / 2), 642px";
  // Variants are pre-encoded locally; keep the original image dimensions to reserve layout space.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={asset.variants[asset.variants.length - 1].src}
      srcSet={asset.variants.map((v) => v.src + " " + v.width + "w").join(", ")}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
}
function Section({
  id,
  label,
  title,
  children,
  tint = false,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  tint?: boolean;
}) {
  return (
    <section
      id={id}
      className={[styles.section, tint ? styles.tint : ""].join(" ")}
      aria-labelledby={id + "-title"}
    >
      <div className={styles.inner}>
        <header className={styles.sectionHeader}>
          <EyebrowV3>{label}</EyebrowV3>
          <MotionReveal as="h2" id={id + "-title"} className={styles.title}>
            {title}
          </MotionReveal>
        </header>
        {children}
      </div>
    </section>
  );
}
export function BookCaseV3({ locale }: { locale: Locale }) {
  const c = BOOK_CASE_COPY[locale],
    pt = locale === "pt";
  const home = pt ? "/pt" : "/",
    about = pt ? "/pt/sobre" : "/about";
  const preview = "/v3/cases/enquanto-durar-a-fe";
  const links: NavBarV3Link[] = [
    { label: getCopy(locale, "shared.nav.home"), href: home },
    { label: getCopy(locale, "shared.nav.about"), href: about },
    { label: getCopy(locale, "shared.nav.contact"), href: home + "#contact" },
    { label: getCopy(locale, "shared.nav.resume"), href: RESUME_HREF[locale] },
  ];
  const media = (name: string, poster: string, label: string) => (
    <BookVideo
      locale={locale}
      src={VIDEO + "/" + name + "-" + locale + ".mp4"}
      poster={ASSET + "/" + poster + "-2000.webp"}
      mobileSrc={name === "tour" || (locale === "en" && (name === "rain" || name === "transition")) ? VIDEO + "/" + name + "-mobile-" + locale + ".mp4" : undefined}
      mobilePoster={name === "tour" || (locale === "en" && (name === "rain" || name === "transition")) ? ASSET + "/" + name + "-mobile-" + locale + "-poster.webp" : undefined}
      label={label}
    />
  );
  return (
    <>
      <NavBarV3
        locale={locale}
        identityHref={home}
        languageHref={(pt ? "" : "/pt") + preview}
        context="light"
        links={links}
      />
      <main className={styles.page}>
        <section className={styles.heroOuter}>
          <div className={styles.hero}>
            <Art name="hero" className={styles.heroImage} eager />
            {/* Selo CSSDA — Figma 2648:7068: 70×70, 24px da direita e da
                base do banner. Só no desktop (≥1024px), pedido do Deiver. */}
            <img
              src="/images/v3/home/book/cssda-best-ui.svg"
              alt={pt ? "Premiado no CSS Design Awards: Best UI Design" : "CSS Design Awards: Best UI Design award"}
              width={70}
              height={70}
              className={styles.heroAward}
            />
            <div className={styles.heroInner}>
              <nav
                className={styles.heroNav}
                aria-label={getCopy(locale, "shared.case.other")}
              >
                <ButtonV3
                  href={home + "#selected-work"}
                  variant="tertiary"
                  context="inverted"
                  aria-label={pt ? "Voltar ao início" : "Back to home"}
                >
                  <IconV3 name="arrow-left" size={16} />
                  <span className={styles.backFull}>{pt ? "Voltar ao início" : "Back to home"}</span>
                  <span className={styles.backCompact}>{pt ? "Início" : "Home"}</span>
                </ButtonV3>
                <div className={styles.otherCases}>
                  <span>{pt ? "OUTROS PROJETOS" : "OTHER PROJECTS"}</span>
                  <ButtonV3
                    href={(pt ? "/pt" : "") + "/cases/hp"}
                    variant="secondary"
                    context="inverted"
                    size="medium"
                    aria-label={pt ? "Projeto anterior" : "Previous project"}
                  >
                    <IconV3 name="arrow-left" size={16} />
                  </ButtonV3>
                  <ButtonV3
                    href={(pt ? "/pt" : "") + "/cases/theodoor"}
                    variant="secondary"
                    context="inverted"
                    size="medium"
                    aria-label={pt ? "Próximo projeto" : "Next project"}
                  >
                    <IconV3 name="arrow-right" size={16} />
                  </ButtonV3>
                </div>
              </nav>
              <div className={styles.heroCopy}>
                <div className={styles.tags}>
                  {["Art direction", "Motion", "Creative coding"].map(
                    (label) => (
                      <TagV3 key={label} label={label} context="inverted" />
                    ),
                  )}
                </div>
                <h1>{c.title}</h1>
                <p>{c.summary}</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.section} aria-label={c.tourLabel}>
          <div className={`${styles.inner} ${styles.tourInner}`}>
            <p className={styles.tourHeading}>{c.tourLabel}</p>
            {media("tour", "tour-" + locale, c.tourLabel)}
            <p className={styles.caption}>{c.tourCaption}</p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.inner}>
            <div className={styles.twoColumns}>
              <div>
                <EyebrowV3>{pt ? "CONTEXTO" : "CONTEXT"}</EyebrowV3>
                <h2 className={styles.title}>{c.context[0]}</h2>
                <p>{c.context[1]}</p>
                <p>{c.context[2]}</p>
              </div>
              <Art
                name={pt ? "mockup" : "mockup-en"}
                alt={
                  pt
                    ? "Tablet com o hotsite ao lado do livro em uma mesa de costura"
                    : "The website on a tablet beside the book on a sewing table"
                }
              />
            </div>
            <CaseMetaRowV3
              compactBefore
              items={[
                {
                  icon: "person-card",
                  label: pt ? "Meu papel" : "My role",
                  value: c.role,
                },
                {
                  icon: "handshake-2",
                  label: pt ? "Projeto" : "Project",
                  value: c.project,
                },
              ]}
            />
          </div>
        </section>
        <Section
          id="art-direction"
          label={pt ? "DIREÇÃO DE ARTE" : "ART DIRECTION"}
          title={c.art[0]}
          tint
        >
          <div className={styles.intro}>
            <h3>{c.art[1]}</h3>
            <p>{c.art[2]}</p>
          </div>
          <div className={styles.twoColumns}>
            <article className={styles.studyCard}>
              <p className={styles.caption}>{c.hillSceneLabel}</p>
              <Art
                name={pt ? "hill-study" : "hill-study-en"}
                alt={
                  pt
                    ? "Tablet com o hotsite aberto na ladeira — referências de lugar, textura e escala"
                    : "Tablet showing the website on the hillside scene — location references, texture and scale"
                }
              />
              <p className={styles.caption}>
                {pt
                  ? "Registro do making-of: referência real, textura e estudo da ladeira."
                  : "Making-of: real location, texture and hillside study."}
              </p>
              <h3>{c.geography[0]}</h3>
              <p>{c.geography[1]}</p>
            </article>
            <article>
              <Art
                name="character-study"
                alt={
                  pt
                    ? "Folha de personagem e estudos de rosto do Jota"
                    : "Jota character sheet and face studies"
                }
              />
              <h3>{c.character[0]}</h3>
              <p>{c.character[1]}</p>
              <h3>{c.character[2]}</h3>
              <p>{c.character[3]}</p>
            </article>
          </div>
        </Section>
        <Section id="parallax" label={c.parallax[0]} title={c.parallax[1]}>
          <div className={styles.twoColumns}>
            <figure className={styles.layers}>
              <figcaption className={styles.caption}>
                {c.parallax[2]}
              </figcaption>
              <Art
                name="two-layers"
                className={styles.layerComposition}
                alt={pt
                  ? "Cidade e vegetação em dois planos separados, vistos em perspectiva"
                  : "City and vegetation on two separate planes, viewed in perspective"}
              />
              <p className={styles.caption}>
                {pt
                  ? "Cidade distante e vegetação distribuídas em camadas."
                  : "Distant city and vegetation arranged in layers."}
              </p>
            </figure>
            <div>
              {media("parallax", "parallax-" + locale, c.parallax[1])}
              <p className={styles.mediaDescription}>{c.parallax[3]}</p>
            </div>
          </div>
        </Section>
        <Section
          id="atmosphere"
          label={c.atmosphere[0]}
          title={c.atmosphere[1]}
          tint
        >
          <div className={styles.twoColumns}>
            <article>
              <div className={styles.studyCard}>
                <h3>{c.kitchen[0]}</h3>
                <p>{c.kitchen[1]}</p>
                <div className={styles.kitchenStudyGrid}>
                  {(
                    [
                      "kitchen-study-volume",
                      "kitchen-study-gray",
                      "kitchen-study-color",
                      "kitchen-study-street",
                    ] as const
                  ).map((name, i) => (
                    <figure key={name} className={styles.kitchenStudyItem}>
                      <Art name={name} alt={c.kitchenStudyLabels[i]} />
                      <figcaption className={styles.kitchenStudyOverlay}>
                        {c.kitchenStudyLabels[i]}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </article>
            <article>
              <p className={styles.caption}>{c.kitchen[2]}</p>
              <Art name={pt ? "kitchen-poster" : "kitchen-poster-en"} alt={c.kitchen[0]} />
            </article>
          </div>
          <div className={`${styles.twoColumns} ${styles.atmosphereOpalRow}`}>
            <article>
              <div className={styles.studyCard}>
                <h3>{c.opala[0]}</h3>
                <p>{c.opala[1]}</p>
                <p className={styles.caption}>{c.benchmark}</p>
                <div className={styles.benchmarkGrid}>
                  {(["cor", "perspectiva", "chuva"] as const).map((key, i) => (
                    <figure key={key} className={styles.benchmarkItem}>
                      <figcaption className={styles.benchmarkLabel}>
                        {c.benchmarkLabels[i]}
                      </figcaption>
                      <Art
                        name={`opala-ref-${key}`}
                        alt={c.benchmarkLabels[i]}
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </article>
            <article>
              {media(
                "rain",
                "rain-" + locale,
                pt
                  ? "Chuva e parallax na cena do Opala"
                  : "Rain and parallax in the Opala scene",
              )}
            </article>
          </div>
        </Section>
        <Section id="motion" label={c.motion[0]} title={c.motion[1]}>
          <p className={styles.intro}>{c.motion[2]}</p>
          {media("transition", "transition-" + locale, c.motion[1])}
          <div className={styles.steps}>
            {["hill-poster", "kitchen-poster", "opala-poster"].map(
              (name, i) => (
                <figure key={name}>
                  <Art name={pt ? name : name + "-en"} alt="" />
                  <figcaption className={styles.caption}>
                    {c.steps[i]}
                  </figcaption>
                </figure>
              ),
            )}
          </div>
          <p className={styles.intro}>{c.motion[3]}</p>
        </Section>
        <Section
          id="implementation"
          label={c.technical[0]}
          title={c.technical[1]}
        >
          <div className={styles.twoColumns}>
            <div>
              <p>{c.technical[2]}</p>
              {[3, 5, 7].map((i) => (
                <div key={i}>
                  <h3>{c.technical[i]}</h3>
                  <p>{c.technical[i + 1]}</p>
                </div>
              ))}
              <p className={styles.pullquote}>{c.technical[9]}</p>
              <p className={styles.caption}>
                FIGMA · GEMINI · MESHY · CLAUDE CODE · CODEX · VERCEL
              </p>
            </div>
            <BookCarousel captions={c.technicalCaptions} locale={locale}>
              {[
                <div key="mesh" className={styles.meshPair}>
                  {["mesh-before", "mesh-after"].map((name, i) => (
                    <div key={name}>
                      <p className={styles.caption}>
                        {i === 0
                          ? pt
                            ? "MODELO ORIGINAL · MESHY"
                            : "ORIGINAL MODEL · MESHY"
                          : pt
                            ? "VERSÃO OTIMIZADA PARA O SITE"
                            : "OPTIMIZED FOR THE WEBSITE"}
                      </p>
                      <Art
                        name={name}
                        alt={
                          i === 0
                            ? pt
                              ? "Wireframe original de Jota"
                              : "Original Jota wireframe"
                            : pt
                              ? "Wireframe otimizado de Jota"
                              : "Optimized Jota wireframe"
                        }
                      />
                      <p className={styles.caption}>
                        {i === 0 ? "649k" : "53k"}{" "}
                        {pt ? "TRIÂNGULOS" : "TRIANGLES"}
                      </p>
                    </div>
                  ))}
                </div>,
                ...[2, 3, 4].map((i) => (
                  <Art
                    key={i}
                    name={"technical-" + i}
                    alt={c.technicalCaptions[i - 1]}
                  />
                )),
              ]}
            </BookCarousel>
          </div>
        </Section>
        <Section id="outcome" label={c.result[0]} title={c.result[1]}>
          <div className={styles.twoColumns}>
            <div>
              <p>{c.result[2]}</p>
              <p>{c.result[3]}</p>
              <ButtonV3
                href={
                  pt
                    ? "https://enquantodurarafe.com.br/"
                    : "https://enquantodurarafe.com.br/give-us-this-day-our-daily-lie"
                }
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {pt ? "Explorar o hotsite" : "Explore the website"}
                <IconV3 name="arrow-right" size={16} />
              </ButtonV3>
            </div>
            <Art
              name={pt ? "ending" : "ending-en"}
              alt={
                pt
                  ? "Encerramento do hotsite com convite para conhecer o livro"
                  : "Website closing with an invitation to discover the book"
              }
            />
          </div>
        </Section>
        <CaseReflectionV3
          eyebrow={pt ? "REFLEXÃO" : "REFLECTION"}
          title={c.reflection[0]}
          lead={c.reflection[1]}
          quote={c.reflection[2]}
          close={c.reflection[3]}
          nextLabel={pt ? "Próximo projeto" : "Next project"}
          next={{
            href: (pt ? "/pt" : "") + "/cases/theodoor",
            logoSrc: "/images/v3/home/brands/white/theodoor.svg",
            logoAlt: "Theodoor",
            logoWidth: 104,
            name: "Theodoor",
            summary: pt ? "App acessível para automação de portas inteligentes." : "Accessible app for smart door automation.",
            background: "var(--color-case-theodoor-accent)",
          }}
        />
        <div id="contact">
          <ContactCTA locale={locale} contactHref="mailto:hello@deiver.com.br" />
        </div>
      </main>
      <FooterV3
        locale={locale}
        homeHref={home}
        aboutHref={about}
        resumeHref={RESUME_HREF[locale]}
        linkedinHref="https://linkedin.com/in/deiverbrito"
      />
    </>
  );
}
