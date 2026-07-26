---
name: storybook-story-conventions
description: Use this whenever writing, reviewing, or editing a .stories.tsx file in this project (or any Storybook story in general) — e.g. "cria as stories desse componente", "documenta isso no Storybook". Make sure to consult it any time a story's args or render function would otherwise include real production content — a real client/case name, real copy, a real photo — even if that content is sitting right there in the app and reusing it feels convenient. Also covers a specific bug pattern when hand-building a placeholder image as an inline SVG data URI.
---

# Storybook story content conventions

## Why generic placeholder content, not real production data

A Storybook story documents what a **component** can do in isolation — its
props, variants, states — not what one particular page of the app looks like.
Filling a story with real content (an actual client's name and photo, real
case-study copy) makes the story read as "here's the Cure Intelligence card"
instead of "here's what CaseCardLarge can render" — it quietly couples the
documentation to content that will change or go stale, and it hides which
parts are the component's real API versus incidental to that one example.

Default every story to generic content:
- Buttons/tags: `"Label"`.
- Card titles: `"Case Study One"`, `"Case Study Two"`, etc.
- Card body copy: a short generic filler sentence describing "a problem and a
  design approach" without naming a real product.
- Images: a plain placeholder (a neutral gray rectangle), never a real
  screenshot or photo from the app.

**Exception**: a story explicitly meant to demonstrate one real, named
scenario is fine — but name it accordingly (e.g. `RealCaseExample`) so it's
clear that story is the deliberate exception, not the pattern to copy for the
next component.

## A specific bug to avoid: double-encoding an inline placeholder image

When building a placeholder image as an inline SVG data URI, it's tempting to
write the SVG with the `#` in a fill color already percent-escaped
(`fill='%23d9d9d9'`) and then wrap the whole string in `encodeURIComponent()`.
Don't — `encodeURIComponent` will re-escape the `%` itself, turning `%23` into
`%2523`, which decodes back to the literal text `%23d9d9d9` as the color value
— not a color at all, so the fill silently renders as black.

Write the SVG with plain, unescaped characters (`fill='#d9d9d9'`) and let a
single `encodeURIComponent()` call do all the escaping:

```ts
const placeholderImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='100%' height='100%' fill='#d9d9d9'/></svg>"
  );
```

After adding or changing a placeholder image like this, actually look at the
rendered story (screenshot or browser) rather than assuming the string is
correct — this bug produces no error, just a wrong-looking render.
