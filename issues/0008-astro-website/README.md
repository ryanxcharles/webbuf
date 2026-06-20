+++
status = "open"
opened = "2026-06-20"
+++

# Astro website with logo image pipeline

## Goal

Stand up a new Astro website for WebBuf at `ts/website` — TypeScript, Tailwind
v4, with dark/light/system theming — and a `sharp`-based image pipeline that
turns the two source logos into WebP web images and PNG favicons. The site must
build and run in dev; deployment is explicitly out of scope.

## Background

WebBuf currently has **no website**: no `website/` directory, no `public/`, no
`index.html`, no favicon, no `sharp`, and no root `package.json` (the TypeScript
workspace lives under `ts/`, managed by pnpm). Two new source logos were added
to `assets/`:

- `assets/webbuf-2-light.png` — 1000×1000, transparent (light-mode logo)
- `assets/webbuf-2-dark.png` — 1000×1000, transparent (dark-mode logo)

Every sibling project in `~/dev` (nutorch, shannon, termplot, termsurf) keeps
its site under `website/` (Astro) with processed images in
`website/public/images/`. **radcn** is the closest model for what we want here:
its `scripts/process-icons.mjs` uses `sharp ^0.34.5` to emit multi-size WebP
plus a PNG written to `favicon.ico` (browsers accept PNG content in a `.ico`,
referenced with `type="image/png"`). We adapt that pipeline, but in TypeScript
and living inside the new website package.

This is the first website in the WebBuf repo, so this issue also establishes the
conventions (location, framework, theming, image pipeline) that future website
work builds on.

## Requirements

Decided up front with the issue owner:

1. **Location**: the website lives at `ts/website`, joining the existing `ts/`
   pnpm workspace as a package.
2. **Stack**: TypeScript + Astro, with ESLint and Prettier (consistent with the
   workspace's existing lint/format conventions). Tailwind v4.
3. **Theming**: support **dark**, **light**, and **system** modes, using
   **TokyoNight** (dark) and **TokyoNight Day** (light) as the color themes. A
   visible **manual toggle** cycles light/dark/system, persists the choice to
   `localStorage`, and defaults to the OS setting (`prefers-color-scheme`).
4. **Content scope**: a **landing page plus a documentation site** — a marketing
   landing page and a real docs section covering the `@webbuf/*` packages
   (closest in scope to the sibling radcn / nutorch sites).
5. **Image pipeline**:
   - A **TypeScript** script (not JavaScript) that lives **in the website
     folder** and uses `sharp`.
   - Inputs: the two source logos in `assets/`.
   - Outputs to `ts/website/public/images/`:
     - **WebP** at the full size set `[32, 64, 96, 128, 180, 200, 300, 400]`
       for both light and dark variants, for use on the page itself.
     - **Two PNG favicons** (a PNG saved as the favicon — "favicon.ico can be a
       PNG"): one for light mode and one for dark mode, selected by the page via
       a `prefers-color-scheme` media query.
6. **Verification**: the website must build and run in dev (e.g. `pnpm dev`),
   and be tested to confirm it runs.

## Constraints / out of scope

- **No deployment.** The site will be deployed to Cloudflare later; that work
  belongs to a future issue and is out of scope here.
- **No OpenGraph / social image** in this issue. The sharp pipeline is limited
  to the dual PNG favicons and the WebP size set; an OG composite can be a later
  issue.
- Source logos in `assets/` are inputs only — the pipeline reads them and writes
  derived assets under `ts/website/public/images/`; it does not modify the
  sources.

## Analysis

This is the repo's first website, the content scope is a landing **plus docs**
site, and three-mode TokyoNight theming is the riskiest part. So the approach
front-loads a thin vertical slice that proves theming end-to-end before content
is built on top. The sequence below is the **intended shape**, not a committed
list — experiments are designed one at a time and each informs the next.

### Foundations (load-bearing)

- **Design tokens, not raw hex.** Map the TokyoNight (dark) and TokyoNight Day
  (light) palettes into a **semantic token layer** (`bg` / `surface` / `fg` /
  `muted` / `accent` / `border`, …) exposed as CSS variables and wired into
  Tailwind v4 via `@theme`. Components reference role tokens so both palettes
  (and a third "system" mode) stay maintainable.
- **Typography.** TokyoNight is only a color scheme; pick a display font and a
  mono font (the mono carries code snippets, which matter for a crypto library).
- **No-FOUC three-mode switching.** An inline `<head>` script reads
  `localStorage` then falls back to `prefers-color-scheme`, sets a class/attr on
  `<html>` before paint; the visible toggle (the only client-side JS) cycles
  light/dark/system and persists the choice.
- **Code-snippet styling.** Astro's built-in Shiki ships a `tokyo-night` theme,
  which lines up with the chosen palette — use it for install/usage blocks.

### Intended sequence

1. **Scaffold + thin slice** — Astro in `ts/website`, registered in
   `pnpm-workspace.yaml`; Tailwind v4 (`@tailwindcss/vite`); a minimal
   TokyoNight/Day token set; no-FOUC three-mode switch + toggle; one placeholder
   page; **running in dev**. Validates the risky spine end-to-end.
2. **Design foundation** — full semantic token scale, typography, base
   components (Layout, header/footer, link/button, code block), responsive +
   accessibility (contrast in **both** palettes, `prefers-reduced-motion`,
   semantic HTML).
3. **Asset pipeline** — the TypeScript `sharp` script (WebP size set for both
   variants + dual PNG favicons) in the website folder, run via `tsx` as a
   `build:images` package script ordered ahead of the Astro build; favicons
   referenced via dual `<link rel="icon">` tags with `media` queries; output to
   `ts/website/public/images/`.
4. **Content** — the landing page (hero with logo, what WebBuf is, install
   snippet, npm/GitHub links) and the docs section covering the `@webbuf/*`
   packages.
5. **Polish / verify** — `astro check` (typecheck), ESLint, Prettier,
   `astro build`, meta/SEO, and a final dev-server verification.

### Tooling integration

- `ts/website` inherits the workspace ESLint and Prettier conventions (shared
  configs live at the `ts/` root) and joins the existing pnpm workspace.
- The image script is **TypeScript** (run via `tsx`), living inside
  `ts/website`, modeled on radcn's `scripts/process-icons.mjs` but adapted for
  two source variants and a PNG-favicon-per-mode.

Open questions are resolved as each experiment is designed; the first experiment
is expected to be the scaffold + thin slice above.
