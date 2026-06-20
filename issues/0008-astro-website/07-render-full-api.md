# Experiment 7: Rebuild the catalog to 29 packages and render the full API

## Description

Replace the stub docs with real ones: correct the package catalog to the actual
**29 published packages** and render **every export with its full signature** on
each package page, driven by the verified catalog from Experiment 6. This is the
core fix for the reopen — no more summary-plus-install stubs, no hand-picked
subset.

Scope of this experiment: the complete, accurate **API reference** per package
(every export: name, kind, signature(s), and JSDoc where present). Per-package
**usage examples** and the docs overview/final-close are the next experiment.

## Changes

- `ts/website/scripts/extract-api.ts` — also capture each package's
  `description` (from its `package.json`) into the generated catalog, so summaries
  are verified, not transcribed.
- `ts/website/src/data/api.ts` — add `description` to `PackageApi`.
- `ts/website/src/data/packages.ts` — rewrite as the curated mapping for **all
  29** packages: `{ slug, npm, category }` in display order, grouped into
  accurate categories (Core buffers; Hashing & KDF; Elliptic curve; Symmetric
  ciphers; Authenticated encryption; Diffie-Hellman encryption; Post-quantum
  primitives; Hybrid post-quantum). Summary/description come from the catalog;
  install is derived (`npm install <npm>`). The umbrella `webbuf` uses slug
  `webbuf`; `@webbuf/webbuf` uses slug `core`.
- `ts/website/src/components/ApiExport.astro` — render one export: name, a kind
  badge, JSDoc prose if present, and a `tokyo-night` code block of its
  signature(s) (overloads / class members one per line).
- `ts/website/src/pages/docs/[slug].astro` — render the package description,
  install, and the **full API list** (every export via `ApiExport`), grouped by
  kind (constants, functions, classes, interfaces, types); keep prev/next.
- `ts/website/src/pages/docs/index.astro` and `DocsLayout.astro` — drive the
  overview grid and sidebar from the corrected 29-package, 8-category catalog.

## Verification

1. `pnpm --filter @webbuf/website extract:api` regenerates the catalog with
   `description` for all 29 packages (deterministic).
2. `pnpm --filter @webbuf/website lint` → 0 errors.
3. `pnpm --filter @webbuf/website check` → 0 errors.
4. `pnpm --filter @webbuf/website build` emits **29** package pages
   (`/docs/<slug>/index.html`) plus `/docs` and the landing page.
5. Every package page lists **every export** from the catalog. Programmatic
   check over the built HTML: for each package, the count of rendered export
   anchors equals `api.generated.json`'s export count for that package (spot-set
   incl. `blake3` = 3, `fixedbuf` = 1 class with its members, `secp256k1` = 8,
   `slhdsa` = 97).
6. Dev server: `/docs/slhdsa`, `/docs/mlkem`, `/docs/core` → 200 with rendered
   signatures.

Pass criteria: all steps succeed and no package page is a stub (every export is
present with its real signature).

## Result

**Pass.**

- `extract:api` now also records each package's `description`; catalog
  regenerated deterministically for all 29.
- `lint` → 0 errors; `check` → 0 errors / 0 warnings / 0 hints.
- `build` → **31 pages** (29 package pages + `/docs` + landing).
- **Completeness check**: a script compared, for every package, the count of
  rendered export blocks (`scroll-mt-24`) in the built HTML against
  `api.generated.json`'s export count — **29/29 pages match, 0 mismatches, 0
  missing**. Every export is rendered with its real signature; no stubs remain.
- Dev smoke test: `/docs/slhdsa` (97 exports), `/docs/mlkem`, `/docs/core`, and
  `/docs` all → 200 with rendered `tokyo-night` signatures.

The package catalog (`src/data/packages.ts`) now lists all 29 packages in eight
accurate categories; summaries derive from the verified `description` (runtime
boilerplate trimmed) and installs from the npm name. Each package page renders
the description, install, and the full API grouped by kind (Constants /
Functions / Classes / Interfaces / Type aliases …), each export via the new
`ApiExport` component.

## Conclusion

The reopen's core defect is fixed: every published package has its own page
documenting **every export with its real, compiler-derived signature** — 0
stubs, verified programmatically against the catalog. What remains for closure is
per-package **usage examples** (sourced from each `README.md` where present), a
refreshed docs overview, and a final verification pass.

Next experiment (to be designed): add verified usage examples and the
overview/final-verification, then re-close the issue.
