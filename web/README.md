## Typography — which font-size token to use

`src/styles/tokens.css` defines a numeric scale plus named font-size roles
(`--font-size-body-large`, `--font-size-body-medium`,
`--font-size-caption-medium`, etc.), generated from Figma. The complete
mapping is documented in [`docs/typography-system.md`](docs/typography-system.md).
Nothing in the app should ever use a hardcoded
`font-size: 14px` — always reference one of these tokens, so the whole
site stays in sync if the scale changes in Figma.

**The rule that was missing until now:** the token choice depends on
what role the text plays, not just "how big does it look ok". In
practice, three roles cover almost everything:

| Role | Token | Desktop size | Example |
|---|---|---|---|
| Paragraph you're meant to actually **read** (case study body copy, bio, capability description) | `--font-size-body-large` | 16px | `<p>` inside a case study section |
| Secondary/supporting text (card preview blurb, photo caption, meta label like "Duration") | `--font-size-body-medium`, `--font-size-data-medium` or `--font-size-caption-medium` | 12–14px | `.metaValue`, `.caption`, card `.description` |
| UI label (nav link, button) | `--font-size-label-large` | 14px | NavBar links, `<Button>` |

Before this pass, the ASTER case used the token now called
`--font-size-body-large` for
its section paragraphs, but Capabilities, About, and the 4 other case
studies (Cure/HP/Theodoor/Intuit) used the tokens now called
`--font-size-data-medium` or `--font-size-body-medium` (12–14px desktop)
for the same kind of reading text
— same visual role, three different tokens, so the site read as
inconsistent page to page even though each page individually used
tokens correctly. Fixed by moving every "reading paragraph" selector
to `--font-size-body-large`, matching what ASTER already did — see
`cases.module.css`, `competencias/page.module.css`, and
`sobre/page.module.css`. `--font-size-data-medium` and
`--font-size-caption-medium` stay reserved
for genuinely secondary/small text, not full paragraphs.

This isn't in Storybook yet — there's no "Typography" story showing
the scale, since these are page-level CSS Module styles, not a
reusable design-system component like `<Button>` or `<Tag>`. Worth
adding later if it gets confusing again, but the token file itself
(`tokens.css`) is already the single source of truth in the meantime.

## ASTER case — password setup

The `/cases/aster` case study is protected by a password checked on the
server (not in the browser). To make it work, the owner has to supply a
password through an environment variable — it is never written into the
code or committed to the repo.

**Variable name:** `ASTER_CASE_PASSWORD`

### Local development

Create `web/.env.local` (already covered by `.gitignore` — the `.env*`
rule — so it's never committed):

```
ASTER_CASE_PASSWORD=choose-a-password-here
```

Restart `npm run dev` after adding or changing it.

### Production (Vercel)

1. Open the `portfolio` project on [vercel.com](https://vercel.com).
2. Go to **Settings → Environment Variables**.
3. Add `ASTER_CASE_PASSWORD` with the real password, scoped to
   **Production** (and Preview, if you want password-protected previews
   to work too).
4. Redeploy (`vercel deploy --prod`, or push to `main`) so the new
   deployment picks up the variable — env vars only apply to
   deployments created after they're saved.

### How the protection actually works

- Submitting the password calls a Server Action that checks it against
  `ASTER_CASE_PASSWORD` **on the server** — the password itself is never
  sent to or stored in the browser's JavaScript.
- On success, the server sets an `HttpOnly` cookie (`aster_session`) —
  a cookie that JavaScript in the browser cannot read, only the server
  can verify it. The cookie is signed (HMAC using the password as the
  key), so it can't be forged by manually setting a cookie value in
  DevTools.
- The cookie has no expiration set, so it's a session cookie: closing
  the browser clears it. The "Lock this case" button in the case
  clears it immediately too.
- The cookie's `Path` is `/`, so the same unlocked session works on
  both `/cases/aster` (PT) and `/en/cases/aster` (EN) — unlocking one
  language unlocks the other too, without asking for the password
  twice. It's still never sent to unrelated third-party sites, since
  cookies are always scoped to this domain regardless of `Path`.
- If someone visits `/cases/aster` or `/en/cases/aster` directly
  without a valid cookie, the server renders only the password screen
  — the actual case content (copy, image placeholders, everything) is
  never included in that page's HTML, so there's nothing to find by
  viewing source.

See `web/src/app/_shared/aster/session.ts` and `actions.ts` for the
implementation.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
