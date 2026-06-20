# Experiment 3: Astro-aware ESLint and design foundation

## Description

Close requirement 2's remaining gap — **ESLint** for the website — and lay the
design foundation the content experiment builds on: intentional typography,
page chrome (sticky header, footer), link/prose styling, and a small set of
reusable building blocks, all driven by the semantic tokens from Experiment 1.

The root `ts/eslint.config.js` ignores `website/` (its strict-type-checked
`projectService` can't parse `.astro`), so the website gets its **own**
Astro-aware flat config.

## Changes

- `ts/website/eslint.config.js` — flat config composing
  `@eslint/js` recommended, `typescript-eslint` recommended, and
  `eslint-plugin-astro` recommended; ignores `dist/`, `.astro/`, `node_modules/`.
- `ts/website/package.json` — add devDeps `eslint`, `@eslint/js`,
  `typescript-eslint`, `eslint-plugin-astro`, `globals`; add script
  `lint` → `eslint .`.
- `ts/website/src/styles/global.css` — add `--font-sans` / `--font-mono` to
  `@theme` (zero-dependency system stacks), apply base typography to `body`,
  add a smooth `color`/`background-color` transition, focus-visible ring using
  the `accent` token, and `@media (prefers-reduced-motion: reduce)` to disable
  transitions.
- `ts/website/src/components/Footer.astro` — site footer (copyright, GitHub /
  npm links) using `muted`/`border` tokens.
- `ts/website/src/layouts/Layout.astro` — make the header sticky with a
  translucent backdrop and bottom border; render the `Footer`; wrap content in a
  flex column so the footer sits at the bottom on short pages.
- `ts/website/src/pages/index.astro` — restyle the placeholder hero to use the
  new typography and a primary call-to-action button, so the foundation is
  visible (full landing content is Experiment 4).

## Verification

1. `pnpm --filter @webbuf/website lint` → 0 errors.
2. `pnpm --filter @webbuf/website check` → 0 errors.
3. `pnpm --filter @webbuf/website build` succeeds.
4. Dev server serves `GET /` → 200 with the header, hero, and footer present.

Pass criteria: all four steps succeed.

## Result

**Pass.**

- Added `ts/website/eslint.config.js` (Astro-aware flat config) and the
  `eslint`/`typescript-eslint`/`eslint-plugin-astro`/`globals` devDeps;
  `pnpm --filter @webbuf/website lint` → **0 errors**.
- `pnpm --filter @webbuf/website check` → **0 errors, 0 warnings, 0 hints**
  (11 files). A `ts(6387)` deprecation hint on `eslint.config.js`'s
  `tseslint.config` call was removed by excluding the lint config from the
  website tsconfig's type-check set.
- `pnpm --filter @webbuf/website build` succeeded.
- Dev server `GET /` → 200 with header (WebBuf), footer (MIT licensed), and the
  hero CTA (Read the docs) all present.

Foundation added: system-stack `--font-sans` / `--font-mono` tokens, base body
typography, themed focus-visible ring, palette-swap transitions with a
`prefers-reduced-motion` opt-out, a sticky translucent header, and a `Footer`
with GitHub/npm links. The hero was restyled with the logo and a primary CTA.

## Conclusion

Requirement 2's ESLint gap is closed — the website has its own Astro-aware lint
config and a `lint` script, and lint/check/build are all green. The design
foundation (typography, page chrome, focus/motion accessibility, reusable
footer) is in place for the content experiment. The hero links to `/docs`, which
Experiment 4 will create.

Next experiment (to be designed): content — the landing page and the docs
section covering the `@webbuf/*` packages, including Shiki `tokyo-night` code
blocks.
