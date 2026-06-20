# Experiment 1: Scaffold the Astro site with three-mode TokyoNight theming

## Description

Stand up the website package at `ts/website` and prove the riskiest part of the
issue — three-mode (light / dark / system) TokyoNight theming with no flash of
the wrong theme (FOUC) — works end-to-end in dev. This is the thin vertical
slice the spine calls for: a real Astro + Tailwind v4 project, a semantic token
layer driven by the two palettes, a working manual toggle, and one placeholder
page, confirmed running via `astro dev` and clean under `astro check`.

Content, the full component/design foundation, and the `sharp` image pipeline
are deliberately **out of scope** for this experiment — they are later
experiments. The goal here is a correct, FOUC-free theming spine to build on.

## Changes

New package `ts/website` (auto-joins the `ts/` pnpm workspace via
`packages: ['*']`):

- `package.json` — name `@webbuf/website`, private, type module; deps `astro`,
  `@tailwindcss/vite`, `tailwindcss`; devDeps `@astrojs/check`, `typescript`;
  scripts `dev`, `build`, `preview`, `check`, `format`.
- `astro.config.ts` — registers the Tailwind v4 Vite plugin
  (`@tailwindcss/vite`); static output.
- `tsconfig.json` — extends `astro/tsconfigs/strict`.
- `src/styles/global.css` — `@import "tailwindcss"`; a `@theme` block mapping
  semantic color utilities (`--color-bg`, `--color-surface`, `--color-fg`,
  `--color-muted`, `--color-accent`, `--color-border`) to CSS variables;
  `:root` holds the **TokyoNight Day** (light) values and `[data-theme="dark"]`
  overrides them with **TokyoNight** (dark) values; a `@custom-variant dark` so
  `dark:` utilities also work.
- `src/lib/theme.ts` — the inline no-FOUC script source: resolves the stored
  mode (`light` / `dark` / `system`, default `system`) against
  `prefers-color-scheme`, sets `data-theme` on `<html>` before paint, and keeps
  `system` mode reactive to OS changes.
- `src/components/ThemeToggle.astro` — a visible button that cycles
  system → light → dark, persists the mode to `localStorage`, and re-applies.
- `src/layouts/Layout.astro` — base document; inlines the theme script in
  `<head>` before any paint; pulls in `global.css`; renders the toggle.
- `src/pages/index.astro` — a placeholder page using the semantic tokens
  (heading, body copy, a bordered surface card) so theme switching is visible.
- ESLint/Prettier: the website is formatted by the shared `ts/` Prettier. The
  root `ts/eslint.config.js` is updated to **ignore `website/`** so its
  strict-type-checked `projectService` does not try to parse `.astro` files;
  dedicated Astro-aware linting is deferred to the polish experiment.

## Verification

1. `pnpm install` at the `ts/` root resolves the new package with no errors.
2. `pnpm --filter @webbuf/website check` (i.e. `astro check`) reports 0 errors.
3. `pnpm --filter @webbuf/website dev` starts the dev server and serves the
   placeholder page (confirmed via HTTP fetch of the dev URL returning 200 with
   the expected markup).
4. `pnpm --filter @webbuf/website build` produces a static build with no errors.
5. Theme correctness (reasoned from the code, since dev is headless):
   - first paint sets `data-theme` from the inline head script — no FOUC;
   - default with no stored mode follows `prefers-color-scheme`;
   - toggling cycles system → light → dark and persists across reloads.

Pass criteria: steps 1–4 succeed and the theming mechanism in step 5 is correct
by construction.

## Result

**Pass.**

- `pnpm install` (31 workspace projects) resolved `@webbuf/website` cleanly.
  One snag: pnpm 11 escalated unapproved native build scripts to a hard error
  (`ERR_PNPM_IGNORED_BUILDS`) for `sharp` and `esbuild`, which failed the
  pre-run deps check. Fixed by filling in the scaffolded `allowBuilds` knobs in
  `ts/pnpm-workspace.yaml` (`esbuild: true`, `sharp: true`) and adding `sharp`
  to `onlyBuiltDependencies`. Re-install exited 0 with both build scripts run.
- `pnpm --filter @webbuf/website check` → **0 errors, 0 warnings, 0 hints**
  across 7 files.
- `pnpm --filter @webbuf/website build` → static build, 1 page, completed.
- Dev server (`astro dev`) booted in ~0.5s and served `GET /` → **200** with
  markup containing `WebBuf`, `theme-toggle`, and the `prefers-color-scheme`
  query.
- Built `index.html` inlines the render-blocking theme script (`__theme`,
  `data-theme`); generated CSS defines `--color-bg: var(--bg)` and
  `.bg-bg { background-color: var(--color-bg) }`, so the semantic tokens swap
  by `[data-theme]` as designed — FOUC-free by construction.

Added a website `.gitignore` for `dist/`, `.astro/`, `node_modules/`.

## Conclusion

The Astro + Tailwind v4 scaffold at `ts/website` runs in dev and builds clean,
with a working three-mode (system/light/dark) TokyoNight theming spine: a
semantic CSS-variable token layer, a render-blocking no-FOUC head script, and a
persisted manual toggle. This is the foundation the remaining experiments build
on. Deviation from the design: the no-FOUC script is shipped as an exported
string (`themeScript` in `src/lib/theme.ts`) and inlined via
`<script is:inline set:html>` — a real pre-paint inline script cannot be a
bundled module, and this keeps the source type-checked while still inlining.

Next experiment (to be designed): the design foundation — full token scale,
typography, base components, responsive + accessibility pass.
