# Experiment 2: Logo image pipeline (WebP + dual PNG favicons)

## Description

Add the TypeScript `sharp` pipeline that turns the two source logos
(`assets/webbuf-2-light.png`, `assets/webbuf-2-dark.png`) into web-ready assets,
and wire the favicons into the document. Modeled on radcn's
`scripts/process-icons.mjs`, but TypeScript (run via `tsx`), living inside
`ts/website`, and adapted for two variants and a PNG favicon per color scheme.

This satisfies requirement 5 of the spine and de-risks the external-tooling part
of the issue early. It also gives the site a real logo to show, which the later
content experiment builds on.

## Changes

- `ts/website/package.json` — add `sharp` (dep) and `tsx` (devDep); add script
  `build:images` → `tsx scripts/process-images.ts`.
- `ts/website/scripts/process-images.ts` — for each variant:
  - emit **WebP** at sizes `[32, 64, 96, 128, 180, 200, 300, 400]` into
    `public/images/` as `webbuf-2-{light,dark}-{size}.webp` (transparent,
    `webp({ quality: 92 })`);
  - emit a **PNG favicon** (`favicon-light.png` from the light logo,
    `favicon-dark.png` from the dark logo) into `public/`;
  - generate `src/lib/images.ts`: a typed union (`SiteImage`) of every emitted
    WebP path plus a `siteImage()` identity helper, so pages reference images
    type-safely (mirrors radcn's generated `images.ts`).
- `ts/website/src/components/Logo.astro` — a logo that shows the light-variant
  WebP in light mode and the dark-variant in dark mode (via `dark:` utilities
  bound to `[data-theme]`).
- `ts/website/src/layouts/Layout.astro` — dual `<link rel="icon">` tags:
  `favicon-light.png` under `media="(prefers-color-scheme: light)"` and
  `favicon-dark.png` under `media="(prefers-color-scheme: dark)"`; put the Logo
  in the header next to the wordmark.
- Generated outputs under `public/images/` and the favicon PNGs are committed
  (derived assets, like the sibling sites); source logos are untouched.

Which logo maps to which favicon: the light-variant art is drawn for light
backgrounds, so it is the **light-mode** favicon; the dark-variant is the
**dark-mode** favicon.

## Verification

1. `pnpm --filter @webbuf/website build:images` runs clean and produces 16 WebP
   files (8 sizes × 2 variants), 2 favicon PNGs, and `src/lib/images.ts`.
2. `pnpm --filter @webbuf/website check` → 0 errors (generated `images.ts` and
   the `Logo` component type-check).
3. `pnpm --filter @webbuf/website build` succeeds; `dist/` contains the favicon
   links, the favicon PNGs, and the referenced WebP assets.
4. Dev server serves `GET /` → 200, and `GET /favicon-light.png` /
   `GET /favicon-dark.png` → 200.

Pass criteria: all four steps succeed.

## Result

**Pass.**

- `build:images` ran clean and produced **16 WebP** files (8 sizes × light/dark)
  in `public/images/`, **2 favicon PNGs** (`favicon-light.png`,
  `favicon-dark.png`) in `public/`, and the generated `src/lib/images.ts`
  (`SiteImage` union + `siteImage()` helper). pnpm's supply-chain policy
  auto-added `minimumReleaseAgeExclude` entries for the sharp platform binaries.
- `pnpm --filter @webbuf/website check` → **0 errors** across 10 files
  (generated `images.ts`, `Logo.astro` using `siteImage(...)`).
- `pnpm --filter @webbuf/website build` succeeded; `dist/` contains 18 image
  assets (2 favicons + 16 WebP) and `dist/index.html` references the favicon
  links and the WebP logo.
- Dev server: `GET /` → 200 `text/html`; `/favicon-light.png` and
  `/favicon-dark.png` → 200 `image/png`; `/images/webbuf-2-dark-64.webp` → 200
  `image/webp`.

## Conclusion

The radcn-modeled `sharp` pipeline is in place as a TypeScript script
(`scripts/process-images.ts`, run via `tsx` as `build:images`): two source logos
→ full WebP size set per variant + a PNG favicon per color scheme + a typed
image manifest. Favicons are wired via dual `<link rel="icon">` media queries,
and the theme-aware `Logo` component renders the correct variant in light/dark.
Generated assets are committed alongside the source. Requirement 5 of the spine
is satisfied.

Next experiment (to be designed): ESLint (Astro-aware) plus the design
foundation — typography, base components (header/footer/nav, code block),
responsive + accessibility.
