---
name: deploy-storybook-vercel
description: Rebuild and deploy this project's static Storybook site (storybook-static) to its Vercel project "portfolio-storybook". Use this whenever the user asks to publish, update, redeploy, or "subir"/"publicar"/"atualizar" the Storybook (e.g. "publica o Storybook", "atualiza o link do Storybook", "sobe essa mudança pro Storybook"), or right after any change to a component, story, or .storybook/ config that should be reflected on the live Storybook link (https://portfolio-storybook-ten.vercel.app). Also use this if a `vercel deploy` from storybook-static/ ever creates an unexpected duplicate project instead of updating the existing one — this skill explains exactly why that happens and how to fix it.
---

# Deploy Storybook to Vercel

## Why this needs its own steps (don't just build + deploy)

`npm run build-storybook` deletes and fully regenerates the `web/storybook-static/`
folder from scratch. That folder is also where Vercel's CLI stores its project
link (`.vercel/project.json`) — so every rebuild silently wipes that link too.

If you then run `vercel deploy --prod` without relinking first, the Vercel CLI
has no idea this folder is supposed to be `portfolio-storybook` — it falls back
to naming a **brand new project** after the directory (`storybook-static`),
leaving the real site un-updated and a stray duplicate project behind. This
happened twice in one session before the pattern was caught. Always relink
before deploying.

## Steps

1. Build:
   ```bash
   cd web && npm run build-storybook
   ```
2. Relink (do this every time, even if you linked before — the folder was just wiped):
   ```bash
   cd storybook-static
   rm -rf .vercel
   npx vercel link --yes --project portfolio-storybook
   ```
3. Deploy:
   ```bash
   npx vercel deploy --prod --yes
   ```
4. Verify no duplicate project was created:
   ```bash
   npx vercel projects ls | grep -i storybook
   ```
   This should show only `portfolio-storybook`. If anything else shows up
   (e.g. `storybook-static`), step 2 didn't happen before a deploy at some
   point — delete the stray one (see below) and redeploy.

5. Confirm the live link reflects the change: https://portfolio-storybook-ten.vercel.app

## Cleaning up a stray duplicate project

`vercel projects rm <name>` asks for an interactive `y/N` confirmation.
**Don't pipe it through the `yes` utility** (`yes | npx vercel projects rm ...`) —
the CLI's prompt re-renders on every keystroke it receives, and an infinite
stream of `y\n` can make it loop and produce a huge garbled output. Use a
single confirmation instead:

```bash
printf 'y\n' | npx vercel projects rm <stray-project-name>
```

## Note

This is the same underlying gotcha for *any* static-export-then-CLI-deploy
workflow (the build step regenerating the output folder wipes whatever state
lives inside it) — not unique to Storybook. If this project ever adds another
static site deployed the same way, apply the same relink-before-deploy habit.
