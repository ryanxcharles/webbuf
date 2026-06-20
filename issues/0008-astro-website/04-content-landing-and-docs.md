# Experiment 4: Content — landing page and docs section

## Description

Deliver the content scope from the spine: a finished landing page and a real
**docs** section covering the `@webbuf/*` packages. Code snippets use Astro's
build-time Shiki highlighter with the `tokyo-night` theme (no client JS). Package
metadata is data-driven so the docs index and per-package pages stay in sync.

Accuracy constraint: descriptions and APIs come from the repo's documented
surface (CLAUDE.md). Usage snippets are only shown for packages whose API is
documented (`@webbuf/webbuf`, `@webbuf/fixedbuf`, `@webbuf/blake3`); the rest get
an accurate summary + install command rather than invented API.

## Changes

- `ts/website/src/data/packages.ts` — typed catalog of the 15 published packages
  (slug, npm name, category, summary, install command, optional usage snippet),
  grouped into categories (Core buffers, Hashing, Elliptic curve, Encryption,
  Post-quantum).
- `ts/website/src/layouts/DocsLayout.astro` — docs shell: a sidebar navigation
  (categories → packages) plus the content column, reusing the base `Layout`.
- `ts/website/src/pages/docs/index.astro` — docs overview: intro, install of the
  umbrella `webbuf` package, and a grid of package cards linking to each page.
- `ts/website/src/pages/docs/[slug].astro` — `getStaticPaths` over the catalog;
  renders each package's summary, install block, and usage (when present) with
  prev/next links.
- `ts/website/src/components/CodeBlock.astro` — thin wrapper over the
  `astro:components` `Code` component pinning `theme="tokyo-night"` and the card
  chrome (border, rounded).
- `ts/website/src/layouts/Layout.astro` — add a `Docs` link to the header nav.
- `ts/website/src/pages/index.astro` — finish the landing: hero, a short
  "why WebBuf" feature trio, and a highlighted install snippet.

## Verification

1. `pnpm --filter @webbuf/website lint` → 0 errors.
2. `pnpm --filter @webbuf/website check` → 0 errors.
3. `pnpm --filter @webbuf/website build` succeeds and emits `/docs/index.html`
   plus one page per package (`/docs/<slug>/index.html`).
4. Dev server: `GET /` → 200, `GET /docs` → 200, and a sample package page
   (e.g. `/docs/blake3`) → 200 containing its name and a highlighted code block.

Pass criteria: all four steps succeed and the docs pages render for every
package in the catalog.

## Result

**Pass.**

- `pnpm --filter @webbuf/website lint` → **0 errors**.
- `pnpm --filter @webbuf/website check` → **0 errors, 0 warnings, 0 hints**
  (16 files).
- `pnpm --filter @webbuf/website build` → **17 pages**: landing, `/docs`, and
  one page per catalog entry (15 packages), e.g. `/docs/blake3/index.html`,
  `/docs/main/index.html`.
- Dev server: `GET /` → 200, `GET /docs` → 200, `GET /docs/blake3` → 200. The
  blake3 page renders a Shiki `tokyo-night` code block (`.astro-code`, the
  `#1a1b26` background, and the real `blake3Hash` usage snippet).

## Conclusion

The content scope is delivered: a finished landing page (hero, install snippet,
feature trio) and a data-driven docs section with a sidebar, an overview grid,
and a generated page per package with install + (where documented) usage, all
highlighted at build time with Shiki `tokyo-night` and no client JS. Package
metadata lives in one typed catalog (`src/data/packages.ts`) so the index,
sidebar, and pages stay in sync. Usage snippets were limited to the three
packages whose API is documented in CLAUDE.md to avoid inventing crypto APIs.

Next experiment (to be designed): final verification pass (full lint/check/build
from the workspace root, regenerate images for reproducibility, behavioral
sanity) and close the issue.
