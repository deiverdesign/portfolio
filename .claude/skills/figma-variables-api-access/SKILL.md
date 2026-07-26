---
name: figma-variables-api-access
description: Use this whenever a task involves reading or writing Figma Variables (design tokens) through Figma's REST API — generating a personal access token for scripts/sync-tokens.mjs, choosing which scope to select in Figma's "Generate new token" dialog (e.g. "qual scope eu marco", "gerei o token do Figma e deu erro 403"), debugging a 403 "Invalid scope" error from api.figma.com, or deciding between the REST API and the Plugin API (use_figma/MCP) for a variables task. Trigger this proactively before telling the user which token scope to pick — don't guess from general REST API conventions.
---

# Figma Variables: REST API vs Plugin API

## The mistake this prevents

Figma's Variables REST endpoint (`GET /v1/files/:key/variables/local`, used by
`scripts/sync-tokens.mjs`) requires the **`file_variables:read`** scope
specifically. It is easy to guess `file_content:read` instead (it's the
obvious-sounding, most general-purpose "read a file" scope, and it covers
almost everything else about a file) — that guess is wrong here and only
surfaces as a 403 error at request time: `"Invalid scope(s): file_content:read.
This endpoint requires the file_variables:read scope"`.

Worse: on many plans, **`file_variables:read` doesn't even appear** as an
option in Figma's personal access token creation screen — the Variables REST
API is gated to Organization/Enterprise-tier accounts. If the scope isn't
offered in the dialog, no combination of the other scopes will work around
it — the REST route for variables is simply unavailable on that account,
regardless of which token gets generated.

## What to do

1. **Before advising a scope**, don't infer it from the general shape of
   Figma's REST API — check what the specific endpoint documents as required,
   or let the request itself surface the exact error (Figma's 403 messages
   name the missing scope directly).
2. **If the user's token dialog doesn't list `file_variables:read`** as an
   option at all, tell them plainly: their plan doesn't support the Variables
   REST API, this isn't a scope-selection mistake, and no amount of
   re-generating the token will fix it.
3. **Prefer the Plugin API instead**, whenever it's available. The `use_figma`
   MCP tool talks to the Figma desktop app directly (Plugin API,
   `figma.variables.*`) and reads/writes variables with no such plan-tier
   gating — this is how variable changes get made and inspected in this
   project today, token or no token. Reach for the REST script
   (`sync-tokens.mjs`) only when the user has confirmed an Organization/
   Enterprise plan; otherwise, do the equivalent read/update live via
   `use_figma` and treat that as the real pipeline for this project, not a
   workaround.

## Quick reference: this project's setup

- REST file key: `zpaQNzgjhG5ZKafe2cxnkm` (same file the MCP tools use).
- `scripts/sync-tokens.mjs` expects `FIGMA_TOKEN` as an env var, never
  committed, and is meant to be run by the user in their own terminal — never
  ask the user to paste a Figma personal access token into chat.
