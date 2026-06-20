# Experiment 8: Verified usage examples, overview refresh, and close

## Description

Complete the docs and close the issue. Add a **verified usage example** to each
package page, sourced from the maintainer's own README (never invented), refresh
the docs overview for the corrected 29-package catalog, run a full final
verification, and re-close the issue with a fresh Conclusion.

Source of usage examples: each package README's **first TypeScript/JavaScript
fenced code block** — the maintainer's authoritative example, which lives under
headings like `## Usage` or `## Preferred API`. Packages without any such block
simply show no usage section (the full API reference still renders); nothing is
fabricated.

## Changes

- `ts/website/scripts/extract-api.ts` — also read each package `README.md` and
  capture the first `typescript`/`ts`/`js`/`javascript` fenced block as
  `usage` (string | null) plus `usageLang`.
- `ts/website/src/data/api.ts` — add `usage` / `usageLang` to `PackageApi`.
- `ts/website/src/pages/docs/[slug].astro` — render a **Usage** section
  (`tokyo-night` code block) between Install and the API reference when a usage
  example exists.
- `ts/website/src/pages/docs/index.astro` — refresh the overview copy for the 29
  packages / eight categories.
- Close the issue: add a `## Conclusion`, set frontmatter `status = "closed"`
  + `closed`, regenerate the index.

## Verification

1. `extract:api` captures a usage example for the packages that have one
   (expected ≈ all that ship a TS/JS README block); coverage is logged; the
   catalog is deterministic.
2. `lint` → 0 errors; `check` → 0 errors; `prettier --check` clean.
3. `build` → 31 pages; the completeness re-check (rendered export blocks ==
   catalog counts) still passes for all 29.
4. A sampled package with a README example (e.g. `/docs/blake3`,
   `/docs/secp256k1`) renders a Usage code block matching the README; a package
   without one (e.g. `/docs/mldsa`) renders no Usage block but the full API.
5. `astro preview` (production build) serves `/`, `/docs`, and a package page
   → 200.
6. `pnpm install` at the `ts/` root is clean.

Pass criteria: all steps succeed; then the issue is closed (Conclusion +
frontmatter + index) as a separate close commit.
