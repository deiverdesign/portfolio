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
- The cookie's `Path` is scoped to `/cases/aster`, so it's never sent
  to (or usable by) any other page on the site.
- If someone visits `/cases/aster` directly without a valid cookie, the
  server renders only the password screen — the actual case content
  (copy, image placeholders, everything) is never included in that
  page's HTML, so there's nothing to find by viewing source.

See `web/src/app/cases/aster/session.ts` and `actions.ts` for the
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
