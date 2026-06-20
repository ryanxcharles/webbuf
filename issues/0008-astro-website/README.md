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
   **TokyoNight** (dark) and **TokyoNight Day** (light) as the color themes.
4. **Image pipeline**:
   - A **TypeScript** script (not JavaScript) that lives **in the website
     folder** and uses `sharp`.
   - Inputs: the two source logos in `assets/`.
   - Outputs to `ts/website/public/images/`:
     - **WebP** at the full size set `[32, 64, 96, 128, 180, 200, 300, 400]`
       for both light and dark variants, for use on the page itself.
     - **Two PNG favicons** (a PNG saved as the favicon — "favicon.ico can be a
       PNG"): one for light mode and one for dark mode, selected by the page via
       a `prefers-color-scheme` media query.
5. **Verification**: the website must build and run in dev (e.g. `pnpm dev`),
   and be tested to confirm it runs.

## Constraints / out of scope

- **No deployment.** The site will be deployed to Cloudflare later; that work
  belongs to a future issue and is out of scope here.
- Source logos in `assets/` are inputs only — the pipeline reads them and writes
  derived assets under `ts/website/public/images/`; it does not modify the
  sources.

## Analysis

Open questions to resolve as experiments are designed:

- **Astro + Tailwind v4 integration**: Tailwind v4 uses the Vite plugin
  (`@tailwindcss/vite`) rather than a PostCSS config; confirm the current
  Astro + Tailwind v4 wiring.
- **Theme mechanism**: how dark/light/system is applied (e.g. a `class`/`data`
  attribute on `<html>` plus a small inline script to avoid FOUC, with
  TokyoNight / TokyoNight Day token sets driving CSS variables).
- **Workspace wiring**: how `ts/website` registers in `pnpm-workspace.yaml` and
  whether the image script runs as a package script (`build:images`) ahead of
  the Astro build, mirroring the sibling `website/scripts/` convention but in
  TypeScript via `tsx`.
- **Favicon references**: dual `<link rel="icon">` tags with `media` queries for
  light vs. dark PNG favicons.

Experiments will be designed one at a time; the first is expected to scaffold
the Astro + Tailwind v4 + theming skeleton and confirm it runs in dev, before
the image pipeline is wired in.
